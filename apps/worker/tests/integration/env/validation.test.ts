import { describe, it, expect } from 'vitest';
import { getEnv } from '../../../src/lib/env';

describe('Environment Validation Integration (Worker)', () => {
  it('validates environment on load', () => {
    expect(() => getEnv()).not.toThrow();
  });
});