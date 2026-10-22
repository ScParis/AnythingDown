import { MediaInfo } from '../types/media.js';
import { DownloadOptions, DownloadResult } from '../types/options.js';

export abstract class BaseExtractor {
  public abstract readonly name: string;

  public abstract canHandle(url: string): boolean;

  public abstract getInfo(url: string, options?: DownloadOptions): Promise<MediaInfo>;

  public abstract download(url: string, options?: DownloadOptions): Promise<DownloadResult>;
}
