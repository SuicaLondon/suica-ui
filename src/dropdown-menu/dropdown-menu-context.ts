import {
	createContext,
	useContext,
	type MutableRefObject,
	type RefObject,
} from 'react'

export type DropdownFocusIntent = 'first' | 'last' | null

export interface DropdownMenuContextValue {
	open: boolean
	triggerId: string
	contentId: string
	rootRef: RefObject<HTMLDivElement | null>
	triggerRef: RefObject<HTMLButtonElement | null>
	contentRef: RefObject<HTMLDivElement | null>
	focusIntentRef: MutableRefObject<DropdownFocusIntent>
	requestOpen: (open: boolean) => void
	closeAndFocusTrigger: () => void
}

export const DropdownMenuContext = createContext<
	DropdownMenuContextValue | undefined
>(undefined)

export function useDropdownMenuContext(componentName: string) {
	const context = useContext(DropdownMenuContext)
	if (!context) {
		throw new Error(`${componentName} must be used within DropdownMenu`)
	}
	return context
}

export const dropdownMenuItemSelector =
	'[data-slot="dropdown-menu-item"]:not(:disabled):not([aria-disabled="true"])'
