import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { AnythingDown } from '../core/downloader.js';
import { detectPlatform, isValidUrl } from '../utils/url-detector.js';
import { sanitizeFilename, removeFileSafe, generateId } from '../utils/file.js';
import { Logger } from '../utils/logger.js';
import { createTelegramBot } from '../bot/telegram.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createServer() {
  const app = express();
  const downloader = new AnythingDown();

  // Automatically check Render Secret Files (/etc/secrets/cookies.txt) or env vars
  if (!process.env.COOKIES_FILE && fs.existsSync('/etc/secrets/cookies.txt')) {
    process.env.COOKIES_FILE = '/etc/secrets/cookies.txt';
    Logger.info('Found and configured cookies from Render Secret File: /etc/secrets/cookies.txt');
  }

  // Automatically extract raw cookies from env var if provided (Render Secret / Env Var)
  if (process.env.YTDLP_COOKIES_TEXT && !process.env.COOKIES_FILE) {
    try {
      const cookieFilePath = path.join(os.tmpdir(), 'ytdlp_env_cookies.txt');
      fs.writeFileSync(cookieFilePath, process.env.YTDLP_COOKIES_TEXT, { encoding: 'utf-8', mode: 0o600 });
      process.env.COOKIES_FILE = cookieFilePath;
      Logger.info(`Configured cookies from YTDLP_COOKIES_TEXT at ${cookieFilePath}`);
    } catch (e: any) {
      Logger.warn(`Failed to write YTDLP_COOKIES_TEXT to file: ${e.message}`);
    }
  }

  app.use(cors());
  app.use(express.json());

  // Serve static files from public directory
  const publicDir = path.join(__dirname, 'public');
  const srcPublicDir = path.join(process.cwd(), 'src', 'api', 'public');
  if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));
  } else if (fs.existsSync(srcPublicDir)) {
    app.use(express.static(srcPublicDir));
  }

  // Favicon handler
  app.get('/favicon.ico', (_req: Request, res: Response) => {
    res.status(204).end();
  });

  // Health check
  app.get('/api/health', async (_req: Request, res: Response) => {
    try {
      const ytdlp = await downloader['binaryManager'].getYtDlpPath();
      const ffmpeg = downloader['binaryManager'].getFfmpegPath();
      let ytdlpVersion = 'unknown';
      let ytdlpError = null;
      try {
        const { spawnSync } = await import('node:child_process');
        const v = spawnSync(ytdlp, ['--version'], { encoding: 'utf-8', timeout: 5000 });
        if (v.status === 0) {
          ytdlpVersion = v.stdout.trim();
        } else {
          ytdlpError = `status=${v.status}, stderr=${v.stderr}`;
        }
      } catch (e: any) {
        ytdlpError = e.message;
      }

      res.json({
        status: 'ok',
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        binaries: {
          ytdlp: { path: ytdlp, version: ytdlpVersion, error: ytdlpError, ready: true },
          ffmpeg: { path: ffmpeg || null, ready: !!ffmpeg },
        },
      });
    } catch (err: any) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  });

  // Extract Info
  app.post('/api/info', async (req: Request, res: Response): Promise<void> => {
    try {
      const { url } = req.body;
      if (!url || typeof url !== 'string' || !isValidUrl(url)) {
        res.status(400).json({ success: false, error: 'Por favor, insira uma URL válida para extrair.' });
        return;
      }

      const platform = detectPlatform(url);
      const info = await downloader.getInfo(url);

      res.json({
        success: true,
        platform,
        data: info,
      });
    } catch (err: any) {
      const rawMsg = err.message || '';
      let userFriendlyError = rawMsg;

      if (rawMsg.includes('This video is unavailable') || rawMsg.includes('Video unavailable')) {
        userFriendlyError = 'Este vídeo não está disponível no YouTube (pode ter sido excluído, tornado privado ou restrito).';
      } else if (rawMsg.includes('Sign in to confirm you’re not a bot') || rawMsg.includes('Sign in to confirm your age')) {
        userFriendlyError = 'O YouTube exige login ou verificação para este conteúdo.';
      } else if (rawMsg.includes('Failed to extract any player response') || rawMsg.includes('player response')) {
        userFriendlyError = 'O YouTube bloqueou temporariamente a requisição para este link específico ou o vídeo foi removido.';
      }

      Logger.warn(`Metadata extraction failed for ${req.body?.url}: ${rawMsg}`);
      res.status(422).json({
        success: false,
        error: userFriendlyError,
        rawError: rawMsg,
      });
    }
  });

  // Download with direct file streaming
  app.get('/api/download', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let tempFile: string | undefined;
    try {
      const url = req.query.url as string;
      const format = (req.query.format as string) || 'mp4';
      const isAudio = format === 'mp3' || req.query.audio === 'true';
      const quality = (req.query.quality as string) || 'best';

      if (!url || !isValidUrl(url)) {
        res.status(400).json({ error: 'Valid "url" query parameter is required.' });
        return;
      }

      const tempDir = path.join(os.tmpdir(), 'anythingdown_api');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const fileId = generateId(8);
      const filename = `media_${fileId}`;

      Logger.info(`API: Starting download for ${url} (isAudio=${isAudio})`);

      const result = await downloader.download(url, {
        outputDir: tempDir,
        filename,
        audioOnly: isAudio,
        audioFormat: 'mp3',
        quality,
      });

      if (!result.success || !result.filePath || !fs.existsSync(result.filePath)) {
        res.status(500).json({ error: result.error || 'Download failed on server' });
        return;
      }

      tempFile = result.filePath;
      const stat = fs.statSync(tempFile);
      const fileExt = path.extname(tempFile);
      const mediaTitle = result.info?.title ? sanitizeFilename(result.info.title) : `download_${fileId}`;
      const downloadName = `${mediaTitle}${fileExt}`;

      const mimeType = isAudio ? 'audio/mpeg' : 'video/mp4';

      res.setHeader('Content-Type', mimeType);
      const safeAscii = downloadName.replace(/[^\x20-\x7E]/g, '_');
      const encodedName = encodeURIComponent(downloadName);
      res.setHeader('Content-Disposition', `attachment; filename="${safeAscii}"; filename*=UTF-8''${encodedName}`);

      const fileStream = fs.createReadStream(tempFile);
      fileStream.pipe(res);

      fileStream.on('end', () => {
        removeFileSafe(tempFile);
      });

      fileStream.on('error', (err) => {
        removeFileSafe(tempFile);
        Logger.error(`Stream error: ${err.message}`);
      });

      res.on('close', () => {
        removeFileSafe(tempFile);
      });
    } catch (err) {
      if (tempFile) removeFileSafe(tempFile);
      next(err);
    }
  });

  // Global Error Handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    Logger.error(`API Error: ${err.message}`);
    res.status(500).json({
      success: false,
      error: err.message || 'Internal Server Error',
    });
  });

  return app;
}

