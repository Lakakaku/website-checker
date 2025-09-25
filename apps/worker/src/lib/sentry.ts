import * as Sentry from '@sentry/node';
import { getEnv } from './env';

export function initSentry() {
  const env = getEnv();

  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,
    tracesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
    beforeSend(event) {
      if (env.NODE_ENV === 'development') {
        return null;
      }

      if (env.NODE_ENV === 'production') {
        console.error('Production error captured:', event);
      }

      return event;
    },
  });
}