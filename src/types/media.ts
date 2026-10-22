export type MediaType = 'video' | 'audio' | 'image' | 'slideshow';

export interface MediaAuthor {
  id?: string;
  name?: string;
  username?: string;
  avatarUrl?: string;
  url?: string;
}

export interface MediaFormat {
  formatId: string;
  ext: string;
  resolution?: string;
  width?: number;
  height?: number;
  fps?: number;
  bitrate?: number;
  filesize?: number;
  url?: string;
  hasAudio?: boolean;
  hasVideo?: boolean;
}

export interface MediaItem {
  type: 'video' | 'image' | 'audio';
  url: string;
  width?: number;
  height?: number;
  data?: Buffer;
}

export interface MediaInfo {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  duration?: number; // in seconds
  author?: MediaAuthor;
  platform: string;
  originalUrl: string;
  type: MediaType;
  formats: MediaFormat[];
  media: MediaItem[];
  raw?: any;
}
