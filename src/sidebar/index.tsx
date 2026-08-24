import {
	forwardRef,
	useEffect,
	useRef,
	type ComponentPropsWithoutRef,
	type ForwardedRef,
} from 'react'
import { cn } from '../cn.js'
import { getSidebarState, type SidebarState } from './sidebar-state.js'

export interface SidebarProps
	extends Omit<
		ComponentPropsWithoutRef<'aside'>,
		'aria-hidden' | 'aria-label' | 'aria-modal' | 'inert' | 'role' | 'tabIndex'
	> {
	open: boolean
	onOpenChange: (open: boolean) => void
	label: string
	closeLabel: string
	backdropClassName?: string
}

const focusableSelector = [
	'a[href]',
	'button:not([disabled])',
	'input:not([disabled])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'[tabindex]:not([tabindex="-1"])',
].join(',')

function setForwardedRef<T>(ref: ForwardedRef<T>, value: T | null) {
	if (typeof ref === 'function') {
		ref(value)
		return
	}

	if (ref) ref.current = value
}

function getFocusableElements(container: HTMLElement) {
	return Array.from(
		container.querySelectorAll<HTMLElement>(focusableSelector),
	).filter(
		(element) =>
			!element.hasAttribute('disabled') &&
			!element.hasAttribute('inert') &&
			element.getAttribute('aria-hidden') !== 'true',
	)
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
	{
		open,
		onOpenChange,
		label,
		closeLabel,
		backdropClassName,
		className,
		id = 'suica-sidebar',
		children,
		...props
	},
	ref,
) {
	const state = getSidebarState(open)
	const sidebarRef = useRef<HTMLElement | null>(null)
	const onOpenChangeRef = useRef(onOpenChange)
	onOpenChangeRef.current = onOpenChange
	const accessibilityPropsByState: Record<
		SidebarState,
		{
			'aria-hidden': boolean
			'aria-modal'?: true
			inert?: ''
		}
	> = {
		closed: { 'aria-hidden': true, inert: '' },
		open: { 'aria-hidden': false, 'aria-modal': true },
	}
	const accessibilityProps = accessibilityPropsByState[state]

	useEffect(() => {
		if (!open) return
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

			if (event.key !== 'Tab') return

			const focusableElements = getFocusableElements(sidebar)
			const firstElement = focusableElements[0]
			const lastElement = focusableElements.at(-1)

			if (!firstElement || !lastElement) {
				event.preventDefault()
				sidebar.focus()
				return
			}

			const activeElement = document.activeElement
			const isOutsideSidebar =
				activeElement instanceof Node && !sidebar.contains(activeElement)
			const shouldWrapBackward =
				event.shiftKey && (activeElement === firstElement || isOutsideSidebar)
			const shouldWrapForward =
				!event.shiftKey && (activeElement === lastElement || isOutsideSidebar)

			if (shouldWrapBackward) {
				event.preventDefault()
				lastElement.focus()
			}

			if (shouldWrapForward) {
				event.preventDefault()
				firstElement.focus()
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => {
			document.removeEventListener('keydown', handleKeyDown)
			document.body.style.overflow = previousBodyOverflow
			if (previouslyFocusedElement?.isConnected) {
				previouslyFocusedElement.focus()
			}
		}
	}, [open])

	return (
		<>
			{open && (
				<button
					type="button"
					tabIndex={-1}
					data-slot="sidebar-backdrop"
					className={cn(
						'sui:fixed sui:inset-0 sui:z-30 sui:m-0 sui:box-border sui:cursor-default sui:appearance-none sui:border-0 sui:bg-[var(--sui-theme-backdrop)] sui:p-0',
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
					setForwardedRef(ref, element)
				}}
				id={id}
				role="dialog"
				tabIndex={-1}
				data-slot="sidebar"
				aria-label={label}
				data-state={state}
				{...accessibilityProps}
				className={cn(
					'sui:fixed sui:inset-y-0 sui:start-0 sui:z-40 sui:w-[min(18rem,calc(100vw-3rem))] sui:-translate-x-full sui:box-border sui:border-e sui:border-line sui:bg-surface sui:text-foreground sui:shadow-[12px_0_32px_rgb(20_24_20_/_10%)] sui:transition-transform sui:duration-[180ms] sui:ease-[ease-out] sui:data-[state=open]:translate-x-0 sui:motion-reduce:transition-none sui:rtl:translate-x-full sui:rtl:data-[state=open]:translate-x-0 sui:[&_*]:box-border sui:font-[family-name:var(--sui-theme-font-sans)]',
					className,
				)}
			>
				{children}
			</aside>
		</>
	)
})

export * from './sidebar-button/index.js'
export * from './sidebar-item/index.js'
export * from './sidebar-items/index.js'
