module.exports = {
  extends: [
    './base.js',
    'next/core-web-vitals',
  ],
  rules: {
    'react/no-unescaped-entities': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};