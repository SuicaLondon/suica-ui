import clsx from 'clsx'
import React, { memo, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export type SidebarItemsProps = {
	withSidebarButton?: boolean
	className: string
	children: ReactNode
}

export const SidebarItems = memo(function SidebarItems({
	withSidebarButton,
	children,
	className,
}: SidebarItemsProps) {
	return (
		<div
			className={twMerge(
				'h-full overflow-y-auto bg-gray-50 px-3 py-4 dark:bg-primary-gray',
				clsx({ 'pt-16': withSidebarButton }),
				className,
			)}
		>
			<ul className="space-y-2 font-medium">{children}</ul>
		</div>
	)
})
