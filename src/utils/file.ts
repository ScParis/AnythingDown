import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export function sanitizeFilename(name: string): string {
  // Remove illegal characters for Linux, Windows and macOS file systems
  return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_').trim().slice(0, 200);
}

export function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function generateId(length = 16): string {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

export function removeFileSafe(filePath?: string): void {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch {
      // Ignore cleanup error
    }
  }
}
