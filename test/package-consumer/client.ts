'use client'

import { createElement } from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from 'suica-ui/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLink,
	DropdownMenuTrigger,
} from 'suica-ui/dropdown-menu'
import { NestedScrollView } from 'suica-ui/nested-scroll-view'
import {
	Sidebar,
	SidebarItem,
	SidebarItems,
	SidebarTrigger,
	useResponsiveSidebar,
} from 'suica-ui/sidebar'
import { Tabs } from 'suica-ui/tabs'
import { TableControl } from 'suica-ui/table-control'

export function ResponsiveSidebarFixture() {
	const sidebar = useResponsiveSidebar()
	const navigation = createElement(
		SidebarItems,
		{ label: 'Primary links', triggerInset: !sidebar.isDesktop },
		createElement(SidebarItem, { href: '/posts' }, 'Posts'),
	)

	return createElement(
		'div',
		null,
		sidebar.isDesktop
			? null
			: createElement(SidebarTrigger, {
					open: sidebar.mobileOpen,
					onOpenChange: sidebar.setMobileOpen,
					label: 'Toggle navigation',
				}),
		createElement(
			Sidebar,
			{
				open: sidebar.open,
				mode: sidebar.mode,
				onOpenChange: sidebar.setOpen,
				label: 'Primary navigation',
				closeLabel: 'Close navigation',
			},
			navigation,
		),
	)
}

void createElement(
	Dialog,
	{ open: false, onOpenChange: () => undefined },
	createElement(
		DialogContent,
		null,
		createElement(DialogTitle, null, 'Confirmation'),
		createElement(DialogDescription, null, 'Confirm the action.'),
	),
)
void createElement(
	DropdownMenu,
	null,
	createElement(DropdownMenuTrigger, null, 'Menu'),
	createElement(
		DropdownMenuContent,
		null,
		createElement(DropdownMenuItem, null, 'Item'),
	),
)
void createElement(NestedScrollView, {
	scrollableDistance: 100,
	minDistanceToTop: 20,
	header: null,
	children: null,
})
void createElement(Sidebar, {
	open: false,
	onOpenChange: () => undefined,
	label: 'Navigation',
	closeLabel: 'Close navigation',
})
void createElement(Tabs, {
	'aria-label': 'Sections',
	tabs: [{ id: 'one', label: 'One', panel: 'Panel' }],
	mountStrategy: 'lazy',
})
void createElement(TableControl, {
	'aria-label': 'Pagination',
	itemLabel: 'posts',
	onPaginationChange: () => undefined,
	pagination: { page: 1, pageSize: 10, total: 1, totalPages: 1 },
})

void createElement(
	DropdownMenuLink,
	{
		render: (props) => createElement('a', { ...props, href: '/posts' }),
	},
	'Posts',
)
void createElement(
	SidebarItem,
	{
		'aria-current': 'page',
		render: (props) => createElement('a', { ...props, href: '/posts' }),
	},
	'Posts',
)

import { DatePicker } from 'suica-ui/date-picker'
void createElement(DatePicker, {
	selected: new Date(2026, 8, 13),
	onSelect: () => undefined,
})
