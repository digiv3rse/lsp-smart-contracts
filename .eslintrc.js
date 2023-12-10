module.exports = {
  ignorePatterns: ['artifacts/', 'cache/', 'dist/', 'types/', 'contracts.ts'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  plugins: ['@typescript-eslint/eslint-plugin', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
