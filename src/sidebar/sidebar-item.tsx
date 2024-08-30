import React, { ReactNode } from 'react'

type SidebarItemProps = {
	href: string
	icon: ReactNode
	children: ReactNode
	label?: ReactNode
}

export default function SidebarItem({
	href,
	icon,
	children,
	label,
}: SidebarItemProps) {
	return (
		<li>
			<a
				href={href}
				className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
			>
				{icon}
				<span className="ms-3">{children}</span>
				{label}
			</a>
		</li>
	)
}
