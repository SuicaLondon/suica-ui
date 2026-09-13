import { createElement } from 'react'
import { cn } from '../src/cn'
import type { Decorator, Preview } from '@storybook/react-vite'
import { withThemeByClassName } from '@storybook/addon-themes'
import './styles.css'

const surfaceClassNameByLayout: Record<string, string> = {
	centered: 'grid place-items-center p-4',
	padded: 'p-4',
	fullscreen: '',
}

const withThemeSurface: Decorator = (Story, context) => {
	const layoutClassName =
		surfaceClassNameByLayout[context.parameters.layout] ??
		surfaceClassNameByLayout.padded
	let widthClassName = 'story-surface-width'
	if (context.parameters.layout === 'fullscreen') widthClassName = 'w-screen'
	if (context.viewMode === 'docs') widthClassName = 'w-full'

	return createElement(
		'div',
		{
			className: cn(
				'box-border bg-surface font-sans text-foreground',
				layoutClassName,
				widthClassName,
			),
		},
		createElement(Story),
	)
}

const preview: Preview = {
	decorators: [
		withThemeByClassName({
			themes: { light: 'light', dark: 'dark' },
			defaultTheme: 'light',
		}),
		withThemeSurface,
	],
	parameters: {
		a11y: { test: 'error' },
		actions: { argTypesRegex: '^on[A-Z].*' },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		viewport: {
			viewports: {
				smallDesktop: {
					name: 'Small Desktop',
					styles: { width: '1024px', height: '768px' },
					type: 'desktop',
				},
				normalDesktop: {
					name: 'Normal Desktop',
					styles: { width: '1920px', height: '1080px' },
					type: 'desktop',
				},
			},
		},
	},
}

export default preview
