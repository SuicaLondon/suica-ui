import preview, { surfaceStyleByLayout } from './preview'

describe('Storybook preview', () => {
	it('uses the available canvas width unless a viewport is selected explicitly', () => {
		const viewport = preview.parameters?.viewport as
			{ defaultViewport?: string } | undefined

		expect(viewport?.defaultViewport).toBeUndefined()
	})

	it('lets component stories size their surface by content', () => {
		expect(surfaceStyleByLayout.centered).not.toHaveProperty('minHeight')
		expect(surfaceStyleByLayout.padded).not.toHaveProperty('minHeight')
		expect(surfaceStyleByLayout.fullscreen).not.toHaveProperty('minHeight')
	})
})
