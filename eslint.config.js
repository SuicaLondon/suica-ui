import eslint from '@eslint/js'
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
	...storybook.configs['flat/recommended'],
	prettierRecommended,
]
