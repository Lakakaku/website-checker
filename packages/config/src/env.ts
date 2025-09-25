import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1)
    .refine((val) => val.startsWith('postgresql://') || val.startsWith('postgres://'), {
      message: 'DATABASE_URL must start with postgresql:// or postgres://',
    }),
  REDIS_URL: z
    .string()
    .min(1)
    .refine((val) => val.startsWith('redis://') || val.startsWith('rediss://'), {
      message: 'REDIS_URL must start with redis:// or rediss://',
    }),
  STRIPE_API_KEY: z
    .string()
    .min(1)
    .refine((val) => val.startsWith('sk_test_') || val.startsWith('sk_live_'), {
      message: 'STRIPE_API_KEY must start with sk_test_ or sk_live_',
    }),
  SENTRY_DSN: z
    .string()
    .min(1)
    .refine((val) => val.startsWith('https://'), {
      message: 'SENTRY_DSN must start with https://',
    }),
  NEXTAUTH_SECRET: z
    .string()
    .min(32, { message: 'NEXTAUTH_SECRET must be at least 32 characters' }),
  NEXTAUTH_URL: z.string().url({ message: 'NEXTAUTH_URL must be a valid URL' }),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  VERCEL_ENV: z.enum(['development', 'preview', 'production']).optional(),
});

type Env = z.infer<typeof envSchema>;

export function validateEnv(): Env {
  const env = envSchema.parse(process.env);

  if (process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production') {
    if (!env.STRIPE_API_KEY.startsWith('sk_live_')) {
      throw new Error('Production environment requires live Stripe key (sk_live_*)');
    }
  }

  return env;
}

export type { Env };
