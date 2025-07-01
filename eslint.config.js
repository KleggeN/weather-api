import eslintPluginTs from '@typescript-eslint/eslint-plugin'
import parserTs from '@typescript-eslint/parser'

/** @type {import("eslint").Linter.Config} */
export default [
  {
    ignores: ['dist', 'node_modules'],

    languageOptions: {
      parser: parserTs,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        console: 'readonly',
        module: 'readonly',
        require: 'readonly',
        process: 'readonly',
      },
    },

    plugins: {
      '@typescript-eslint': eslintPluginTs,
    },

    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
]
