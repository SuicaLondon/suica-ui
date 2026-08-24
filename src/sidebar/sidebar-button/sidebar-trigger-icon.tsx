import type { SidebarState } from '../sidebar-state.js'

const triggerPathByState: Record<SidebarState, string> = {
	closed: 'M4 6H20M4 12H20M4 18H20',
	open: 'M5 5L19 19M19 5L5 19',
}

export interface SidebarTriggerIconProps {
	state: SidebarState
}

export function SidebarTriggerIcon({ state }: SidebarTriggerIconProps) {
	return (
		<svg
			aria-hidden="true"
			data-slot="sidebar-trigger-icon"
			className="sui:block sui:size-6"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d={triggerPathByState[state]} />
		</svg>
	)
}
