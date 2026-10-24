import path from 'node:path';
import fs from 'node:fs';
import { BaseExtractor } from './base.js';
import { MediaInfo, MediaFormat, MediaType } from '../types/media.js';
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

    let mediaType: MediaType = 'video';
    if (raw.vcodec === 'none' && raw.acodec !== 'none') {
      mediaType = 'audio';
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
      media: raw.url ? [{ type: mediaType, url: raw.url }] : [],
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
    } else if (options.quality) {
      if (options.quality === 'best') {
        args.push('-f', 'bestvideo+bestaudio/best');
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
      return {
        success: false,
        error: stderr || 'yt-dlp download failed',
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
