import fs from 'node:fs';
import path from 'node:path';
import axios from 'axios';
import { BaseExtractor } from './base.js';
import { MediaInfo, MediaItem } from '../types/media.js';
import { DownloadOptions, DownloadResult } from '../types/options.js';
import { detectPlatform, extractTikTokId } from '../utils/url-detector.js';
import { ensureDir, generateId, sanitizeFilename } from '../utils/file.js';
import { Logger } from '../utils/logger.js';

export class TikTokExtractor extends BaseExtractor {
  public readonly name = 'tiktok-native';

  private defaultHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
  };

  public canHandle(url: string): boolean {
    return detectPlatform(url) === 'tiktok';
  }

  public async resolveUrl(url: string): Promise<string> {
    if (url.includes('vm.tiktok.com') || url.includes('vt.tiktok.com')) {
      const res = await axios.get(url, {
        headers: this.defaultHeaders,
        maxRedirects: 10,
        validateStatus: (status) => status < 400 || status === 301 || status === 302,
      });
      return res.request?.res?.responseUrl || url;
    }
    return url;
  }

  public async getInfo(url: string, _options: DownloadOptions = {}): Promise<MediaInfo> {
    const finalUrl = await this.resolveUrl(url);
    const videoId = extractTikTokId(finalUrl);

    if (!videoId) {
      throw new Error(`Could not extract TikTok video ID from URL: ${url}`);
    }

    const apiUrl = `https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/feed/?aweme_id=${videoId}&iid=7318518857994389254&device_id=7318517321748022790&channel=googleplay&app_name=musical_ly&version_code=300904&device_platform=android&device_type=Pixel_7&version=9`;

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          ...this.defaultHeaders,
          'User-Agent': 'okhttp/3.14.9',
        },
        timeout: 10000,
      });

      const data = response.data;
      const aweme = data?.aweme_list?.[0];

      if (!aweme) {
        throw new Error('TikTok video not found or private');
      }

      const mediaItems: MediaItem[] = [];
      let isSlideshow = false;

      if (aweme.image_post_info?.images?.length) {
        isSlideshow = true;
        for (const img of aweme.image_post_info.images) {
          const imgUrl = img.display_image?.url_list?.[0] || img.owner_watermark_image?.url_list?.[0];
          if (imgUrl) {
            mediaItems.push({
              type: 'image',
              url: imgUrl,
              width: img.display_image?.width,
              height: img.display_image?.height,
            });
          }
        }
      } else {
        const videoUrl = aweme.video?.play_addr?.url_list?.[0] || aweme.video?.download_addr?.url_list?.[0];
        if (videoUrl) {
          mediaItems.push({
            type: 'video',
            url: videoUrl,
            width: aweme.video?.width,
            height: aweme.video?.height,
          });
        }
      }

      return {
        id: aweme.aweme_id || videoId,
        title: aweme.desc || 'TikTok Media',
        description: aweme.desc,
        thumbnail: aweme.video?.cover?.url_list?.[0],
        duration: aweme.video?.duration ? Math.round(aweme.video.duration / 1000) : undefined,
        author: {
          id: aweme.author?.uid,
          name: aweme.author?.nickname,
          username: aweme.author?.unique_id,
          avatarUrl: aweme.author?.avatar_thumb?.url_list?.[0],
          url: `https://www.tiktok.com/@${aweme.author?.unique_id}`,
        },
        platform: 'tiktok',
        originalUrl: url,
        type: isSlideshow ? 'slideshow' : 'video',
        formats: [],
        media: mediaItems,
        raw: aweme,
      };
    } catch (err: any) {
      Logger.warn(`TikTok native extraction failed (${err.message}).`);
      throw err;
    }
  }

  public async download(url: string, options: DownloadOptions = {}): Promise<DownloadResult> {
    const info = await this.getInfo(url, options);

    if (!info.media || info.media.length === 0) {
      return { success: false, error: 'No media items found in TikTok post' };
    }

    const outputDir = options.outputDir || process.cwd();
    ensureDir(outputDir);

    const prefix = options.filename ? sanitizeFilename(options.filename) : `tiktok_${info.id}_${generateId(6)}`;

    // If it's a video
    if (info.type === 'video' || info.media[0].type === 'video') {
      const videoItem = info.media[0];
      const ext = options.audioOnly ? (options.audioFormat || 'mp3') : 'mp4';
      const targetFile = path.join(outputDir, `${prefix}.${ext}`);

      const response = await axios.get(videoItem.url, {
        responseType: 'stream',
        headers: {
          'Referer': 'https://www.tiktok.com/',
          'User-Agent': this.defaultHeaders['User-Agent'],
        },
      });

      const totalBytes = Number(response.headers['content-length'] || 0) || null;
      let downloadedBytes = 0;

      const writer = fs.createWriteStream(targetFile);

      return new Promise((resolve) => {
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
            error: `Failed to write file: ${err.message}`,
          });
        });
      });
    }

    // If it's image slideshow
    const downloadedImages: string[] = [];
    for (let i = 0; i < info.media.length; i++) {
      const item = info.media[i];
      const imgFile = path.join(outputDir, `${prefix}_slide_${i + 1}.jpeg`);
      const imgRes = await axios.get(item.url, { responseType: 'arraybuffer' });
      fs.writeFileSync(imgFile, Buffer.from(imgRes.data));
      downloadedImages.push(imgFile);
    }

    return {
      success: true,
      filePath: downloadedImages[0],
      filename: path.basename(downloadedImages[0]),
      extension: 'jpeg',
      info: { ...info, downloadedFiles: downloadedImages },
    };
  }
}
