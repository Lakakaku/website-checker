export interface RedisConfig {
  url: string;
  maxRetriesPerRequest: number;
  enableReadyCheck: boolean;
}
