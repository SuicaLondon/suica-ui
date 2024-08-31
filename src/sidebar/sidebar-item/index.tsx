import { memo, ReactNode } from 'react'

export type SidebarItemProps = {
	href: string
	icon: ReactNode
	children: ReactNode
	label?: ReactNode
}

export const SidebarItem = memo(function SidebarItem({
	href,
	icon,
	children,
	label,
}: SidebarItemProps) {
	return (
		<li className="list-none">
			<a
				href={href}
				className="group flex items-center rounded-lg p-2 text-primary-gray hover:bg-gray-100 dark:text-white dark:hover:bg-primary-gray"
			>
				{icon}
				<span className="ms-3">{children}</span>
				{label}
			</a>
		</li>
	)
})
