import fs from 'node:fs';
import path from 'node:path';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { BaseExtractor } from './base.js';
import { MediaInfo, MediaItem } from '../types/media.js';
import { DownloadOptions, DownloadResult } from '../types/options.js';
import { detectPlatform, extractInstagramId } from '../utils/url-detector.js';
import { ensureDir, generateId, sanitizeFilename } from '../utils/file.js';
import { Logger } from '../utils/logger.js';

export class InstagramExtractor extends BaseExtractor {
  public readonly name = 'instagram-native';

  private defaultHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
  };

  public canHandle(url: string): boolean {
    return detectPlatform(url) === 'instagram';
  }

  /**
   * Method 1: Public Embed Page Scraping
   */
  private async extractFromEmbed(shortcode: string): Promise<{ title: string; media: MediaItem[] } | null> {
    try {
      const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/captioned/`;
      const res = await axios.get(embedUrl, {
        headers: this.defaultHeaders,
        timeout: 8000,
      });

      const $ = cheerio.load(res.data);
      const mediaItems: MediaItem[] = [];

      // Check for video tag
      const videoSrc = $('video.EmbeddedMediaVideo').attr('src');
      if (videoSrc) {
        mediaItems.push({
          type: 'video',
          url: videoSrc,
        });
      }

      // Check for image tag
      const imgSrc = $('img.EmbeddedMediaImage').attr('src');
      if (imgSrc && mediaItems.length === 0) {
        mediaItems.push({
          type: 'image',
          url: imgSrc,
        });
      }

      const caption = $('.Caption').text().trim() || 'Instagram Media';

      if (mediaItems.length > 0) {
        return { title: caption, media: mediaItems };
      }
    } catch (err: any) {
      Logger.debug(`Instagram embed scraping failed: ${err.message}`);
    }
    return null;
  }

  /**
   * Method 2: SaveIG API Scraper (Fallback method from downlib)
   */
  private async extractFromSaveIG(url: string): Promise<{ title: string; media: MediaItem[] } | null> {
    try {
      const BASE_URL = 'https://v3.saveig.app/api/ajaxSearch';
      const params = new URLSearchParams({
        q: url,
        t: 'media',
        lang: 'en',
      });

      const response = await axios.post(BASE_URL, params.toString(), {
        headers: {
          'Origin': 'https://saveig.app',
          'Referer': 'https://saveig.app/',
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': this.defaultHeaders['User-Agent'],
          'X-Requested-With': 'XMLHttpRequest',
        },
        timeout: 10000,
      });

      const html = response.data?.data;
      if (!html) return null;

      const $ = cheerio.load(html);
      const mediaItems: MediaItem[] = [];

      $('.download-items').each((_, el) => {
        const link = $(el).find('.download-items__btn > a').attr('href');
        if (link) {
          const isVideo = link.includes('.mp4') || $(el).find('.format-icon video').length > 0;
          mediaItems.push({
            type: isVideo ? 'video' : 'image',
            url: link,
          });
        }
      });

      if (mediaItems.length > 0) {
        return { title: 'Instagram Post', media: mediaItems };
      }
    } catch (err: any) {
      Logger.debug(`SaveIG fallback failed: ${err.message}`);
    }
    return null;
  }

  public async getInfo(url: string, _options: DownloadOptions = {}): Promise<MediaInfo> {
    const shortcode = extractInstagramId(url);
    if (!shortcode) {
      throw new Error(`Could not extract Instagram shortcode from: ${url}`);
    }

    // Try embed first
    let result = await this.extractFromEmbed(shortcode);

    // Fallback to SaveIG
    if (!result) {
      result = await this.extractFromSaveIG(url);
    }

    if (!result || result.media.length === 0) {
      throw new Error('Failed to extract media from Instagram natively.');
    }

    return {
      id: shortcode,
      title: result.title,
      platform: 'instagram',
      originalUrl: url,
      type: result.media[0].type === 'video' ? 'video' : 'image',
      formats: [],
      media: result.media,
    };
  }

  public async download(url: string, options: DownloadOptions = {}): Promise<DownloadResult> {
    const info = await this.getInfo(url, options);

    if (!info.media || info.media.length === 0) {
      return { success: false, error: 'No Instagram media URLs found' };
    }

    const outputDir = options.outputDir || process.cwd();
    ensureDir(outputDir);

    const prefix = options.filename ? sanitizeFilename(options.filename) : `instagram_${info.id}_${generateId(6)}`;
    const downloadedFiles: string[] = [];

    for (let i = 0; i < info.media.length; i++) {
      const item = info.media[i];
      const ext = item.type === 'video' ? (options.audioOnly ? (options.audioFormat || 'mp3') : 'mp4') : 'jpg';
      const targetFile = path.join(outputDir, `${prefix}${info.media.length > 1 ? `_${i + 1}` : ''}.${ext}`);

      const response = await axios.get(item.url, {
        responseType: 'stream',
        headers: {
          'User-Agent': this.defaultHeaders['User-Agent'],
          'Referer': 'https://www.instagram.com/',
        },
      });

      const totalBytes = Number(response.headers['content-length'] || 0) || null;
      let downloadedBytes = 0;
      const writer = fs.createWriteStream(targetFile);

      await new Promise<void>((resolve, reject) => {
        response.data.on('data', (chunk: Buffer) => {
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

        response.data.pipe(writer);
        writer.on('finish', () => resolve());
        writer.on('error', (err) => reject(err));
      });

      downloadedFiles.push(targetFile);
    }

    const firstFile = downloadedFiles[0];
    return {
      success: true,
      filePath: firstFile,
      filename: path.basename(firstFile),
      extension: path.extname(firstFile).replace('.', ''),
      info: { ...info, downloadedFiles },
    };
  }
}
