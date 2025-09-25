module.exports = {
  '*.{ts,tsx}': ['eslint --fix', 'prettier --write', () => 'pnpm typecheck'],
  '*.{js,jsx,json,md}': ['prettier --write'],
};
