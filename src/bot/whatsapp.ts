import makeWASocketPkg from '@whiskeysockets/baileys';
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { AnythingDown } from '../core/downloader.js';
import { detectPlatform, isValidUrl } from '../utils/url-detector.js';
import { removeFileSafe, ensureDir } from '../utils/file.js';
import { Logger } from '../utils/logger.js';

// Access baileys functions safely across ESM/CJS interop
const makeWASocket = (makeWASocketPkg as any).default || makeWASocketPkg;
const useMultiFileAuthState = (makeWASocketPkg as any).useMultiFileAuthState;
const DisconnectReason = (makeWASocketPkg as any).DisconnectReason;

export async function startWhatsAppBot() {
  const authDir = path.join(os.homedir(), '.anythingdown', 'whatsapp_auth');
  ensureDir(authDir);

  const { state, saveCreds } = await useMultiFileAuthState(authDir);
  const downloader = new AnythingDown();

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update: any) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('\n📱 Escaneie o QR Code abaixo com o seu WhatsApp para conectar o bot:\n');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'close') {
      const shouldReconnect =
        (lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason.loggedOut;
      Logger.warn(`Conexão do WhatsApp fechada. Reconectando: ${shouldReconnect}`);
      if (shouldReconnect) {
        startWhatsAppBot();
      }
    } else if (connection === 'open') {
      Logger.info('✅ WhatsApp Bot conectado com sucesso!');
    }
  });

  sock.ev.on('messages.upsert', async (m: any) => {
    try {
      const msg = m.messages[0];
      if (!msg || !msg.message || msg.key.fromMe) return;

      const remoteJid = msg.key.remoteJid;
      if (!remoteJid) return;

      const text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        '';

      const urlMatch = text.match(/https?:\/\/[^\s]+/i);
      if (!urlMatch) return;

      const url = urlMatch[0];
      const platform = detectPlatform(url);

      if (platform === 'unknown' && !isValidUrl(url)) {
        return;
      }

      const isAudio = text.toLowerCase().includes('audio') || text.toLowerCase().includes('mp3');

      await sock.sendMessage(remoteJid, {
        text: `⏳ *AnythingDown:* Detectado link do *${platform.toUpperCase()}*.\nBaixando ${isAudio ? 'áudio (MP3)' : 'vídeo'}...`,
      });

      const tempDir = path.join(os.tmpdir(), 'anythingdown_whatsapp');
      ensureDir(tempDir);

      let filePath: string | undefined;

      try {
        const result = await downloader.download(url, {
          outputDir: tempDir,
          audioOnly: isAudio,
          audioFormat: 'mp3',
        });

        if (!result.success || !result.filePath || !fs.existsSync(result.filePath)) {
          throw new Error(result.error || 'Falha ao processar download');
        }

        filePath = result.filePath;
        const fileBuffer = fs.readFileSync(filePath);
        const caption = `🎬 *${result.info?.title || 'Mídia baixada'}*\n\n_Enviado por AnythingDown_`;

        if (isAudio) {
          await sock.sendMessage(remoteJid, {
            audio: fileBuffer,
            mimetype: 'audio/mp4',
            fileName: `${result.filename || 'audio'}.mp3`,
          });
        } else {
          await sock.sendMessage(remoteJid, {
            video: fileBuffer,
            caption,
            mimetype: 'video/mp4',
          });
        }
      } catch (err: any) {
        await sock.sendMessage(remoteJid, {
          text: `❌ *Erro ao baixar:* ${err.message}`,
        });
      } finally {
        if (filePath) {
          removeFileSafe(filePath);
        }
      }
    } catch (err: any) {
      Logger.error(`Erro ao processar mensagem do WhatsApp: ${err.message}`);
    }
  });

  return sock;
}
