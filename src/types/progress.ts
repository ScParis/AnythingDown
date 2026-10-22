export type ProgressStatus = 'starting' | 'downloading' | 'processing' | 'completed' | 'error';

export interface ProgressEvent {
  status: ProgressStatus;
  percent: number;
  downloadedBytes: number;
  totalBytes: number | null;
  speed: string | null;
  eta: string | null;
  rawText?: string;
}
