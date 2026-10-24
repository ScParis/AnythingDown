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
import { MetricsManager } from '../core/metrics-manager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function reloadUnifiedCookies(): { sourcesCount: number; path: string | null; size: number } {
  try {
    const cookieSources: string[] = [];

    // 1. Generic Master Cookies
    if (process.env.YTDLP_COOKIES_TEXT) cookieSources.push(process.env.YTDLP_COOKIES_TEXT);
    if (process.env.COOKIES_TEXT) cookieSources.push(process.env.COOKIES_TEXT);

    // 2. Platform-Specific Variables
    if (process.env.INSTAGRAM_COOKIES_TEXT) cookieSources.push(process.env.INSTAGRAM_COOKIES_TEXT);
    if (process.env.TIKTOK_COOKIES_TEXT) cookieSources.push(process.env.TIKTOK_COOKIES_TEXT);
    if (process.env.TWITTER_COOKIES_TEXT) cookieSources.push(process.env.TWITTER_COOKIES_TEXT);
    if (process.env.FACEBOOK_COOKIES_TEXT) cookieSources.push(process.env.FACEBOOK_COOKIES_TEXT);
    if (process.env.YOUTUBE_COOKIES_TEXT) cookieSources.push(process.env.YOUTUBE_COOKIES_TEXT);

    // 3. Render Secret Files
    const secretFiles = [
      '/etc/secrets/cookies.txt',
      '/etc/secrets/instagram_cookies.txt',
      '/etc/secrets/youtube_cookies.txt',
      '/etc/secrets/tiktok_cookies.txt'
    ];
    for (const sf of secretFiles) {
      if (fs.existsSync(sf)) {
        try {
          const content = fs.readFileSync(sf, 'utf-8');
          if (content.trim()) cookieSources.push(content);
        } catch {}
      }
    }

    if (cookieSources.length > 0) {
      const masterCookiePath = path.join(os.tmpdir(), 'master_multiplatform_cookies.txt');
      const header = '# Netscape HTTP Cookie File\n# Multi-Platform Unified Cookie Jar for AnythingDown\n\n';
      const mergedContent = header + cookieSources.map(c => c.trim()).filter(Boolean).join('\n\n');
      fs.writeFileSync(masterCookiePath, mergedContent, { encoding: 'utf-8', mode: 0o600 });
      process.env.COOKIES_FILE = masterCookiePath;
      const size = fs.statSync(masterCookiePath).size;
      Logger.info(`Unified ${cookieSources.length} cookie sources into ${masterCookiePath} (${size} bytes)`);
      return { sourcesCount: cookieSources.length, path: masterCookiePath, size };
    }
  } catch (err: any) {
    Logger.warn(`Error configuring multi-platform cookies: ${err.message}`);
  }
  return { sourcesCount: 0, path: process.env.COOKIES_FILE || null, size: 0 };
}

