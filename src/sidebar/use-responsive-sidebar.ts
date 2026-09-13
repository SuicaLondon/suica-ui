'use client'

import { useEffect, useMemo, useSyncExternalStore } from 'react'
import { useControllableBoolean } from '../internal/use-controllable-boolean.js'
import type { SidebarMode } from './sidebar.js'

const breakpointQueries = {
	sm: '(min-width: 40rem)',
	md: '(min-width: 48rem)',
	lg: '(min-width: 64rem)',
	xl: '(min-width: 80rem)',
} as const

export type SidebarBreakpoint = keyof typeof breakpointQueries | string

export interface UseResponsiveSidebarOptions {
	breakpoint?: SidebarBreakpoint
	desktopOpen?: boolean
	defaultDesktopOpen?: boolean
	onDesktopOpenChange?: (open: boolean) => void
	mobileOpen?: boolean
	defaultMobileOpen?: boolean
	onMobileOpenChange?: (open: boolean) => void
	closeMobileOnDesktop?: boolean
}

export interface ResponsiveSidebarState {
	isDesktop: boolean
	mode: SidebarMode
	open: boolean
	setOpen: (open: boolean) => void
	desktopOpen: boolean
	setDesktopOpen: (open: boolean) => void
	mobileOpen: boolean
	setMobileOpen: (open: boolean) => void
}

function getMediaQuery(breakpoint: SidebarBreakpoint) {
	return breakpoint in breakpointQueries
		? breakpointQueries[breakpoint as keyof typeof breakpointQueries]
		: breakpoint
}

export function useResponsiveSidebar({
	breakpoint = 'md',
	desktopOpen: controlledDesktopOpen,
	defaultDesktopOpen = true,
	onDesktopOpenChange,
	mobileOpen: controlledMobileOpen,
	defaultMobileOpen = false,
	onMobileOpenChange,
	closeMobileOnDesktop = true,
}: UseResponsiveSidebarOptions = {}): ResponsiveSidebarState {
	const mediaQuery = getMediaQuery(breakpoint)
	const mediaStore = useMemo(
		() => ({
			subscribe(callback: () => void) {
				const media = window.matchMedia(mediaQuery)
				media.addEventListener('change', callback)
				return () => media.removeEventListener('change', callback)
			},
			getSnapshot: () => window.matchMedia(mediaQuery).matches,
			getServerSnapshot: () => false,
		}),
		[mediaQuery],
	)
	const isDesktop = useSyncExternalStore(
		mediaStore.subscribe,
		mediaStore.getSnapshot,
		mediaStore.getServerSnapshot,
	)
	const [desktopOpen, setDesktopOpen] = useControllableBoolean(
		controlledDesktopOpen,
		defaultDesktopOpen,
		onDesktopOpenChange,
	)
	const [mobileOpen, setMobileOpen] = useControllableBoolean(
		controlledMobileOpen,
		defaultMobileOpen,
		onMobileOpenChange,
	)

	useEffect(() => {
		if (isDesktop && closeMobileOnDesktop && mobileOpen) setMobileOpen(false)
	}, [closeMobileOnDesktop, isDesktop, mobileOpen, setMobileOpen])

	return {
		isDesktop,
		mode: isDesktop ? 'persistent' : 'modal',
		open: isDesktop ? desktopOpen : mobileOpen,
		setOpen: isDesktop ? setDesktopOpen : setMobileOpen,
		desktopOpen,
		setDesktopOpen,
		mobileOpen,
		setMobileOpen,
	}
}
