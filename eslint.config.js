import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import playwright from 'eslint-plugin-playwright';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.js'],
    plugins: {
      '@typescript-eslint': ts,
      playwright: playwright
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        // Temporarily disabling project reference to avoid parsing errors
        // project: ['./tsconfig.json'],
      },
      globals: {
        // Common globals
        process: 'readonly',
        navigator: 'readonly',
        document: 'readonly',
        window: 'readonly',
      },
    },
    rules: {
      // General JavaScript/TypeScript rules
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { 'avoidEscape': true }],
      'comma-dangle': ['error', 'only-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'eol-last': ['error', 'always'],
      'lines-between-class-members': ['error', 'always', { 'exceptAfterSingleLine': true }],
      
      // Allow unused vars in test files (they're often used by Playwright)
      '@typescript-eslint/no-unused-vars': ['error', { 
        'argsIgnorePattern': '^_', 
        'varsIgnorePattern': '^_', 
        'vars': 'all',
        'args': 'after-used',
        'ignoreRestSiblings': true
      }],
      
      // TypeScript-specific rules
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-parameter-properties': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      
      // Environment-specific rules (disable for test files)
      'no-undef': 'off', // This will be handled by TypeScript
      
      // Playwright-specific rules
      'playwright/expect-expect': 'off',
      'playwright/no-networkidle': 'error',
      'playwright/no-force-option': 'warn',
      'playwright/no-wait-for-timeout': 'off', // Turn off for UI settling cases - developers should use with discretion
      'playwright/missing-playwright-await': 'error',
      'playwright/no-element-handle': 'warn',
      'playwright/no-eval': 'warn',
      'playwright/no-focused-test': 'error',
      'playwright/no-skipped-test': 'warn'
    }
  },
  {
    files: ['tests/**/*.spec.ts', 'tests/**/*.test.ts', 'src/utils/testUtils.ts'],
    languageOptions: {
      globals: {
        // Playwright globals
        test: 'readonly',
        expect: 'readonly',
        page: 'readonly',
        browser: 'readonly',
        browserName: 'readonly',
        deviceName: 'readonly',
        viewport: 'readonly',
        process: 'readonly',
        navigator: 'readonly',
        document: 'readonly',
        window: 'readonly'
      }
    },
    rules: {
      'playwright/no-skipped-test': 'off',
      'playwright/no-focused-test': 'off',
      '@typescript-eslint/no-unused-vars': 'off', // Allow unused vars in test files
      'no-unused-vars': 'off', // Also disable the base ESLint rule
      'no-undef': 'off', // Allow global Playwright variables
    }
  },
  {
    files: ['src/pages/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off', // Allow unused vars in page objects
      'no-unused-vars': 'off', // Also disable the base ESLint rule
    }
  }
];
