module.exports = {
  env: {
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'semi': ['error'],
    'quotes': ['error', 'single', {
      'allowTemplateLiterals': true,
    }],
  },
};