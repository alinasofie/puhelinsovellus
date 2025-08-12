import js from "@eslint/js"
import globals from "globals"
import stylisticJs from '@stylistic/eslint-plugin-js'
import { defineConfig } from "eslint/config"

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs}"],
    plugins: {
      js,
      '@stylistic/js': stylisticJs,
    },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.browser
    },
    rules: {
      '@stylistic/js/semi': ['warn', 'never'],
      eqeqeq: 'warn',
      'no-trailing-spaces': 'warn',
      'object-curly-spacing': ['warn', 'always'],
      'arrow-spacing': ['warn', { before: true, after: true }],
      'no-console': 'off',
    },
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: { ...globals.node },
      ecmaVersion: "latest",
    },

  },
  {
    ignores: ['dist/**'],
  },
])
