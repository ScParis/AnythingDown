import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { Logger } from '../utils/logger.js';

export interface ActivityLog {
  id: string;
  timestamp: number;
  type: 'info' | 'download' | 'file';
  platform: string;
  format?: string;
  statusCode: number;
  durationMs: number;
  error?: string;
  clientIp?: string;
}

export interface MetricsSummary {
  uptime: number;
  startTime: number;
  totalRequests: number;
  totalInfoRequests: number;
  totalDownloads: number;
  successCount: number;
  errorCount: number;
  downloadsByFormat: {
    mp4: number;
    mp3: number;
    image: number;
    other: number;
  };
  requestsByPlatform: Record<string, number>;
  platformErrors: Record<string, { count: number; lastError: string; lastSeen: number }>;
  recentActivity: ActivityLog[];
}

export class MetricsManager {
  private static instance: MetricsManager;
  private readonly storagePath: string;
  private startTime: number = Date.now();
  private totalRequests: number = 0;
  private totalInfoRequests: number = 0;
  private totalDownloads: number = 0;
  private successCount: number = 0;
  private errorCount: number = 0;
  private downloadsByFormat = {
    mp4: 0,
    mp3: 0,
    image: 0,
    other: 0,
  };
  private requestsByPlatform: Record<string, number> = {};
  private platformErrors: Record<string, { count: number; lastError: string; lastSeen: number }> = {};
  private recentActivity: ActivityLog[] = [];
  private saveTimeout: NodeJS.Timeout | null = null;

  private constructor() {
    this.storagePath = path.join(os.tmpdir(), 'anythingdown_metrics.json');
    this.loadState();
  }

  public static getInstance(): MetricsManager {
    if (!MetricsManager.instance) {
      MetricsManager.instance = new MetricsManager();
    }
    return MetricsManager.instance;
  }

  public recordActivity(activity: {
    type: 'info' | 'download' | 'file';
    platform: string;
    format?: string;
    statusCode: number;
    durationMs: number;
    error?: string;
    clientIp?: string;
  }): void {
    this.totalRequests++;

    const platformKey = activity.platform.toLowerCase() || 'unknown';
    this.requestsByPlatform[platformKey] = (this.requestsByPlatform[platformKey] || 0) + 1;

    if (activity.type === 'info') {
      this.totalInfoRequests++;
    } else if (activity.type === 'download' || activity.type === 'file') {
      this.totalDownloads++;
      const fmt = (activity.format || '').toLowerCase();
      if (fmt.includes('mp4') || fmt.includes('video')) {
        this.downloadsByFormat.mp4++;
      } else if (fmt.includes('mp3') || fmt.includes('audio')) {
        this.downloadsByFormat.mp3++;
      } else if (fmt.includes('jpg') || fmt.includes('jpeg') || fmt.includes('png') || fmt.includes('webp') || fmt.includes('image')) {
        this.downloadsByFormat.image++;
      } else {
        this.downloadsByFormat.other++;
      }
    }

    if (activity.statusCode >= 200 && activity.statusCode < 400) {
      this.successCount++;
    } else {
      this.errorCount++;
      if (activity.error) {
        if (!this.platformErrors[platformKey]) {
          this.platformErrors[platformKey] = { count: 0, lastError: '', lastSeen: 0 };
        }
        this.platformErrors[platformKey].count++;
        this.platformErrors[platformKey].lastError = activity.error;
        this.platformErrors[platformKey].lastSeen = Date.now();
      }
    }

    // Mask IP for privacy (keep first 2 octets for IPv4 or prefix for IPv6)
    const maskedIp = this.maskIp(activity.clientIp);

    const logItem: ActivityLog = {
      id: Math.random().toString(36).substring(2, 10),
      timestamp: Date.now(),
      type: activity.type,
      platform: platformKey,
      format: activity.format,
      statusCode: activity.statusCode,
      durationMs: Math.round(activity.durationMs),
      error: activity.error,
      clientIp: maskedIp,
    };

    this.recentActivity.unshift(logItem);
    if (this.recentActivity.length > 80) {
      this.recentActivity.pop();
    }

    this.scheduleSave();
  }

  public getSummary(): MetricsSummary {
    return {
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      startTime: this.startTime,
      totalRequests: this.totalRequests,
      totalInfoRequests: this.totalInfoRequests,
      totalDownloads: this.totalDownloads,
      successCount: this.successCount,
      errorCount: this.errorCount,
      downloadsByFormat: { ...this.downloadsByFormat },
      requestsByPlatform: { ...this.requestsByPlatform },
      platformErrors: { ...this.platformErrors },
      recentActivity: [...this.recentActivity],
    };
  }

  public reset(): void {
    this.totalRequests = 0;
    this.totalInfoRequests = 0;
    this.totalDownloads = 0;
    this.successCount = 0;
    this.errorCount = 0;
    this.downloadsByFormat = { mp4: 0, mp3: 0, image: 0, other: 0 };
    this.requestsByPlatform = {};
    this.platformErrors = {};
    this.recentActivity = [];
    this.startTime = Date.now();
    this.saveStateNow();
  }

  private maskIp(ip?: string): string {
    if (!ip) return 'hidden';
    if (ip === '::1' || ip === '127.0.0.1') return 'localhost';
    if (ip.includes('.')) {
      const parts = ip.split('.');
      if (parts.length === 4) return `${parts[0]}.${parts[1]}.*.*`;
    }
    if (ip.includes(':')) {
      return `${ip.split(':')[0]}:*`;
    }
    return 'masked';
  }

  private scheduleSave(): void {
    if (this.saveTimeout) return;
    this.saveTimeout = setTimeout(() => {
      this.saveStateNow();
      this.saveTimeout = null;
    }, 5000);
  }

  private saveStateNow(): void {
    try {
      const data = {
        totalRequests: this.totalRequests,
        totalInfoRequests: this.totalInfoRequests,
        totalDownloads: this.totalDownloads,
        successCount: this.successCount,
        errorCount: this.errorCount,
        downloadsByFormat: this.downloadsByFormat,
        requestsByPlatform: this.requestsByPlatform,
        platformErrors: this.platformErrors,
        recentActivity: this.recentActivity.slice(0, 50),
      };
      fs.writeFileSync(this.storagePath, JSON.stringify(data), 'utf-8');
    } catch (err: any) {
      Logger.warn(`Failed to persist metrics to disk: ${err.message}`);
    }
  }

  private loadState(): void {
    try {
      if (fs.existsSync(this.storagePath)) {
        const raw = fs.readFileSync(this.storagePath, 'utf-8');
        const data = JSON.parse(raw);
        this.totalRequests = data.totalRequests || 0;
        this.totalInfoRequests = data.totalInfoRequests || 0;
        this.totalDownloads = data.totalDownloads || 0;
        this.successCount = data.successCount || 0;
        this.errorCount = data.errorCount || 0;
        if (data.downloadsByFormat) this.downloadsByFormat = { ...this.downloadsByFormat, ...data.downloadsByFormat };
        if (data.requestsByPlatform) this.requestsByPlatform = { ...data.requestsByPlatform };
        if (data.platformErrors) this.platformErrors = { ...data.platformErrors };
        if (Array.isArray(data.recentActivity)) this.recentActivity = data.recentActivity;
      }
    } catch {
      // Ignore corrupted or empty file
    }
  }
}
