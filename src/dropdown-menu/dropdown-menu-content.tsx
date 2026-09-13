'use client'

import {
	forwardRef,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
	type ComponentPropsWithoutRef,
	type CSSProperties,
	type KeyboardEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { getMenuPosition, type MenuPosition } from './menu-position.js'
import { cn } from '../cn.js'
import { useHydrated } from '../internal/use-hydrated.js'
import { assignRef } from '../internal/assign-ref.js'
import { getFocusableElements } from '../internal/focus.js'
import {
	dropdownMenuItemSelector,
	useDropdownMenuContext,
} from './dropdown-menu-context.js'

export interface DropdownMenuContentProps extends Omit<
	ComponentPropsWithoutRef<'div'>,
	'role'
> {
	align?: 'start' | 'center' | 'end'
	side?: 'top' | 'bottom'
	collisionPadding?: number
}

function getNextItemIndex(currentIndex: number, delta: 1 | -1, count: number) {
	if (count === 0) return -1
	if (currentIndex < 0) return delta === 1 ? 0 : count - 1
	return (currentIndex + delta + count) % count
}

function getItems(content: HTMLDivElement) {
	return Array.from(
		content.querySelectorAll<HTMLElement>(dropdownMenuItemSelector),
	)
}

function getAdjacentTabStop(trigger: HTMLButtonElement, direction: 1 | -1) {
	const tabStops = getFocusableElements(document)
	const triggerIndex = tabStops.indexOf(trigger)
	return triggerIndex < 0 ? undefined : tabStops[triggerIndex + direction]
}

export const DropdownMenuContent = forwardRef<
	HTMLDivElement,
	DropdownMenuContentProps
>(function DropdownMenuContent(
	{
		align = 'start',
		side = 'bottom',
		collisionPadding = 8,
		className,
		children,
		onKeyDown,
		style,
		...contentProps
	},
	ref,
) {
	const context = useDropdownMenuContext('DropdownMenuContent')
	const hydrated = useHydrated()
	const searchRef = useRef('')
	const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const [position, setPosition] = useState<MenuPosition | null>(null)

	useLayoutEffect(() => {
		if (!hydrated || !context.open) {
			setPosition(null)
			return
		}
		const trigger = context.triggerRef.current
		const content = context.contentRef.current
		if (!trigger || !content) return

		const updatePosition = () => {
			setPosition(getMenuPosition(trigger, content, side, align, collisionPadding))
		}
		updatePosition()
		window.addEventListener('resize', updatePosition)
		window.addEventListener('scroll', updatePosition, true)
		const resizeObserver =
			typeof ResizeObserver === 'undefined'
				? null
				: new ResizeObserver(updatePosition)
		resizeObserver?.observe(trigger)
		resizeObserver?.observe(content)

		return () => {
			window.removeEventListener('resize', updatePosition)
			window.removeEventListener('scroll', updatePosition, true)
			resizeObserver?.disconnect()
		}
	}, [align, collisionPadding, context.open, hydrated, side])

	useEffect(() => {
		if (!hydrated || !context.open) return
		const items = context.contentRef.current
			? getItems(context.contentRef.current)
			: []
		const target =
			context.focusIntentRef.current === 'last' ? items.at(-1) : items[0]
		context.focusIntentRef.current = null
		target?.focus()
	}, [context.open, hydrated])

	useEffect(() => {
		return () => {
			if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
		}
	}, [])

	function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
		onKeyDown?.(event)
		if (event.defaultPrevented) return

		const items = getItems(event.currentTarget)
		const currentIndex = items.indexOf(document.activeElement as HTMLElement)
		if (event.key === 'Tab') {
			const trigger = context.triggerRef.current
			const target = trigger
				? getAdjacentTabStop(trigger, event.shiftKey ? -1 : 1)
				: undefined
			if (target) event.preventDefault()
			context.requestOpen(false)
			target?.focus()
			return
		}

		if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
			event.preventDefault()
			const delta = event.key === 'ArrowDown' ? 1 : -1
			const nextIndex = getNextItemIndex(currentIndex, delta, items.length)
			items[nextIndex]?.focus()
			return
		}

		if (event.key === 'Home' || event.key === 'End') {
			event.preventDefault()
			const target = event.key === 'Home' ? items[0] : items.at(-1)
			target?.focus()
			return
		}

		if (
			event.key.length === 1 &&
			!event.altKey &&
			!event.ctrlKey &&
			!event.metaKey
		) {
			const key = event.key.toLocaleLowerCase()
			searchRef.current += key
			if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
			searchTimerRef.current = setTimeout(() => {
				searchRef.current = ''
			}, 500)
			const characters = Array.from(searchRef.current)
			const query = characters.every((character) => character === key)
				? key
				: searchRef.current
			const orderedItems = [
				...items.slice(currentIndex + 1),
				...items.slice(0, currentIndex + 1),
			]
			orderedItems
				.find((item) =>
					item.textContent?.trim().toLocaleLowerCase().startsWith(query),
				)
				?.focus()
		}
	}

	if (!hydrated || !context.open) return null

	const positionStyle: CSSProperties & { '--sui-menu-inset': string } = {
		...style,
		'--sui-menu-inset': `${Math.max(0, collisionPadding) * 2}px`,
		left: position?.left ?? 0,
		top: position?.top ?? 0,
		visibility: position ? style?.visibility : 'hidden',
	}

	return createPortal(
		<div
			{...contentProps}
			ref={(element) => {
				context.contentRef.current = element
				assignRef(ref, element)
			}}
			id={context.contentId}
			role="menu"
			aria-labelledby={context.triggerId}
			data-slot="dropdown-menu-content"
			data-align={align}
			data-side={position?.side ?? side}
			style={positionStyle}
			className={cn(
				'box-border menu-viewport',
				'fixed z-50 min-w-48 overflow-y-auto',
				'rounded-panel border border-line bg-surface-elevated p-1',
				'text-foreground shadow-sm',
				'font-sans',
				className,
			)}
			onKeyDown={handleKeyDown}
		>
			{children}
		</div>,
		document.body,
	)
})
