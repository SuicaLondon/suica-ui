'use client'

import {
	forwardRef,
	useEffect,
	useId,
	useRef,
	useCallback,
	type ComponentPropsWithoutRef,
} from 'react'
import { useControllableBoolean } from '../internal/use-controllable-boolean.js'
import { cn } from '../cn.js'
import { assignRef } from '../internal/assign-ref.js'
import { DropdownMenuContext } from './dropdown-menu-context.js'

export interface DropdownMenuProps extends Omit<
	ComponentPropsWithoutRef<'div'>,
	'defaultValue'
> {
	open?: boolean
	defaultOpen?: boolean
	onOpenChange?: (open: boolean) => void
}

export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
	function DropdownMenu(
		{
			open: controlledOpen,
			defaultOpen = false,
			onOpenChange,
			className,
			children,
			...rootProps
		},
		ref,
	) {
		const [open, requestOpen] = useControllableBoolean(
			controlledOpen,
			defaultOpen,
			onOpenChange,
		)
		const baseId = useId()
		const rootRef = useRef<HTMLDivElement | null>(null)
		const triggerRef = useRef<HTMLButtonElement | null>(null)
		const contentRef = useRef<HTMLDivElement | null>(null)
		const restoreFocusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
			null,
		)
		const focusIntentRef = useRef<'first' | 'last' | null>(null)
		const openRef = useRef(open)
		useEffect(() => {
			openRef.current = open
		}, [open])

		const closeAndFocusTrigger = useCallback(() => {
			requestOpen(false)
			triggerRef.current?.focus()
		}, [requestOpen])

		useEffect(
			() => () => {
				if (restoreFocusTimerRef.current !== null)
					clearTimeout(restoreFocusTimerRef.current)
			},
			[],
		)

		useEffect(() => {
			if (!open) return
			const isInsideMenu = (target: Node) =>
				Boolean(
					rootRef.current?.contains(target) || contentRef.current?.contains(target),
				)

			function handlePointerDown(event: PointerEvent) {
				const target = event.target
				if (target instanceof Node && !isInsideMenu(target)) {
					requestOpen(false)
					if (restoreFocusTimerRef.current !== null)
						clearTimeout(restoreFocusTimerRef.current)
					// Wait for the pointer's native focus action; preserve focus on outside controls.
					restoreFocusTimerRef.current = setTimeout(() => {
						if (
							!openRef.current &&
							document.activeElement === document.body &&
							triggerRef.current?.isConnected
						) {
							triggerRef.current.focus()
						}
					}, 0)
				}
			}

			function handleFocusIn(event: FocusEvent) {
				const target = event.target
				if (target instanceof Node && !isInsideMenu(target)) {
					requestOpen(false)
				}
			}

			function handleKeyDown(event: KeyboardEvent) {
				if (event.key !== 'Escape') return
				event.preventDefault()
				closeAndFocusTrigger()
			}

			document.addEventListener('pointerdown', handlePointerDown)
			document.addEventListener('focusin', handleFocusIn)
			document.addEventListener('keydown', handleKeyDown)
			return () => {
				document.removeEventListener('pointerdown', handlePointerDown)
				document.removeEventListener('focusin', handleFocusIn)
				document.removeEventListener('keydown', handleKeyDown)
			}
		}, [open, requestOpen, closeAndFocusTrigger])

		return (
			<DropdownMenuContext.Provider
				value={{
					open,
					triggerId: `${baseId}-trigger`,
					contentId: `${baseId}-content`,
					rootRef,
					triggerRef,
					contentRef,
					focusIntentRef,
					requestOpen,
					closeAndFocusTrigger,
				}}
			>
				<div
					{...rootProps}
					ref={(element) => {
						rootRef.current = element
						assignRef(ref, element)
					}}
					data-slot="dropdown-menu"
					data-state={open ? 'open' : 'closed'}
					className={cn('relative inline-block', className)}
				>
					{children}
				</div>
			</DropdownMenuContext.Provider>
		)
	},
)
