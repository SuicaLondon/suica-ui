import React, { memo, ReactNode } from 'react'

type SidebarItemsProps = {
	children: ReactNode
}

export const SidebarItems = memo(function SidebarItems({
	children,
}: SidebarItemsProps) {
	return (
		<div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
			<ul className="space-y-2 font-medium">{children}</ul>
		</div>
	)
})
