// Lint for the Astro site: ESLint's and typescript-eslint's recommended rules, plus eslint-plugin-astro's for .astro files.
// TypeScript checks undefined names itself (astro check), so no-undef is off, as typescript-eslint advises.
// Empty catches are allowed: the theme scripts ignore storage that throws on purpose.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';

export default [
  { ignores: ['dist/', '.astro/', 'archive/', 'runtime/', 'node_modules/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: { 'no-undef': 'off', 'no-empty': ['error', { allowEmptyCatch: true }] },
  },
  // The logo scripts are CommonJS.
  { files: ['**/*.cjs'], languageOptions: { sourceType: 'commonjs' }, rules: { '@typescript-eslint/no-require-imports': 'off' } },
];
