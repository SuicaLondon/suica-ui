'use client'

import {
	forwardRef,
	useEffect,
	useRef,
	type ComponentPropsWithoutRef,
	type MouseEvent as ReactMouseEvent,
	type RefObject,
} from 'react'
import { cn } from '../cn.js'
import { assignRef } from '../internal/assign-ref.js'
import { getFocusableElements, trapFocus } from '../internal/focus.js'
import { useDialogContext } from './dialog-context.js'

function isBackdropClick(event: ReactMouseEvent<HTMLDialogElement>) {
	if (event.target !== event.currentTarget) return false
	const { bottom, left, right, top } =
		event.currentTarget.getBoundingClientRect()
	return (
		event.clientX < left ||
		event.clientX > right ||
		event.clientY < top ||
		event.clientY > bottom
	)
}

export interface DialogContentProps extends Omit<
	ComponentPropsWithoutRef<'dialog'>,
	'aria-describedby' | 'aria-labelledby' | 'onCancel' | 'onClose' | 'open'
> {
	initialFocusRef?: RefObject<HTMLElement | null>
}

export const DialogContent = forwardRef<HTMLDialogElement, DialogContentProps>(
	function DialogContent(
		{ className, children, initialFocusRef, onClick, onKeyDown, ...contentProps },
		ref,
	) {
		const context = useDialogContext('DialogContent')
		const dialogRef = useRef<HTMLDialogElement | null>(null)
		const previouslyFocusedRef = useRef<HTMLElement | null>(null)

		useEffect(() => {
			const dialog = dialogRef.current
			if (!dialog) return
			if (!context.open) {
				if (dialog.open) dialog.close()
				return
			}

			previouslyFocusedRef.current =
				document.activeElement instanceof HTMLElement
					? document.activeElement
					: null
			const previousBodyOverflow = document.body.style.overflow
			document.body.style.overflow = 'hidden'
			if (!dialog.open) dialog.showModal()
			const focusTarget =
				initialFocusRef?.current ?? getFocusableElements(dialog)[0] ?? dialog
			focusTarget.focus()

			return () => {
				document.body.style.overflow = previousBodyOverflow
				if (dialog.open) dialog.close()
				const restoreTarget =
					context.triggerRef.current ?? previouslyFocusedRef.current
				if (restoreTarget?.isConnected) restoreTarget.focus()
				previouslyFocusedRef.current = null
			}
		}, [context.open, context.triggerRef, initialFocusRef])

		return (
			<dialog
				{...contentProps}
				ref={(element) => {
					dialogRef.current = element
					assignRef(ref, element)
				}}
				id={context.contentId}
				aria-labelledby={context.titleId}
				aria-describedby={context.descriptionId}
				data-slot="dialog-content"
				data-state={context.open ? 'open' : 'closed'}
				className={cn(
					'm-auto box-border dialog-viewport',
					'overflow-auto rounded-panel',
					'border border-line bg-surface-elevated p-6 text-foreground',
					'shadow-sm backdrop:bg-backdrop',
					'motion-reduce:transition-none',
					'font-sans',
					className,
				)}
				onCancel={(event) => {
					event.preventDefault()
					if (context.closeOnEscape) context.requestOpen(false)
				}}
				onClose={() => {
					if (context.open) context.requestOpen(false)
				}}
				onClick={(event) => {
					onClick?.(event)
					if (
						!event.defaultPrevented &&
						context.closeOnOverlayClick &&
						isBackdropClick(event)
					) {
						context.requestOpen(false)
					}
				}}
				onKeyDown={(event) => {
					onKeyDown?.(event)
					trapFocus(event, event.currentTarget)
				}}
			>
				{children}
			</dialog>
		)
	},
)
