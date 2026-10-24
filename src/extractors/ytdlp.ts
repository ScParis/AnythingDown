import path from 'node:path';
import fs from 'node:fs';
import { BaseExtractor } from './base.js';
import { MediaInfo, MediaFormat, MediaType, MediaItem } from '../types/media.js';
import { DownloadOptions, DownloadResult } from '../types/options.js';
import { BinaryManager } from '../core/binary-manager.js';
import { ProcessRunner } from '../core/process-runner.js';
import { ensureDir, generateId, sanitizeFilename } from '../utils/file.js';
import { Logger } from '../utils/logger.js';

export class YtDlpExtractor extends BaseExtractor {
  public readonly name = 'yt-dlp';
  private binaryManager: BinaryManager;

  constructor(binaryManager: BinaryManager) {
    super();
    this.binaryManager = binaryManager;
  }

  public canHandle(_url: string): boolean {
    return true; // yt-dlp handles 1800+ sites plus generic extractor
  }

  public async getInfo(url: string, options: DownloadOptions = {}): Promise<MediaInfo> {
    const ytdlpPath = await this.binaryManager.getYtDlpPath();
    const args = [
      '--dump-single-json',
      '--no-warnings',
      '--no-playlist',
      '--skip-download',
      '--ignore-no-formats-error',
      '--format', 'all/best',
      '--js-runtimes', 'node',
    ];

    const cookiesArg = options.cookies || process.env.COOKIES_FILE || process.env.YTDLP_COOKIES;
    if (cookiesArg) {
      args.push('--cookies', cookiesArg);
    }
    const proxyArg = options.proxy || process.env.HTTP_PROXY || process.env.HTTPS_PROXY || process.env.ALL_PROXY || process.env.PROXY;
    if (proxyArg) {
      args.push('--proxy', proxyArg);
    }
    if (options.additionalArgs) {
      args.push(...options.additionalArgs);
    }

    args.push(url);

    const { stdout, stderr, exitCode } = await ProcessRunner.run(ytdlpPath, args);
    if (exitCode !== 0 || !stdout.trim()) {
      throw new Error(`Failed to extract metadata via yt-dlp: ${stderr || 'Unknown error'}`);
    }

    const raw = JSON.parse(stdout);

    const formats: MediaFormat[] = (raw.formats || []).map((f: any) => ({
      formatId: f.format_id,
      ext: f.ext,
      resolution: f.resolution || (f.width && f.height ? `${f.width}x${f.height}` : undefined),
      width: f.width,
      height: f.height,
      fps: f.fps,
      bitrate: f.tbr || f.vbr || f.abr,
      filesize: f.filesize || f.filesize_approx,
      url: f.url,
      hasAudio: f.acodec !== 'none' && !!f.acodec,
      hasVideo: f.vcodec !== 'none' && !!f.vcodec,
    }));

    const hasFormatsWithVideo = formats.some(f => f.hasVideo);
    const hasFormatsWithAudio = formats.some(f => f.hasAudio);

    let mediaType: MediaType = 'video';
    if (!hasFormatsWithVideo && hasFormatsWithAudio) {
      mediaType = 'audio';
    } else if (raw.vcodec === 'none' && raw.acodec !== 'none') {
      mediaType = 'audio';
    } else if (!hasFormatsWithVideo && !hasFormatsWithAudio) {
      if ((raw.entries && raw.entries.length > 1) || raw._type === 'playlist') {
        mediaType = 'slideshow';
      } else {
        mediaType = 'image';
      }
    }

    const mediaItems: MediaItem[] = [];
    if (raw.entries && Array.isArray(raw.entries)) {
      for (const entry of raw.entries) {
        const thumbs = entry.thumbnails || [];
        const bestThumb = thumbs.slice().sort((a: any, b: any) => ((b.width || 0) * (b.height || 0)) - ((a.width || 0) * (a.height || 0)))[0];
        const itemUrl = bestThumb?.url || entry.url;
        if (itemUrl) {
          mediaItems.push({
            type: 'image',
            url: itemUrl,
            width: bestThumb?.width,
            height: bestThumb?.height,
          });
        }
      }
    } else if (raw.url) {
      mediaItems.push({ type: (mediaType === 'slideshow' ? 'image' : mediaType) as 'video' | 'image' | 'audio', url: raw.url });
    } else if (raw.thumbnails && Array.isArray(raw.thumbnails) && raw.thumbnails.length > 0) {
      const bestThumb = raw.thumbnails.slice().sort((a: any, b: any) => ((b.width || 0) * (b.height || 0)) - ((a.width || 0) * (a.height || 0)))[0];
      if (bestThumb?.url) {
        mediaItems.push({ type: 'image', url: bestThumb.url, width: bestThumb.width, height: bestThumb.height });
      }
    }

    return {
      id: raw.id || generateId(10),
      title: raw.title || 'Untitled',
      description: raw.description,
      thumbnail: raw.thumbnail,
      duration: raw.duration,
      author: {
        id: raw.uploader_id,
        name: raw.uploader || raw.channel,
        username: raw.uploader_id || raw.channel_id,
        url: raw.uploader_url || raw.channel_url,
      },
      platform: raw.extractor || 'unknown',
      originalUrl: url,
      type: mediaType,
      formats,
      media: mediaItems,
      raw,
    };
  }

