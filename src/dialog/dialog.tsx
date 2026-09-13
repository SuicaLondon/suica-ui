'use client'

import { useId, useRef, type ReactNode } from 'react'
import { useControllableBoolean } from '../internal/use-controllable-boolean.js'
import { DialogContext } from './dialog-context.js'

export interface DialogProps {
	children?: ReactNode
	open?: boolean
	defaultOpen?: boolean
	onOpenChange?: (open: boolean) => void
	dismissible?: boolean
	closeOnEscape?: boolean
	closeOnOverlayClick?: boolean
}

export function Dialog({
	children,
	open: controlledOpen,
	defaultOpen = false,
	onOpenChange,
	dismissible = true,
	closeOnEscape = true,
	closeOnOverlayClick = true,
}: DialogProps) {
	const [open, setOpen] = useControllableBoolean(
		controlledOpen,
		defaultOpen,
		onOpenChange,
	)
	const baseId = useId()
	const triggerRef = useRef<HTMLButtonElement | null>(null)

	function requestOpen(nextOpen: boolean) {
		if (!nextOpen && !dismissible) return
		setOpen(nextOpen)
	}

	return (
		<DialogContext.Provider
			value={{
				open,
				dismissible,
				closeOnEscape,
				closeOnOverlayClick,
				contentId: `${baseId}-content`,
				titleId: `${baseId}-title`,
				descriptionId: `${baseId}-description`,
				triggerRef,
				requestOpen,
			}}
		>
			{children}
		</DialogContext.Provider>
	)
}
