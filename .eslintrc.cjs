/* eslint-env node */
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:vue/vue3-essential',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    // Add custom rules here
    'vue/multi-word-component-names': 'off',
  },
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
}
