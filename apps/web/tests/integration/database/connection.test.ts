import { describe, it, expect } from 'vitest';

describe('Database Connection Integration', () => {
  it.skipIf(process.env.NODE_ENV === 'test')(
    'Health endpoint returns database status',
    async () => {
      const response = await fetch('http://localhost:3000/api/health');
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.database).toBe('healthy');
    }
  );
});
