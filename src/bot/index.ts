import { fileURLToPath } from 'node:url';
import { createTelegramBot } from './telegram.js';
import { startWhatsAppBot } from './whatsapp.js';
import { Logger } from '../utils/logger.js';

export { createTelegramBot } from './telegram.js';
export { startWhatsAppBot } from './whatsapp.js';

export async function runBots() {
  const args = process.argv.slice(2);
  const runTelegram = args.includes('--telegram') || args.includes('--all') || !!process.env.TELEGRAM_BOT_TOKEN;
  const runWhatsApp = args.includes('--whatsapp') || args.includes('--all');

  if (!runTelegram && !runWhatsApp) {
    console.log(`
🤖 AnythingDown Multi-Platform Bot Runner

Uso:
  node dist/bot/index.js --telegram    # Iniciar bot do Telegram
  node dist/bot/index.js --whatsapp    # Iniciar bot do WhatsApp
  node dist/bot/index.js --all         # Iniciar ambos

Variáveis de Ambiente:
  TELEGRAM_BOT_TOKEN=seu_token_aqui
`);
    return;
  }

  if (runTelegram) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      Logger.error('TELEGRAM_BOT_TOKEN não informado. Defina a variável de ambiente.');
    } else {
      Logger.info('🚀 Iniciando AnythingDown Telegram Bot...');
      const bot = createTelegramBot(token);
      bot.start();
    }
  }

  if (runWhatsApp) {
    Logger.info('🚀 Iniciando AnythingDown WhatsApp Bot...');
    await startWhatsAppBot();
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runBots();
}
