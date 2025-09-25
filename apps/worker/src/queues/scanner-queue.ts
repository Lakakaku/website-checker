import { Queue } from 'bullmq';
import { getRedis } from '../lib/redis';
import type { ScannerJobData, ScannerJobResult } from '@website-checker/types/src/jobs/scanner';

const redis = getRedis();

export const scannerQueue = new Queue<ScannerJobData, ScannerJobResult>('scanner', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: {
      count: 100,
    },
    removeOnFail: {
      count: 500,
    },
  },
});