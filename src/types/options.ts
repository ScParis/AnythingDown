import { ProgressEvent } from './progress.js';

export interface DownloadOptions {
  outputDir?: string;
  filename?: string;
  audioOnly?: boolean;
  audioFormat?: 'mp3' | 'm4a' | 'wav' | 'flac' | 'opus';
  quality?: 'best' | 'worst' | '1080p' | '720p' | '480p' | '360p' | string;
  cookies?: string; // Path to cookies.txt or cookies string
  proxy?: string;
  onProgress?: (event: ProgressEvent) => void;
  preferNative?: boolean;
  additionalArgs?: string[];
  deleteAfterDownload?: boolean;
}

export interface ClientConfig {
  binDir?: string;
  ytdlpPath?: string;
  ffmpegPath?: string;
  autoDownloadBinaries?: boolean;
  autoUpdateBinary?: boolean;
  preferNative?: boolean;
}

export interface DownloadResult {
  success: boolean;
  filePath?: string;
  filename?: string;
  extension?: string;
  buffer?: Buffer;
  info?: any;
  error?: string;
}
