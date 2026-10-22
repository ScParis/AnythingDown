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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createServer() {
  const app = express();
  const downloader = new AnythingDown();

  app.use(cors());
  app.use(express.json());

  // Serve static files from public directory
  const publicDir = path.join(__dirname, 'public');
  if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));
  }

  // Health check
  app.get('/api/health', async (_req: Request, res: Response) => {
    try {
      const ytdlp = await downloader['binaryManager'].getYtDlpPath();
      const ffmpeg = downloader['binaryManager'].getFfmpegPath();
      res.json({
        status: 'ok',
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        binaries: {
          ytdlp: { path: ytdlp, ready: true },
          ffmpeg: { path: ffmpeg || null, ready: !!ffmpeg },
        },
      });
    } catch (err: any) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  });

  // Extract Info
  app.post('/api/info', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { url } = req.body;
      if (!url || typeof url !== 'string' || !isValidUrl(url)) {
        res.status(400).json({ error: 'Valid URL is required.' });
        return;
      }

      const platform = detectPlatform(url);
      const info = await downloader.getInfo(url);

      res.json({
        success: true,
        platform,
        data: info,
      });
    } catch (err) {
      next(err);
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

export function startApiServer(port = 3000) {
  const app = createServer();
  const server = app.listen(port, (err?: Error) => {
    if (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if (code === 'EADDRINUSE') {
        Logger.error(`Porta ${port} já está em uso. Use outra porta: PORT=3001 npm run start:api`);
      } else {
        Logger.error(`Falha ao iniciar servidor: ${err.message}`);
      }
      process.exit(1);
    }
    Logger.info(`🚀 AnythingDown REST API running at http://localhost:${port}`);
    Logger.info(`📊 Health check: http://localhost:${port}/api/health`);
  });
  return server;
}

// Auto start if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = parseInt(process.env.PORT || '3000', 10);
  startApiServer(port);
}
