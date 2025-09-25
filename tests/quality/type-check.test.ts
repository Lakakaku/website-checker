import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';

describe('TypeScript Quality Gates', () => {
  it('Base tsconfig has strict mode', () => {
    const tsconfig = JSON.parse(readFileSync('tsconfig.base.json', 'utf-8'));
    expect(tsconfig.compilerOptions.strict).toBe(true);
  });

  it('noUncheckedIndexedAccess enabled', () => {
    const tsconfig = JSON.parse(readFileSync('tsconfig.base.json', 'utf-8'));
    expect(tsconfig.compilerOptions.noUncheckedIndexedAccess).toBe(true);
  });
});
