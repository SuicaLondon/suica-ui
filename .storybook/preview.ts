import { createElement, type CSSProperties } from 'react'
import type { Decorator, Preview } from '@storybook/react-vite'
import { withThemeByClassName } from '@storybook/addon-themes'
import '../src/styles.css'

const surfaceBaseStyle: CSSProperties = {
	boxSizing: 'border-box',
	background: 'var(--sui-theme-surface)',
	color: 'var(--sui-theme-foreground)',
	fontFamily: 'var(--sui-theme-font-sans)',
}

export const surfaceStyleByLayout: Record<string, CSSProperties> = {
	centered: {
		display: 'grid',
		placeItems: 'center',
		padding: 16,
		width: 'calc(100vw - 32px)',
	},
	padded: {
		padding: 16,
		width: 'calc(100vw - 32px)',
	},
	fullscreen: { width: '100vw' },
}

const surfaceStyleByViewMode: Record<string, CSSProperties> = {
	story: {},
	docs: { width: '100%' },
}

const withThemeSurface: Decorator = (Story, context) => {
	const layoutStyle =
		surfaceStyleByLayout[context.parameters.layout] ?? surfaceStyleByLayout.padded
	const viewModeStyle = surfaceStyleByViewMode[context.viewMode] ?? {}

	return createElement(
		'div',
		{ style: { ...surfaceBaseStyle, ...layoutStyle, ...viewModeStyle } },
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
