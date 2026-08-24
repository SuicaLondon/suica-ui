export type SidebarState = 'closed' | 'open'

const sidebarStateByOpen: Record<0 | 1, SidebarState> = {
	0: 'closed',
	1: 'open',
}

export function getSidebarState(open: boolean) {
	return sidebarStateByOpen[Number(open) as 0 | 1]
}
