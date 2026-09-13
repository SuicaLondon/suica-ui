import { act, renderHook } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { useResponsiveSidebar } from './use-responsive-sidebar'

interface MediaController {
	setMatches: (matches: boolean) => void
	listeners: Set<() => void>
}

function mockMatchMedia(initialMatches = false): MediaController {
	let matches = initialMatches
	const listeners = new Set<() => void>()
	const matchMedia = vi.fn(
		(query) =>
			({
				media: query,
				get matches() {
					return matches
				},
				onchange: null,
				addEventListener: (_type: string, listener: EventListener) =>
					listeners.add(listener as () => void),
				removeEventListener: (_type: string, listener: EventListener) =>
					listeners.delete(listener as () => void),
				addListener: () => undefined,
				removeListener: () => undefined,
				dispatchEvent: () => true,
			}) as MediaQueryList,
	)
	Object.defineProperty(window, 'matchMedia', {
		configurable: true,
		value: matchMedia,
	})
	return {
		listeners,
		setMatches(nextMatches) {
			matches = nextMatches
			for (const listener of listeners) listener()
		},
	}
}

afterEach(() => vi.restoreAllMocks())

describe('useResponsiveSidebar', () => {
	it('switches modes and keeps desktop and mobile state independent', () => {
		const media = mockMatchMedia()
		const { result } = renderHook(() =>
			useResponsiveSidebar({ defaultDesktopOpen: false }),
		)

		expect(result.current.mode).toBe('modal')
		act(() => result.current.setMobileOpen(true))
		expect(result.current.open).toBe(true)
		expect(result.current.desktopOpen).toBe(false)

		act(() => media.setMatches(true))
		expect(result.current.mode).toBe('persistent')
		expect(result.current.open).toBe(false)
		expect(result.current.mobileOpen).toBe(false)

		act(() => result.current.setDesktopOpen(true))
		act(() => media.setMatches(false))
		expect(result.current.mode).toBe('modal')
		expect(result.current.open).toBe(false)
		expect(result.current.desktopOpen).toBe(true)
	})

	it('uses the md breakpoint and removes its listener on unmount', () => {
		const media = mockMatchMedia()
		const { unmount } = renderHook(() => useResponsiveSidebar())
		expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 48rem)')
		expect(media.listeners.size).toBe(1)
		unmount()
		expect(media.listeners.size).toBe(0)
	})

	it('has a stable mobile server snapshot', () => {
		mockMatchMedia(true)
		function Fixture() {
			const sidebar = useResponsiveSidebar()
			return <span>{sidebar.mode}</span>
		}
		expect(renderToString(<Fixture />)).toContain('modal')
	})
})
