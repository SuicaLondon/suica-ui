import React, { memo, ReactNode } from 'react'

export type SidebarItemsProps = {
	children: ReactNode
}

export const SidebarItems = memo(function SidebarItems({
	children,
}: SidebarItemsProps) {
	return (
		<div className="h-full overflow-y-auto bg-gray-50 px-3 py-4 dark:bg-primary-gray">
			<ul className="space-y-2 font-medium">{children}</ul>
		</div>
	)
})
