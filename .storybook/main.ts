import type { StorybookConfig } from '@storybook/react-webpack5'
import { Configuration } from 'webpack'

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		// "@storybook/preset-create-react-app",
		'@storybook/addon-onboarding',
		'@storybook/addon-interactions',
		'@storybook/addon-styling-webpack',
		'@storybook/addon-themes',
		{
			name: '@storybook/addon-postcss',
			options: {
				postcssLoaderOptions: {
					implementation: require('postcss'),
				},
			},
		},
	],
	framework: {
		name: '@storybook/react-webpack5',
		options: {},
	},
	docs: {
		autodocs: 'tag',
	},
	staticDirs: ['../public'],
	webpackFinal: async (config: Configuration) => {
		// Find the existing rule for SVG files
		const imageRule = config.module?.rules?.find((rule) => {
			const test = (rule as { test: RegExp }).test

			if (!test) {
				return false
			}

			return test.test('.svg')
		}) as { [key: string]: any }

		imageRule.exclude = /\.svg$/

		config.module?.rules?.push({
			test: /\.svg$/,
			use: ['@svgr/webpack'],
		})

		return config
	},
}

export default config
