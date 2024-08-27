const globals = require('globals');
const eslint = require('@eslint/js');
const pluginJs = require('@eslint/js');
const angular = require('angular-eslint');
const tseslint = require('typescript-eslint');
const typescriptEslintParse = require('@typescript-eslint/parser');
const prettierPlugin = require('eslint-plugin-prettier');
const angularPlugin = require('@angular-eslint/eslint-plugin');

module.exports = [
  eslint.configs.recommended,
  pluginJs.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  ...angular.configs.tsRecommended,
  {
    // Specify the files ESLint should process
    // files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    files: ['**/*.ts'],

    // Define the parser to understand TypeScript
    languageOptions: {
      parser: typescriptEslintParse,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest', // Use the latest ECMAScript version
        // sourceType: 'module', // Allows for the use of imports
      },
    },

    // Extend ESLint rules with plugins
    plugins: {
      prettier: prettierPlugin,
      angular: angularPlugin,
      // import: importPlugin,
    },

    // Set the custom processor which will allow us to have our inline Component templates extracted
    // and treated as if they are HTML files (and therefore have the .html config below applied to them)
    processor: angular.processInlineTemplates,

    // Specify ESLint rules and configurations
    rules: {
      // General ESLint recommendations
      'no-console': ['warn', { allow: ['log'] }], // Disallows console.warn and console.error but allows console.log
      'no-unused-vars': 'off', // Disabled in favor of @typescript-eslint/no-unused-vars

      // TypeScript-specific rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-extraneous-class': 'off',

      // Import sorting and grouping
      // 'import/order': [
      //     'error',
      //     {
      //         'newlines-between': 'always',
      //         alphabetize: { order: 'asc', caseInsensitive: true },
      //     },
      // ],

      // Prettier configuration
      'prettier/prettier': 'error', // Ensure Prettier formatting

      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
    },

    settings: {},
  },
];
