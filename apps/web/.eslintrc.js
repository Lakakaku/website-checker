module.exports = {
  extends: ['../../packages/config/src/eslint/nextjs.js'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