export function createServer() {
  const app = express();
  const downloader = new AnythingDown();
  const metrics = MetricsManager.getInstance();
  const ADMIN_KEY = process.env.ADMIN_KEY || 'anythingdown_admin_2026';

  // Initialize unified cookies
  reloadUnifiedCookies();

  function requireAdmin(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers['authorization'];
    const customHeader = req.headers['x-admin-key'] as string;
    const queryKey = req.query.key as string;

    const token = (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null) || customHeader || queryKey;
    if (!token || token !== ADMIN_KEY) {
      res.status(401).json({ success: false, error: 'Acesso não autorizado. Chave administrativa inválida.' });
      return;
    }
    next();
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
        cookiesFile: process.env.COOKIES_FILE || null,
        cookiesExist: process.env.COOKIES_FILE ? fs.existsSync(process.env.COOKIES_FILE) : false,
        cookiesSize: process.env.COOKIES_FILE && fs.existsSync(process.env.COOKIES_FILE) ? fs.statSync(process.env.COOKIES_FILE).size : 0,
        binaries: {
          ytdlp: { path: ytdlp, version: ytdlpVersion, error: ytdlpError, ready: true },
          ffmpeg: { path: ffmpeg || null, ready: !!ffmpeg },
        },
      });
    } catch (err: any) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  });

  // Serve Admin Dashboard
  app.get('/admin', (_req: Request, res: Response) => {
    const adminPath = path.join(publicDir, 'admin.html');
    const srcAdminPath = path.join(srcPublicDir, 'admin.html');
    if (fs.existsSync(adminPath)) {
      res.sendFile(adminPath);
    } else if (fs.existsSync(srcAdminPath)) {
      res.sendFile(srcAdminPath);
    } else {
      res.status(404).send('Admin dashboard não encontrado.');
    }
  });

  // Admin API Endpoints
  app.get('/api/admin/metrics', requireAdmin, async (_req: Request, res: Response) => {
    try {
      const ytdlp = await downloader['binaryManager'].getYtDlpPath();
      const ffmpeg = downloader['binaryManager'].getFfmpegPath();
      const cookiesPath = process.env.COOKIES_FILE;
      const cookiesExist = cookiesPath ? fs.existsSync(cookiesPath) : false;
      const cookiesSize = cookiesExist && cookiesPath ? fs.statSync(cookiesPath).size : 0;

      res.json({
        success: true,
        timestamp: Date.now(),
        metrics: metrics.getSummary(),
        system: {
          serverUptime: process.uptime(),
          nodeVersion: process.version,
          platform: process.platform,
          arch: process.arch,
          memoryUsage: process.memoryUsage(),
          loadAvg: os.loadavg(),
          freeMem: os.freemem(),
          totalMem: os.totalmem(),
          binaries: {
            ytdlp: { path: ytdlp, ready: true },
            ffmpeg: { path: ffmpeg || null, ready: !!ffmpeg },
          },
          cookies: {
            file: cookiesPath,
            exists: cookiesExist,
            size: cookiesSize,
          }
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/admin/reload-cookies', requireAdmin, (_req: Request, res: Response) => {
    const result = reloadUnifiedCookies();
    res.json({ success: true, message: 'Cookies recarregados e unificados com sucesso!', result });
  });

  app.post('/api/admin/clear-temp', requireAdmin, (_req: Request, res: Response) => {
    const tempDir = path.join(os.tmpdir(), 'anythingdown_api');
    let removedFiles = 0;
    if (fs.existsSync(tempDir)) {
      const files = fs.readdirSync(tempDir);
      for (const f of files) {
        try {
          fs.unlinkSync(path.join(tempDir, f));
          removedFiles++;
        } catch {}
      }
    }
    res.json({ success: true, message: `Cache temporário limpo. ${removedFiles} arquivos removidos.` });
  });

  app.post('/api/admin/reset-metrics', requireAdmin, (_req: Request, res: Response) => {
    metrics.reset();
    res.json({ success: true, message: 'Métricas zeradas com sucesso.' });
  });

  // Extract Info
  app.post('/api/info', async (req: Request, res: Response): Promise<void> => {
    const startTime = Date.now();
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'unknown';
    try {
      const { url } = req.body;
      if (!url || typeof url !== 'string' || !isValidUrl(url)) {
        res.status(400).json({ success: false, error: 'Por favor, insira uma URL válida para extrair.' });
        return;
      }

      const platform = detectPlatform(url);
      const info = await downloader.getInfo(url);

      metrics.recordActivity({
        type: 'info',
        platform,
        statusCode: 200,
        durationMs: Date.now() - startTime,
        clientIp,
      });

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
      } else if (rawMsg.includes("This content isn't available to everyone") || rawMsg.includes("can't be seen by certain audiences")) {
        userFriendlyError = 'Este post do Instagram possui restrição de audiência (idade, região ou conteúdo sensível) definida pelo autor da postagem.';
      } else if (rawMsg.includes('empty media response') || rawMsg.includes('login required') || rawMsg.includes('Rate-limit reached')) {
        userFriendlyError = 'O Instagram exige login para visualizar este conteúdo específico (perfil privado ou restrito).';
      }

      const platform = req.body?.url ? detectPlatform(req.body.url) : 'unknown';
      metrics.recordActivity({
        type: 'info',
        platform,
        statusCode: 422,
        durationMs: Date.now() - startTime,
        error: userFriendlyError,
        clientIp,
      });

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
    const startTime = Date.now();
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'unknown';
    const url = req.query.url as string;
    const format = (req.query.format as string) || 'mp4';
    const isAudio = format === 'mp3' || req.query.audio === 'true';
    const quality = (req.query.quality as string) || 'best';
    const platform = url ? detectPlatform(url) : 'unknown';

    try {
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
        let errDesc = result.error || 'Falha ao processar download no servidor.';
        if (errDesc.includes('No video formats found')) {
          errDesc = 'Este post é composto exclusivamente por fotos/imagens e não possui fluxo de vídeo ou áudio para extração. Utilize a opção de baixar fotos.';
        }

        metrics.recordActivity({
          type: 'download',
          platform,
          format: isAudio ? 'mp3' : 'mp4',
          statusCode: 422,
          durationMs: Date.now() - startTime,
          error: errDesc,
          clientIp,
        });

        res.status(422).json({ error: errDesc });
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

      metrics.recordActivity({
        type: 'download',
        platform,
        format: isAudio ? 'mp3' : 'mp4',
        statusCode: 200,
        durationMs: Date.now() - startTime,
        clientIp,
      });

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
    } catch (err: any) {
      if (tempFile) removeFileSafe(tempFile);
      let errMsg = err.message || 'Erro interno no servidor de download.';
      if (errMsg.includes('No video formats found')) {
        errMsg = 'Este post é composto por fotos/imagens e não possui fluxo de vídeo ou áudio para download.';
      }

      metrics.recordActivity({
        type: 'download',
        platform,
        format: isAudio ? 'mp3' : 'mp4',
        statusCode: 422,
        durationMs: Date.now() - startTime,
        error: errMsg,
        clientIp,
      });

      res.status(422).json({ error: errMsg });
    }
  });

  // Direct Media File Proxy / Download (Images, Carousel Photos, etc.)
  app.get('/api/download-file', async (req: Request, res: Response): Promise<void> => {
    const startTime = Date.now();
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'unknown';

    try {
      const fileUrl = req.query.url as string;
      const customName = (req.query.filename as string) || 'foto_instagram.jpg';

      if (!fileUrl || !isValidUrl(fileUrl)) {
        res.status(400).json({ error: 'URL do arquivo inválida.' });
        return;
      }

      const response = await fetch(fileUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36',
          'Referer': 'https://www.instagram.com/',
        }
      });

      if (!response.ok) {
        metrics.recordActivity({
          type: 'file',
          platform: 'instagram',
          format: 'image',
          statusCode: 502,
          durationMs: Date.now() - startTime,
          error: 'Falha ao transferir mídia da CDN',
          clientIp,
        });

        res.status(502).json({ error: 'Falha ao transferir mídia da CDN de origem.' });
        return;
      }

      const contentType = response.headers.get('content-type') || 'image/jpeg';
      res.setHeader('Content-Type', contentType);

      const safeAscii = customName.replace(/[^\x20-\x7E]/g, '_');
      const encodedName = encodeURIComponent(customName);
      res.setHeader('Content-Disposition', `attachment; filename="${safeAscii}"; filename*=UTF-8''${encodedName}`);

      metrics.recordActivity({
        type: 'file',
        platform: 'instagram',
        format: 'image',
        statusCode: 200,
        durationMs: Date.now() - startTime,
        clientIp,
      });

      const buffer = Buffer.from(await response.arrayBuffer());
      res.send(buffer);
    } catch (err: any) {
      metrics.recordActivity({
        type: 'file',
        platform: 'instagram',
        format: 'image',
        statusCode: 500,
        durationMs: Date.now() - startTime,
        error: err.message,
        clientIp,
      });

      Logger.error(`Media download-file error: ${err.message}`);
      res.status(500).json({ error: 'Erro ao transferir arquivo de mídia.' });
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
