'use client'

import { createContext, useContext, type RefObject } from 'react'

export interface DialogContextValue {
	open: boolean
	dismissible: boolean
	closeOnEscape: boolean
	closeOnOverlayClick: boolean
	contentId: string
	titleId: string
	descriptionId: string
	triggerRef: RefObject<HTMLButtonElement | null>
	requestOpen: (open: boolean) => void
}

export const DialogContext = createContext<DialogContextValue | null>(null)

export function useDialogContext(componentName: string) {
	const context = useContext(DialogContext)
	if (!context) throw new Error(`${componentName} must be used inside Dialog`)
	return context
}