export function startApiServer(port = 3000, host = '0.0.0.0') {
  const app = createServer();
  const server = app.listen(port, host, () => {
    Logger.info(`🚀 AnythingDown REST API running at http://${host}:${port}`);
    Logger.info(`📊 Health check: http://${host}:${port}/api/health`);

    // Verify and update yt-dlp asynchronously on startup to keep YouTube extractors fresh
    const downloader = new AnythingDown();
    downloader['binaryManager'].updateYtDlp().catch(() => {});
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      Logger.error(`Porta ${port} já está em uso. Use outra porta: PORT=3001 npm run start:api`);
    } else {
      Logger.error(`Falha ao iniciar servidor: ${err.message}`);
    }
    process.exit(1);
  });

  // Automatically start Telegram Bot if token is present in environment
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  if (telegramToken) {
    try {
      Logger.info('🤖 Variável TELEGRAM_BOT_TOKEN detectada. Iniciando bot do Telegram integrado...');
      const bot = createTelegramBot(telegramToken);
      bot.start({
        onStart: (botInfo) => {
          Logger.info(`✅ AnythingDown Telegram Bot online como @${botInfo.username}`);
        },
      }).catch((botErr: any) => {
        Logger.error(`Erro no loop do Telegram Bot: ${botErr.message}`);
      });
    } catch (err: any) {
      Logger.error(`Falha ao inicializar o Telegram Bot: ${err.message}`);
    }
  }

  return server;
}

// Auto start if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = parseInt(process.env.PORT || '3000', 10);
  const host = process.env.HOST || '0.0.0.0';
  startApiServer(port, host);
}
