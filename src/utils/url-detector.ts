export type PlatformType =
  | 'instagram'
  | 'tiktok'
  | 'facebook'
  | 'youtube'
  | 'twitter'
  | 'reddit'
  | 'twitch'
  | 'soundcloud'
  | 'dailymotion'
  | 'threads'
  | 'pinterest'
  | 'vimeo'
  | 'unknown';

export function detectPlatform(url: string): PlatformType {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();

    if (host.includes('instagram.com') || host.includes('instagr.am')) return 'instagram';
    if (host.includes('tiktok.com')) return 'tiktok';
    if (host.includes('facebook.com') || host.includes('fb.watch') || host.includes('fb.com')) return 'facebook';
    if (host.includes('youtube.com') || host.includes('youtu.be')) return 'youtube';
    if (host.includes('twitter.com') || host.includes('x.com')) return 'twitter';
    if (host.includes('reddit.com') || host.includes('redd.it')) return 'reddit';
    if (host.includes('twitch.tv')) return 'twitch';
    if (host.includes('soundcloud.com')) return 'soundcloud';
    if (host.includes('dailymotion.com') || host.includes('dai.ly')) return 'dailymotion';
    if (host.includes('threads.net')) return 'threads';
    if (host.includes('pinterest.')) return 'pinterest';
    if (host.includes('vimeo.com')) return 'vimeo';
  } catch {
    return 'unknown';
  }
  return 'unknown';
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export function extractInstagramId(url: string): string | null {
  const match = url.match(/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : null;
}

export function extractTikTokId(url: string): string | null {
  const match = url.match(/(?:video|photo)\/([0-9]+)/);
  return match ? match[1] : null;
}

export function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|watch\?v=|shorts\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}
