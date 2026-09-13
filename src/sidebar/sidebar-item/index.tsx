import {
	forwardRef,
	type ComponentPropsWithoutRef,
	type ComponentPropsWithRef,
	type ReactElement,
	type ReactNode,
} from 'react'
import { cn } from '../../cn.js'

export type SidebarItemRenderProps = ComponentPropsWithRef<'a'> & {
	'data-slot'?: string
}

export interface SidebarItemProps extends ComponentPropsWithoutRef<'a'> {
	render?: (props: SidebarItemRenderProps) => ReactElement
	icon?: ReactNode
	badge?: ReactNode
}

export const SidebarItem = forwardRef<HTMLAnchorElement, SidebarItemProps>(
	function SidebarItem(
		{ icon, badge, children, className, render, ...anchorProps },
		ref,
	) {
		const renderedProps: SidebarItemRenderProps = {
			ref,
			'data-slot': 'sidebar-item',
			className: cn(
				'box-border flex min-h-11 items-center gap-3',
				'touch-manipulation rounded-control border border-transparent',
				'bg-transparent px-3 py-2.5 text-foreground no-underline',
				'transition-tab-colors duration-150',
				'leading-tight font-medium ease-natural hover:border-line-strong',
				'hover:bg-hover hover:text-accent focus-visible:outline-2',
				'focus-visible:outline-offset-2 focus-visible:outline-focus',
				'aria-[current=page]:border-line-strong aria-[current=page]:bg-hover',
				'aria-[current=page]:text-accent motion-reduce:transition-none',
				'font-inherit',
				className,
			),
			...anchorProps,
			children: (
				<>
					{!!icon && (
						<span
							aria-hidden="true"
							data-slot="sidebar-item-icon"
							className={'grid size-5 flex-none place-items-center text-icon'}
						>
							{icon}
						</span>
					)}
					<span data-slot="sidebar-item-label" className="min-w-0 flex-1">
						{children}
					</span>
					{!!badge && (
						<>
							{' '}
							<span
								data-slot="sidebar-item-badge"
								className={'font-mono text-xs text-muted'}
							>
								{badge}
							</span>
						</>
					)}
				</>
			),
		}
		return (
			<li data-slot="sidebar-item-root" className="m-0 box-border list-none p-0">
				{render ? render(renderedProps) : <a {...renderedProps} />}
			</li>
		)
	},
)
