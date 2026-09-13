'use client'

import {
	forwardRef,
	useEffect,
	useRef,
	type ComponentPropsWithoutRef,
} from 'react'
import { cn } from '../cn.js'
import { assignRef } from '../internal/assign-ref.js'
import { getFocusableElements, trapFocus } from '../internal/focus.js'
import { getSidebarState, type SidebarState } from './sidebar-state.js'

export interface SidebarProps extends Omit<
	ComponentPropsWithoutRef<'aside'>,
	'aria-hidden' | 'aria-label' | 'aria-modal' | 'inert' | 'role' | 'tabIndex'
> {
	open: boolean
	onOpenChange: (open: boolean) => void
	label: string
	closeLabel: string
	backdropClassName?: string
	mode?: SidebarMode
}

export type SidebarMode = 'modal' | 'persistent'

const sidebarClassNameByMode: Record<SidebarMode, string> = {
	modal: cn(
		'fixed inset-y-0 start-0 z-40 sidebar-width',
		'-translate-x-full shadow-sm transition-transform',
		'data-[state=open]:translate-x-0 rtl:translate-x-full',
		'rtl:data-[state=open]:translate-x-0',
	),
	persistent: cn(
		'relative h-full w-0 shrink-0 overflow-hidden border-e-0',
		'transition-width data-[state=open]:w-72 data-[state=open]:border-e',
	),
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
	{
		open,
		onOpenChange,
		label,
		closeLabel,
		backdropClassName,
		mode = 'modal',
		className,
		id = 'suica-sidebar',
		children,
		...props
	},
	ref,
) {
	const state = getSidebarState(open)
	const isModal = mode === 'modal'
	const sidebarRef = useRef<HTMLElement | null>(null)
	const onOpenChangeRef = useRef(onOpenChange)
	onOpenChangeRef.current = onOpenChange
	const accessibilityPropsByState: Record<
		SidebarState,
		{
			'aria-hidden': boolean
			'aria-modal'?: true
			inert?: true
		}
	> = {
		closed: { 'aria-hidden': true, inert: true },
		open: {
			'aria-hidden': false,
			...(isModal ? { 'aria-modal': true as const } : {}),
		},
	}
	const accessibilityProps = accessibilityPropsByState[state]

	useEffect(() => {
		if (!open || !isModal) return
		const currentSidebar = sidebarRef.current
		if (!currentSidebar) return
		const sidebar: HTMLElement = currentSidebar

		const previouslyFocusedElement =
			document.activeElement instanceof HTMLElement ? document.activeElement : null
		const previousBodyOverflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'

		const firstFocusableElement = getFocusableElements(sidebar)[0]
		if (firstFocusableElement) {
			firstFocusableElement.focus()
		} else {
			sidebar.focus()
		}

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				event.preventDefault()
				onOpenChangeRef.current(false)
				return
			}

			trapFocus(event, sidebar)
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => {
			document.removeEventListener('keydown', handleKeyDown)
			document.body.style.overflow = previousBodyOverflow
			if (previouslyFocusedElement?.isConnected) {
				previouslyFocusedElement.focus()
			}
		}
	}, [isModal, open])

	return (
		<>
			{isModal && open && (
				<button
					type="button"
					tabIndex={-1}
					data-slot="sidebar-backdrop"
					className={cn(
						'fixed inset-0 z-30 m-0 box-border cursor-default',
						'appearance-none border-0 bg-backdrop p-0',
						backdropClassName,
					)}
					aria-label={closeLabel}
					onClick={() => onOpenChange(false)}
				/>
			)}
			<aside
				{...props}
				ref={(element) => {
					sidebarRef.current = element
					assignRef(ref, element)
				}}
				id={id}
				role={isModal ? 'dialog' : undefined}
				tabIndex={isModal ? -1 : undefined}
				data-slot="sidebar"
				data-mode={mode}
				aria-label={label}
				data-state={state}
				{...accessibilityProps}
				className={cn(
					'box-border border-line bg-surface text-foreground',
					'duration-180 ease-out motion-reduce:transition-none',
					'border-box-children font-sans',
					sidebarClassNameByMode[mode],
					className,
				)}
			>
				{children}
			</aside>
		</>
	)
})
