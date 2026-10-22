import fs from 'node:fs';
import path from 'node:path';
import axios from 'axios';
import { BaseExtractor } from './base.js';
import { MediaInfo, MediaItem } from '../types/media.js';
import { DownloadOptions, DownloadResult } from '../types/options.js';
import { detectPlatform } from '../utils/url-detector.js';
import { ensureDir, generateId, sanitizeFilename } from '../utils/file.js';
import { Logger } from '../utils/logger.js';

export class FacebookExtractor extends BaseExtractor {
  public readonly name = 'facebook-native';

  private defaultHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Sec-Fetch-Mode': 'navigate',
  };

  public canHandle(url: string): boolean {
    return detectPlatform(url) === 'facebook';
  }

  public async getInfo(url: string, _options: DownloadOptions = {}): Promise<MediaInfo> {
    try {
      const response = await axios.get(url, {
        headers: this.defaultHeaders,
        timeout: 10000,
      });

      const html = response.data;
      if (typeof html !== 'string') {
        throw new Error('Invalid response from Facebook');
      }

      // Regex matches for direct video URLs in Facebook web scripts
      const hdMatch = html.match(/"browser_native_hd_url":"(https:[^"]+)"/) ||
                      html.match(/"playable_url_quality_hd":"(https:[^"]+)"/);
      const sdMatch = html.match(/"browser_native_sd_url":"(https:[^"]+)"/) ||
                      html.match(/"playable_url":"(https:[^"]+)"/);

      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1].replace(' | Facebook', '').trim() : 'Facebook Video';

      const cleanUrl = (raw: string) => JSON.parse(`"${raw}"`);

      const mediaItems: MediaItem[] = [];
      if (hdMatch) {
        mediaItems.push({ type: 'video', url: cleanUrl(hdMatch[1]) });
      } else if (sdMatch) {
        mediaItems.push({ type: 'video', url: cleanUrl(sdMatch[1]) });
      }

      if (mediaItems.length === 0) {
        throw new Error('Could not extract direct stream URL from Facebook HTML natively.');
      }

      return {
        id: generateId(10),
        title,
        platform: 'facebook',
        originalUrl: url,
        type: 'video',
        formats: [],
        media: mediaItems,
      };
    } catch (err: any) {
      Logger.debug(`Facebook native extraction failed: ${err.message}`);
      throw err;
    }
  }

  public async download(url: string, options: DownloadOptions = {}): Promise<DownloadResult> {
    const info = await this.getInfo(url, options);
    const mediaItem = info.media[0];

    if (!mediaItem) {
      return { success: false, error: 'No video stream found for Facebook URL' };
    }

    const outputDir = options.outputDir || process.cwd();
    ensureDir(outputDir);

    const prefix = options.filename ? sanitizeFilename(options.filename) : `facebook_${info.id}_${generateId(6)}`;
    const ext = options.audioOnly ? (options.audioFormat || 'mp3') : 'mp4';
    const targetFile = path.join(outputDir, `${prefix}.${ext}`);

    const res = await axios.get(mediaItem.url, {
      responseType: 'stream',
      headers: this.defaultHeaders,
    });

    const totalBytes = Number(res.headers['content-length'] || 0) || null;
    let downloadedBytes = 0;
    const writer = fs.createWriteStream(targetFile);

    return new Promise((resolve) => {
      res.data.on('data', (chunk: Buffer) => {
        downloadedBytes += chunk.length;
        if (options.onProgress) {
          const percent = totalBytes ? Math.round((downloadedBytes / totalBytes) * 100) : 0;
          options.onProgress({
            status: percent >= 100 ? 'completed' : 'downloading',
            percent,
            downloadedBytes,
            totalBytes,
            speed: null,
            eta: null,
          });
        }
      });

      res.data.pipe(writer);
      writer.on('finish', () => {
        resolve({
          success: true,
          filePath: targetFile,
          filename: path.basename(targetFile),
          extension: ext,
          info,
        });
      });
      writer.on('error', (err) => {
        resolve({
          success: false,
          error: `Error writing Facebook file: ${err.message}`,
        });
      });
    });
  }
}
