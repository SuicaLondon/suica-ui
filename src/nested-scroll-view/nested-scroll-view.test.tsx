import { act, fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { NestedScrollView } from './index'

describe('NestedScrollView', () => {
	let frameCallback: FrameRequestCallback | undefined

	beforeEach(() => {
		frameCallback = undefined
		vi.stubGlobal(
			'requestAnimationFrame',
			vi.fn((callback: FrameRequestCallback) => {
				frameCallback = callback
				return 42
			}),
		)
		vi.stubGlobal('cancelAnimationFrame', vi.fn())
	})

	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('positions its scroller from the public distance props', () => {
		const ref = createRef<HTMLDivElement>()
		const { container } = render(
			<NestedScrollView
				ref={ref}
				scrollableDistance={180}
				minDistanceToTop={60}
				extraHeight={24}
				header={<header>Profile header</header>}
				className="root-class"
				scrollerClassName="scroller-class"
				contentClassName="content-class"
				scrollerProps={{
					'aria-label': 'Scrollable profile content',
					tabIndex: 0,
				}}
				data-testid="nested-view"
			>
				<p>Scrollable content</p>
			</NestedScrollView>,
		)

		const root = screen.getByTestId('nested-view')
		const scroller = container.querySelector('.scroller-class')
		const content = container.querySelector('.content-class')

		expect(ref.current).toBe(root)
		expect(root).toHaveClass('root-class')
		expect(root).toHaveClass(
			'sui:[scrollbar-width:none]',
			'sui:[&::-webkit-scrollbar]:hidden',
		)
		expect(screen.getByText('Profile header')).toBeInTheDocument()
		expect(screen.getByText('Scrollable content')).toBeInTheDocument()
		expect(scroller).toHaveStyle({
			top: '180px',
			height: 'calc(100dvh - 180px)',
		})
		expect(scroller).toHaveAttribute('aria-label', 'Scrollable profile content')
		expect(scroller).toHaveAttribute('tabindex', '0')
		expect(content).toHaveStyle({ paddingBottom: '24px' })
	})

	it('shrinks to the minimum top distance as the inner view scrolls', () => {
		const { container } = render(
			<NestedScrollView
				scrollableDistance={180}
				minDistanceToTop={60}
				header={<header>Header</header>}
				scrollerClassName="scroller"
			>
				Content
			</NestedScrollView>,
		)
		const scroller = container.querySelector('.scroller')
		if (!(scroller instanceof HTMLDivElement)) {
			throw new Error('Expected the nested scroller to render')
		}

		fireEvent.scroll(scroller, { target: { scrollTop: 50 } })
		expect(requestAnimationFrame).toHaveBeenCalledTimes(1)

		act(() => frameCallback?.(0))
		expect(scroller).toHaveStyle({ top: '130px' })

		fireEvent.scroll(scroller, { target: { scrollTop: 999 } })
		act(() => frameCallback?.(16))
		expect(scroller).toHaveStyle({
			top: '60px',
			height: 'calc(100dvh - 60px)',
		})
	})

	it('normalizes negative distances and cancels pending work on unmount', () => {
		const { container, unmount } = render(
			<NestedScrollView
				scrollableDistance={-20}
				minDistanceToTop={-10}
				extraHeight={-30}
				header={<header>Header</header>}
				scrollerClassName="scroller"
				contentClassName="content"
			>
				Content
			</NestedScrollView>,
		)
		const scroller = container.querySelector('.scroller')
		const content = container.querySelector('.content')

		expect(scroller).toHaveStyle({ top: '0px' })
		expect(content).toHaveStyle({ paddingBottom: '0px' })

		if (!(scroller instanceof HTMLDivElement)) {
			throw new Error('Expected the nested scroller to render')
		}
		fireEvent.scroll(scroller, { target: { scrollTop: 10 } })
		unmount()

		expect(cancelAnimationFrame).toHaveBeenCalledWith(42)
	})
})
