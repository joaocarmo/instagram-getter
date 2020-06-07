module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:react-compat/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-hooks',
    'react-compat',
  ],
  settings: {
    'import/resolver': {
      alias: [
        ['react', 'preact/compat'],
        ['react-dom/test-utils', 'preact/test-utils'],
        ['react-dom', 'preact/compat'],
      ],
    },
  },
  rules: {
    semi: ['error', 'never'],
    'no-restricted-syntax': ['error', 'never'],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'import/no-extraneous-dependencies': 0,
    'import/no-duplicates': 0,
    'import/no-unresolved': 0,
  },
}
