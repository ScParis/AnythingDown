import { Bot, InlineKeyboard, InputFile } from 'grammy';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { AnythingDown } from '../core/downloader.js';
import { detectPlatform, isValidUrl } from '../utils/url-detector.js';
import { removeFileSafe, generateId } from '../utils/file.js';
import { Logger } from '../utils/logger.js';

export function createTelegramBot(token: string) {
  const bot = new Bot(token);
  const downloader = new AnythingDown();

  // Store active sessions / url mappings in memory
  const urlCache = new Map<string, { url: string; title: string }>();

  bot.command('start', (ctx) => {
    ctx.reply(
      '👋 *Olá! Eu sou o AnythingDown Bot.*\n\n' +
      'Envie qualquer link de vídeo ou post do:\n' +
      '• 📸 *Instagram* (Reels, Feed, Stories)\n' +
      '• 🎵 *TikTok* (Vídeos sem marca d\'água)\n' +
      '• 📘 *Facebook* (Vídeos e Reels)\n' +
      '• ▶️ *YouTube* (Vídeos e Shorts)\n' +
      '• 🐦 *Twitter / X*\n' +
      '• 👾 *Reddit, Twitch, SoundCloud, etc.*\n\n' +
      'Basta colar o link diretamente aqui!',
      { parse_mode: 'Markdown' }
    );
  });

  bot.command('help', (ctx) => {
    ctx.reply(
      '💡 *Como usar:*\n' +
      '1. Copie o link do vídeo de qualquer rede social.\n' +
      '2. Cole e envie aqui no chat.\n' +
      '3. Escolha se quer baixar como *Vídeo (MP4)* ou *Áudio (MP3)*.\n' +
      '4. O bot processará e enviará o arquivo diretamente no Telegram!',
      { parse_mode: 'Markdown' }
    );
  });

  // Handle incoming text messages containing URLs
  bot.on('message:text', async (ctx) => {
    const text = ctx.message.text.trim();
    const urlMatch = text.match(/https?:\/\/[^\s]+/i);

    if (!urlMatch) {
      return;
    }

    const url = urlMatch[0];
    const platform = detectPlatform(url);

    if (platform === 'unknown' && !isValidUrl(url)) {
      return;
    }

    const waitMsg = await ctx.reply('🔍 *Analisando link...*', { parse_mode: 'Markdown' });

    try {
      const info = await downloader.getInfo(url);
      const actionId = generateId(8);
      urlCache.set(actionId, { url, title: info.title });

      const keyboard = new InlineKeyboard()
        .text('📹 Baixar Vídeo (MP4)', `dl:video:${actionId}`)
        .text('🎵 Baixar Áudio (MP3)', `dl:audio:${actionId}`);

      const caption =
        `🎬 *${info.title}*\n\n` +
        `👤 *Autor:* ${info.author?.name || 'Desconhecido'}\n` +
        `⏱ *Duração:* ${info.duration ? `${Math.floor(info.duration / 60)}m ${info.duration % 60}s` : 'N/A'}\n` +
        `🌐 *Plataforma:* ${info.platform.toUpperCase()}\n\n` +
        `Escolha o formato desejado:`;

      if (info.thumbnail) {
        await ctx.replyWithPhoto(info.thumbnail, {
          caption,
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        });
        await ctx.api.deleteMessage(ctx.chat.id, waitMsg.message_id).catch(() => {});
      } else {
        await ctx.api.editMessageText(ctx.chat.id, waitMsg.message_id, caption, {
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        });
      }
    } catch (err: any) {
      await ctx.api.editMessageText(
        ctx.chat.id,
        waitMsg.message_id,
        `❌ *Erro ao processar link:*\n${err.message}`,
        { parse_mode: 'Markdown' }
      );
    }
  });

  // Handle download button clicks
  bot.callbackQuery(/^dl:(video|audio):([a-zA-Z0-9]+)$/, async (ctx) => {
    if (!ctx.chat) return;

    const chatId = ctx.chat.id;
    const action = ctx.match[1];
    const actionId = ctx.match[2];
    const cached = urlCache.get(actionId);

    if (!cached) {
      await ctx.answerCallbackQuery({ text: 'Link expirado. Envie o link novamente.', show_alert: true });
      return;
    }

    await ctx.answerCallbackQuery();
    const isAudio = action === 'audio';

    const statusMsg = await ctx.reply(
      `⏳ *Baixando ${isAudio ? 'áudio (MP3)' : 'vídeo (MP4)'}...*\nAguarde um instante.`,
      { parse_mode: 'Markdown' }
    );

    const tempDir = path.join(os.tmpdir(), 'anythingdown_bot');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    let filePath: string | undefined;

    try {
      const result = await downloader.download(cached.url, {
        outputDir: tempDir,
        audioOnly: isAudio,
        audioFormat: 'mp3',
      });

      if (!result.success || !result.filePath || !fs.existsSync(result.filePath)) {
        throw new Error(result.error || 'Falha no download da mídia');
      }

      filePath = result.filePath;
      await ctx.api.editMessageText(
        chatId,
        statusMsg.message_id,
        '📤 *Enviando arquivo para o Telegram...*',
        { parse_mode: 'Markdown' }
      );

      const inputFile = new InputFile(filePath);

      if (isAudio) {
        await ctx.replyWithAudio(inputFile, {
          title: cached.title,
          caption: `🎵 ${cached.title}`,
        });
      } else {
        await ctx.replyWithVideo(inputFile, {
          caption: `📹 ${cached.title}`,
          supports_streaming: true,
        });
      }

      await ctx.api.deleteMessage(chatId, statusMsg.message_id).catch(() => {});
    } catch (err: any) {
      await ctx.api.editMessageText(
        chatId,
        statusMsg.message_id,
        `❌ *Erro ao baixar:* ${err.message}`,
        { parse_mode: 'Markdown' }
      );
    } finally {
      if (filePath) {
        removeFileSafe(filePath);
      }
    }
  });

  return bot;
}
