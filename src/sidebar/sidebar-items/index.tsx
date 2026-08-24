import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../../cn.js'

export interface SidebarItemsProps
	extends Omit<ComponentPropsWithoutRef<'nav'>, 'aria-label'> {
	label: string
	listClassName?: string
}

export const SidebarItems = forwardRef<HTMLElement, SidebarItemsProps>(
	function SidebarItems(
		{ label, listClassName, children, className, ...props },
		ref,
	) {
		return (
			<nav
				ref={ref}
				data-slot="sidebar-nav"
				aria-label={label}
				className={cn(
					'sui:h-full sui:box-border sui:overflow-y-auto sui:overscroll-contain sui:bg-transparent sui:px-3 sui:pt-[4.5rem] sui:pb-4',
					className,
				)}
				{...props}
			>
				<ul
					data-slot="sidebar-list"
					className={cn(
						'sui:m-0 sui:grid sui:box-border sui:list-none sui:gap-1 sui:p-0',
						listClassName,
					)}
				>
					{children}
				</ul>
			</nav>
		)
	},
)
