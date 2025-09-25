export interface ScannerJobData {
  websiteUrl: string;
  scanId: string;
  userId: string;
}

export interface ScannerJobResult {
  scanId: string;
  issuesFound: number;
  completedAt: string;
}