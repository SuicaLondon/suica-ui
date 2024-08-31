import { DEFAULT_VIEWPORT, MINIMAL_VIEWPORTS } from '@storybook/addon-viewport'
import type { Preview } from '@storybook/react'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'

import '../src/output.css'

const CUSTOM_VIWQPORTS = {
	smallDesktop: {
		name: 'Small Desktop',
		styles: {
			width: '1024px',
			height: '768px',
		},
		type: 'desktop',
	},
	normalDesktop: {
		name: 'Normal Desktop',
		styles: {
			width: '1920px',
			height: '1080px',
		},
		type: 'desktop',
	},
}

export const preview: Preview = {
	parameters: {
		actions: { argTypesRegex: '^on[A-Z].*' },
		viewport: {
			viewports: {
				...MINIMAL_VIEWPORTS,
				...INITIAL_VIEWPORTS,
				...CUSTOM_VIWQPORTS,
			},
			defaultViewport: 'smallDesktop', // Optional: Set a global default viewport
		},
	},
}

export default preview
