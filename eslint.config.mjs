import eslint from '@eslint/js'
import classnames from './eslint-rules/classnames.mjs'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import globals from 'globals'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import react from 'eslint-plugin-react'
import storybook from 'eslint-plugin-storybook'

const typescriptEslintRecommended =
	typescriptEslint.configs['flat/eslint-recommended'].rules

export default [
	{
		ignores: ['dist/**', 'storybook-static/**', 'src/output.css'],
	},
	{
		files: ['**/*.{js,mjs,cjs}'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.node,
				...globals.es2021,
			},
		},
		rules: eslint.configs.recommended.rules,
	},
	{
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
				ecmaVersion: 2018,
				sourceType: 'module',
			},
			globals: {
				...globals.browser,
				...globals.es2021,
			},
		},
		plugins: {
			'@typescript-eslint': typescriptEslint,
			react,
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
		rules: {
			...eslint.configs.recommended.rules,
			...typescriptEslintRecommended,
			...react.configs.flat.recommended.rules,
			'no-unused-vars': 'off',
			'no-nested-ternary': 'error',
			'@typescript-eslint/no-unused-vars': 'error',
			'react/react-in-jsx-scope': 'off',
			'react/no-multi-comp': 'error',
			'react/jsx-filename-extension': [
				'warn',
				{ extensions: ['.js', '.jsx', '.ts', '.tsx'] },
			],
		},
	},
	{
		files: ['src/**/*.tsx'],
		ignores: ['src/**/*-icon.tsx', 'src/icons/index.tsx'],
		rules: {
			'no-restricted-syntax': [
				'error',
				{
					selector: "JSXOpeningElement[name.name='svg']",
					message: 'Extract SVG markup into a dedicated *-icon.tsx component.',
				},
			],
		},
	},
	{
		files: ['test/package-consumer/*.ts'],
		rules: {
			'react/no-children-prop': 'off',
		},
	},
	{
		files: ['src/**/*.{ts,tsx}', '.storybook/**/*.{ts,tsx}'],
		ignores: ['src/**/*.test.{ts,tsx}'],
		plugins: { suica: classnames },
		rules: {
			'suica/consistent-classnames': ['error', { maxLength: 80 }],
			'suica/no-arbitrary-variants': 'error',
			'suica/no-arbitrary-leading': 'error',
			'suica/no-arbitrary-css-math': 'error',
			'suica/no-arbitrary-blur': 'error',
			'suica/no-css-variable-classes': 'error',
			'suica/prefer-numeric-utilities': 'error',
			'suica/prefer-and-rendering': 'error',
		},
	},
	{
		files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
		plugins: { suica: classnames },
		rules: {
			'suica/no-arbitrary-values': 'error',
			'suica/no-static-inline-styles': 'error',
		},
	},
	...storybook.configs['flat/recommended'],
	prettierRecommended,
]