  public async download(url: string, options: DownloadOptions = {}): Promise<DownloadResult> {
    const ytdlpPath = await this.binaryManager.getYtDlpPath();
    const ffmpegPath = this.binaryManager.getFfmpegPath();

    const outputDir = options.outputDir || process.cwd();
    ensureDir(outputDir);

    const filePrefix = options.filename ? sanitizeFilename(options.filename) : `anythingdown_${generateId(12)}`;
    const outputTemplate = path.join(outputDir, `${filePrefix}.%(ext)s`);

    const args = [
      '--no-warnings',
      '--no-playlist',
      '--output', outputTemplate,
      '--print-json',
      '--js-runtimes', 'node',
    ];

    if (ffmpegPath) {
      const ffmpegDir = fs.existsSync(ffmpegPath) && fs.statSync(ffmpegPath).isDirectory()
        ? ffmpegPath
        : path.dirname(ffmpegPath);
      args.push('--ffmpeg-location', ffmpegDir);
    }

    if (options.audioOnly) {
      args.push('--extract-audio');
      args.push('--audio-format', options.audioFormat || 'mp3');
      args.push('--audio-quality', '0');
      args.push('-f', 'bestaudio/best');
    } else if (options.quality) {
      if (options.quality === 'best') {
        args.push('-f', 'bestvideo+bestaudio/bestvideo/bestaudio/best');
      } else if (options.quality === 'worst') {
        args.push('-f', 'worst');
      } else {
        const height = options.quality.replace(/[^\d]/g, '');
        if (height) {
          args.push('-f', `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]/best`);
        }
      }
    }

    const cookiesArg = options.cookies || process.env.COOKIES_FILE || process.env.YTDLP_COOKIES;
    if (cookiesArg) {
      args.push('--cookies', cookiesArg);
    }
    const proxyArg = options.proxy || process.env.HTTP_PROXY || process.env.HTTPS_PROXY || process.env.ALL_PROXY || process.env.PROXY;
    if (proxyArg) {
      args.push('--proxy', proxyArg);
    }
    if (options.additionalArgs) {
      args.push(...options.additionalArgs);
    }

    args.push(url);

    const { stdout, stderr, exitCode } = await ProcessRunner.run(ytdlpPath, args, {
      onProgress: options.onProgress,
    });

    if (exitCode !== 0) {
      let friendlyError = stderr || 'yt-dlp download failed';
      if (friendlyError.includes('No video formats found')) {
        friendlyError = 'Este post é composto por fotos/imagens e não contém faixas de vídeo ou áudio para download.';
      } else if (friendlyError.includes('Requested format is not available')) {
        friendlyError = 'O formato solicitado não está disponível para esta mídia.';
      } else if (friendlyError.includes('This video is unavailable') || friendlyError.includes('Video unavailable')) {
        friendlyError = 'Esta mídia não está mais disponível ou foi removida da plataforma.';
      } else if (friendlyError.includes("This content isn't available to everyone") || friendlyError.includes("can't be seen by certain audiences")) {
        friendlyError = 'Este post possui restrição de audiência (idade, região ou conteúdo sensível) definida pelo autor da postagem.';
      }
      return {
        success: false,
        error: friendlyError,
      };
    }

    let parsedInfo: any = null;
    const jsonLines = stdout.trim().split('\n');
    for (let i = jsonLines.length - 1; i >= 0; i--) {
      try {
        parsedInfo = JSON.parse(jsonLines[i]);
        break;
      } catch {
        // Continue searching
      }
    }

    let finalExt = options.audioOnly ? (options.audioFormat || 'mp3') : (parsedInfo?.ext || 'mp4');
    let finalFilePath = path.join(outputDir, `${filePrefix}.${finalExt}`);

    if (!fs.existsSync(finalFilePath)) {
      const files = fs.readdirSync(outputDir);
      const matched = files.find(f => f.startsWith(filePrefix));
      if (matched) {
        finalFilePath = path.join(outputDir, matched);
        finalExt = path.extname(matched).replace('.', '');
      }
    }

    return {
      success: true,
      filePath: finalFilePath,
      filename: path.basename(finalFilePath),
      extension: finalExt,
      info: parsedInfo,
    };
  }
}
