import fs from 'node:fs';
import { BinaryManager } from './binary-manager.js';
import { BaseExtractor } from '../extractors/base.js';
import { YtDlpExtractor } from '../extractors/ytdlp.js';
import { TikTokExtractor } from '../extractors/tiktok.js';
import { InstagramExtractor } from '../extractors/instagram.js';
import { FacebookExtractor } from '../extractors/facebook.js';
import { MediaInfo } from '../types/media.js';
import { ClientConfig, DownloadOptions, DownloadResult } from '../types/options.js';
import { detectPlatform, PlatformType } from '../utils/url-detector.js';
import { Logger } from '../utils/logger.js';
import { removeFileSafe } from '../utils/file.js';

export class AnythingDown {
  private binaryManager: BinaryManager;
  private nativeExtractors: BaseExtractor[];
  private ytdlpExtractor: YtDlpExtractor;
  private preferNative: boolean;

  constructor(config: ClientConfig = {}) {
    this.binaryManager = new BinaryManager({
      binDir: config.binDir,
      ytdlpPath: config.ytdlpPath,
      ffmpegPath: config.ffmpegPath,
      autoDownload: config.autoDownloadBinaries ?? true,
    });

    this.preferNative = config.preferNative ?? true;
    this.ytdlpExtractor = new YtDlpExtractor(this.binaryManager);

    this.nativeExtractors = [
      new TikTokExtractor(),
      new InstagramExtractor(),
      new FacebookExtractor(),
    ];
  }

  public detectPlatform(url: string): PlatformType {
    return detectPlatform(url);
  }

  public async getInfo(url: string, options: DownloadOptions = {}): Promise<MediaInfo> {
    const shouldUseNative = (options.preferNative ?? this.preferNative);

    if (shouldUseNative) {
      const native = this.nativeExtractors.find(e => e.canHandle(url));
      if (native) {
        try {
          Logger.debug(`Attempting native extraction with ${native.name} for ${url}`);
          return await native.getInfo(url, options);
        } catch (err: any) {
          Logger.debug(`Native extractor ${native.name} failed (${err.message}). Falling back to yt-dlp...`);
        }
      }
    }

    // Universal fallback via yt-dlp
    return await this.ytdlpExtractor.getInfo(url, options);
  }

  public async download(url: string, options: DownloadOptions = {}): Promise<DownloadResult> {
    const shouldUseNative = (options.preferNative ?? this.preferNative);

    // If audioOnly requested, yt-dlp + ffmpeg is almost always superior for clean MP3 encoding
    if (shouldUseNative && !options.audioOnly) {
      const native = this.nativeExtractors.find(e => e.canHandle(url));
      if (native) {
        try {
          Logger.debug(`Attempting native download with ${native.name} for ${url}`);
          const res = await native.download(url, options);
          if (res.success) {
            return await this.handlePostDownload(res, options);
          }
        } catch (err: any) {
          Logger.debug(`Native download failed (${err.message}). Falling back to yt-dlp...`);
        }
      }
    }

    // Universal fallback via yt-dlp
    const res = await this.ytdlpExtractor.download(url, options);
    return await this.handlePostDownload(res, options);
  }

  public async downloadAudio(url: string, options: DownloadOptions = {}): Promise<DownloadResult> {
    return await this.download(url, {
      ...options,
      audioOnly: true,
      audioFormat: options.audioFormat || 'mp3',
    });
  }

  private async handlePostDownload(result: DownloadResult, options: DownloadOptions): Promise<DownloadResult> {
    if (result.success && result.filePath) {
      if (options.deleteAfterDownload) {
        try {
          const buffer = fs.readFileSync(result.filePath);
          removeFileSafe(result.filePath);
          return {
            ...result,
            buffer,
          };
        } catch (err: any) {
          Logger.warn(`Failed to read buffer before deleting file: ${err.message}`);
        }
      }
    }
    return result;
  }

  public async updateBinaries(): Promise<boolean> {
    return await this.binaryManager.updateYtDlp();
  }

  // --- Static Quick Helpers ---

  public static async getInfo(url: string, options?: DownloadOptions): Promise<MediaInfo> {
    const instance = new AnythingDown();
    return await instance.getInfo(url, options);
  }

  public static async download(url: string, options?: DownloadOptions): Promise<DownloadResult> {
    const instance = new AnythingDown();
    return await instance.download(url, options);
  }

  public static async downloadAudio(url: string, options?: DownloadOptions): Promise<DownloadResult> {
    const instance = new AnythingDown();
    return await instance.downloadAudio(url, options);
  }
}
