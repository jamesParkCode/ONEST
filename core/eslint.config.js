import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import react from "eslint-plugin-react";

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      react,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommendedTypeChecked[0].rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // ✅ React Refresh (Vite용)
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // ✅ 코드 스타일
      quotes: ['warn', 'single'],
      semi: ['error', 'never'],
      indent: ['warn', 2, { SwitchCase: 1 }],
      '@typescript-eslint/indent': ['warn', 2, { SwitchCase: 1 }],
      'no-multi-spaces': 'warn',

      // ✅ TS 규칙
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-unused-vars': ['off'],
      '@typescript-eslint/no-explicit-any': 0,

      // ✅ React 관련
      'react/react-in-jsx-scope': 'off',
      'react/jsx-key': 'warn',
      'react/prop-types': 'off',
      'no-undef': 'off',
    },
  },
])
