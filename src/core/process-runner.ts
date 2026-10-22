import { spawn, ChildProcess } from 'node:child_process';
import { ProgressEvent, ProgressStatus } from '../types/progress.js';
import { Logger } from '../utils/logger.js';

export interface ProcessRunnerOptions {
  onProgress?: (event: ProgressEvent) => void;
  cwd?: string;
  env?: NodeJS.ProcessEnv;
}

export class ProcessRunner {
  private static parseProgressLine(line: string): ProgressEvent | null {
    // Example: [download]  45.3% of 10.00MiB at 2.50MiB/s ETA 00:02
    // Example: [download] 100% of 10.00MiB in 00:04
    const downloadMatch = line.match(/\[download\]\s+([\d.]+)%\s+of\s+~?([\d.]+\w+)(?:\s+at\s+([\d.]+\w+\/s))?(?:\s+ETA\s+([\d:]+))?/i);
    if (downloadMatch) {
      const percent = parseFloat(downloadMatch[1]);
      const speed = downloadMatch[3] || null;
      const eta = downloadMatch[4] || null;

      return {
        status: percent >= 100 ? 'completed' : 'downloading',
        percent,
        downloadedBytes: 0,
        totalBytes: null,
        speed,
        eta,
        rawText: line.trim()
      };
    }

    if (line.includes('[ExtractAudio]') || line.includes('[Merger]') || line.includes('[FixupM3u8]')) {
      return {
        status: 'processing',
        percent: 99,
        downloadedBytes: 0,
        totalBytes: null,
        speed: null,
        eta: null,
        rawText: line.trim()
      };
    }

    return null;
  }

  public static async run(
    command: string,
    args: string[],
    options: ProcessRunnerOptions = {}
  ): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    return new Promise((resolve, reject) => {
      Logger.debug(`Executing: ${command} ${args.join(' ')}`);

      const child: ChildProcess = spawn(command, args, {
        cwd: options.cwd,
        env: { ...process.env, ...options.env },
        stdio: ['ignore', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      child.stdout?.on('data', (data: Buffer) => {
        const text = data.toString();
        stdout += text;

        if (options.onProgress) {
          const lines = text.split(/[\r\n]+/);
          for (const line of lines) {
            const progress = ProcessRunner.parseProgressLine(line);
            if (progress) {
              options.onProgress(progress);
            }
          }
        }
      });

      child.stderr?.on('data', (data: Buffer) => {
        const text = data.toString();
        stderr += text;

        if (options.onProgress) {
          const lines = text.split(/[\r\n]+/);
          for (const line of lines) {
            const progress = ProcessRunner.parseProgressLine(line);
            if (progress) {
              options.onProgress(progress);
            }
          }
        }
      });

      child.on('error', (error) => {
        reject(error);
      });

      child.on('close', (code) => {
        const exitCode = code ?? 0;
        if (exitCode !== 0) {
          Logger.debug(`Process exited with code ${exitCode}. Stderr: ${stderr}`);
        }
        resolve({ stdout, stderr, exitCode });
      });
    });
  }
}
