import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../../cn.js'

export interface SidebarItemsProps extends Omit<
	ComponentPropsWithoutRef<'nav'>,
	'aria-label'
> {
	label: string
	listClassName?: string
	triggerInset?: boolean
}

export const SidebarItems = forwardRef<HTMLElement, SidebarItemsProps>(
	function SidebarItems(
		{ label, listClassName, triggerInset = true, children, className, ...props },
		ref,
	) {
		return (
			<nav
				ref={ref}
				data-slot="sidebar-nav"
				aria-label={label}
				className={cn(
					'box-border h-full overflow-y-auto overscroll-contain',
					'bg-transparent px-3 pb-4',
					triggerInset ? 'pt-18' : 'pt-4',
					className,
				)}
				{...props}
			>
				<ul
					data-slot="sidebar-list"
					className={cn('m-0 box-border grid list-none gap-1 p-0', listClassName)}
				>
					{children}
				</ul>
			</nav>
		)
	},
)
