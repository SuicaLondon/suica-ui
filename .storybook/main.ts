import tailwindcss from '@tailwindcss/vite'
import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
	stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: ['@storybook/addon-docs', '@storybook/addon-themes'],
	framework: {
		name: '@storybook/react-vite',
		options: {},
	},
	docs: {
		autodocs: 'tag',
	},
	viteFinal(config) {
		return mergeConfig(config, {
			plugins: [tailwindcss()],
		})
	},
}

export default config
