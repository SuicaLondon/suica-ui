import React, { ReactNode } from 'react'
import SidebarItem from './sidebar-item'
import { SidebarItems } from './sidebar-items'
import { SidebarButton } from './sidebar-button'

type SidebarContainerProps = {
	children: ReactNode
}

function SidebarContainer({ children }: SidebarContainerProps) {
	return (
		<aside
			id="default-sidebar"
			className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
			aria-label="Sidebar"
		>
			{children}
		</aside>
	)
}

export const Sidebar = Object.assign(SidebarContainer, {
	Item: SidebarItem,
	Items: SidebarItems,
	Button: SidebarButton,
})
