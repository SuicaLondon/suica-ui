import { render } from '@testing-library/react'
import { createElement } from 'react'
import type { Decorator } from '@storybook/react-vite'
import preview from './preview'

describe('Storybook preview', () => {
	it('uses the available canvas width unless a viewport is selected explicitly', () => {
		const viewport = preview.parameters?.viewport as
			{ defaultViewport?: string } | undefined

		expect(viewport?.defaultViewport).toBeUndefined()
	})

	it.each(['centered', 'padded', 'fullscreen'])(
		'lets %s stories size their surface by content',
		(layout) => {
			const decorate = preview.decorators?.[1]
			if (!decorate) throw new Error('Expected the theme surface decorator')
			const content = decorate(
				() => createElement('span', null, 'Story content'),
				{ parameters: { layout }, viewMode: 'story' } as Parameters<Decorator>[1],
			)
			const { container } = render(createElement('div', null, content))
			const surface = container.firstElementChild?.firstElementChild
			expect(surface).toHaveTextContent('Story content')
			expect(surface).not.toHaveAttribute('style')
			expect(surface?.className).not.toMatch(/(?:^|\s)(?:min-)?h-/u)
		},
	)
})
