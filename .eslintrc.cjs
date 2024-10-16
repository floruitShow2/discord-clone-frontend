module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', '*.config.js'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react-refresh/only-export-components': 'off',
    "react-hooks/exhaustive-deps": "off",
    // typescript
    "@typescript-eslint/no-unused-vars": 2,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/ban-ts-comment': 0
  }
}
