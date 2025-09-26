import { validateEnv, type Env } from '@website-checker/config';

let env: Env | null = null;

export function getEnv(): Env {
  if (!env) {
    env = validateEnv();
  }
  return env;
}

export type { Env };
