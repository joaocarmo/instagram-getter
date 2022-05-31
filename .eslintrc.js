module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:react-compat/recommended',
    'plugin:prettier/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', 'react-compat'],
  rules: {
    'import/no-duplicates': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': 0,
    'no-restricted-syntax': ['error', 'never'],
    'react-hooks/exhaustive-deps': 'warn',
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'react-hooks/rules-of-hooks': 'error',
    semi: ['error', 'never'],
  },
  settings: {
    'import/resolver': {
      alias: [
        ['react', 'preact/compat'],
        ['react-dom/test-utils', 'preact/test-utils'],
        ['react-dom', 'preact/compat'],
      ],
    },
    react: {
      version: '17',
    },
  },
}
