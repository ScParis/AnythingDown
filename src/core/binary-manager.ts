import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execSync, spawnSync } from 'node:child_process';
import axios from 'axios';
import { ensureDir } from '../utils/file.js';
import { Logger } from '../utils/logger.js';

export interface BinaryPaths {
  ytdlp: string;
  ffmpeg?: string;
}

export class BinaryManager {
  private customBinDir?: string;
  private customYtdlpPath?: string;
  private customFfmpegPath?: string;
  private autoDownload: boolean;

  constructor(options: {
    binDir?: string;
    ytdlpPath?: string;
    ffmpegPath?: string;
    autoDownload?: boolean;
  } = {}) {
    this.customBinDir = options.binDir;
    this.customYtdlpPath = options.ytdlpPath;
    this.customFfmpegPath = options.ffmpegPath;
    this.autoDownload = options.autoDownload ?? true;
  }

  public getBinDir(): string {
    if (this.customBinDir) {
      ensureDir(this.customBinDir);
      return this.customBinDir;
    }
    const defaultDir = path.join(os.homedir(), '.anythingdown', 'bin');
    ensureDir(defaultDir);
    return defaultDir;
  }

  public isBinaryWorking(cmdPath: string): boolean {
    try {
      const result = spawnSync(cmdPath, ['--version'], {
        encoding: 'utf-8',
        timeout: 5000,
        stdio: ['ignore', 'pipe', 'pipe']
      });
      return result.status === 0;
    } catch {
      return false;
    }
  }

  public async getYtDlpPath(): Promise<string> {
    if (this.customYtdlpPath && this.isBinaryWorking(this.customYtdlpPath)) {
      return this.customYtdlpPath;
    }

    const binDir = this.getBinDir();
    const isWin = os.platform() === 'win32';
    const localBinPath = path.join(binDir, isWin ? 'yt-dlp.exe' : 'yt-dlp');

    // 1. Check local binary cache in ~/.anythingdown/bin
    if (fs.existsSync(localBinPath) && this.isBinaryWorking(localBinPath)) {
      return localBinPath;
    }

    // 2. Check system PATH with which
    try {
      const whichCmd = isWin ? 'where yt-dlp' : 'which yt-dlp';
      const resolved = execSync(whichCmd, { encoding: 'utf-8', timeout: 3000 }).trim().split('\n')[0];
      if (resolved && fs.existsSync(resolved) && this.isBinaryWorking(resolved)) {
        return resolved;
      }
    } catch {
      // Continue to download
    }

    // 3. Download official standalone binary if enabled
    if (this.autoDownload) {
      Logger.info('yt-dlp not found or broken. Downloading latest standalone binary...');
      await this.downloadYtDlp(localBinPath);
      if (this.isBinaryWorking(localBinPath)) {
        Logger.info(`yt-dlp installed successfully at ${localBinPath}`);
        return localBinPath;
      }
    }

    throw new Error('yt-dlp executable could not be found or initialized.');
  }

  public getFfmpegPath(): string | undefined {
    if (this.customFfmpegPath && this.isBinaryWorking(this.customFfmpegPath)) {
      return this.customFfmpegPath;
    }

    const isWin = os.platform() === 'win32';

    // Try resolving full path from system PATH
    try {
      const whichCmd = isWin ? 'where ffmpeg' : 'which ffmpeg';
      const resolved = execSync(whichCmd, { encoding: 'utf-8', timeout: 3000 }).trim().split('\n')[0];
      if (resolved && fs.existsSync(resolved)) {
        return resolved;
      }
    } catch {
      // Not in PATH
    }

    const binDir = this.getBinDir();
    const localFfmpeg = path.join(binDir, isWin ? 'ffmpeg.exe' : 'ffmpeg');
    if (fs.existsSync(localFfmpeg) && this.isBinaryWorking(localFfmpeg)) {
      return localFfmpeg;
    }

    return undefined;
  }

  public async downloadYtDlp(targetPath: string): Promise<string> {
    const platform = os.platform();
    const arch = os.arch();
    let downloadUrl: string;

    if (platform === 'linux') {
      if (arch === 'x64') {
        downloadUrl = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux';
      } else if (arch === 'arm64') {
        downloadUrl = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux_aarch64';
      } else if (arch === 'arm') {
        downloadUrl = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux_armv7l';
      } else {
        throw new Error(`Unsupported Linux architecture: ${arch}`);
      }
    } else if (platform === 'win32') {
      downloadUrl = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe';
    } else if (platform === 'darwin') {
      downloadUrl = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos';
    } else {
      throw new Error(`Unsupported operating system platform: ${platform}`);
    }

    Logger.info(`Downloading yt-dlp from: ${downloadUrl}`);
    const response = await axios.get(downloadUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    fs.writeFileSync(targetPath, Buffer.from(response.data));

    if (platform !== 'win32') {
      fs.chmodSync(targetPath, 0o755);
    }

    return targetPath;
  }

  public async updateYtDlp(): Promise<boolean> {
    try {
      const ytdlp = await this.getYtDlpPath();
      Logger.info('Updating yt-dlp to latest version...');
      const res = spawnSync(ytdlp, ['-U'], { encoding: 'utf-8', timeout: 30000 });
      Logger.info(res.stdout || res.stderr || 'Update completed');
      return res.status === 0;
    } catch (err: any) {
      Logger.warn(`Failed to auto-update yt-dlp: ${err.message}`);
      return false;
    }
  }
}
