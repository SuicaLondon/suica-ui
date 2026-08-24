import {
	forwardRef,
	type ComponentPropsWithoutRef,
	type ReactNode,
} from 'react'
import { cn } from '../../cn.js'

export interface SidebarItemProps extends ComponentPropsWithoutRef<'a'> {
	icon?: ReactNode
	badge?: ReactNode
}

export const SidebarItem = forwardRef<HTMLAnchorElement, SidebarItemProps>(
	function SidebarItem(
		{ icon, badge, children, className, ...anchorProps },
		ref,
	) {
		return (
			<li
				data-slot="sidebar-item-root"
				className="sui:m-0 sui:box-border sui:list-none sui:p-0"
			>
				<a
					ref={ref}
					data-slot="sidebar-item"
					className={cn(
						'sui:flex sui:min-h-11 sui:items-center sui:gap-3 sui:box-border sui:touch-manipulation sui:rounded-control sui:border sui:border-transparent sui:bg-transparent sui:px-3 sui:py-2.5 sui:text-foreground sui:no-underline sui:transition-[border-color,background-color,color] sui:duration-150 sui:ease-[ease] sui:font-medium sui:leading-[1.25] sui:hover:border-line-strong sui:hover:bg-hover sui:hover:text-accent sui:focus-visible:outline-2 sui:focus-visible:outline-focus sui:focus-visible:outline-offset-2 sui:aria-[current=page]:border-line-strong sui:aria-[current=page]:bg-hover sui:aria-[current=page]:text-accent sui:motion-reduce:transition-none sui:[font:inherit]',
						className,
					)}
					{...anchorProps}
				>
					{icon ? (
						<span
							aria-hidden="true"
							data-slot="sidebar-item-icon"
							className="sui:grid sui:size-5 sui:flex-none sui:place-items-center sui:text-[var(--sui-theme-icon)]"
						>
							{icon}
						</span>
					) : null}
					<span data-slot="sidebar-item-label" className="sui:min-w-0 sui:flex-1">
						{children}
					</span>
					{badge ? (
						<>
							{' '}
							<span
								data-slot="sidebar-item-badge"
								className="sui:text-xs sui:text-muted sui:font-[family-name:var(--sui-theme-font-mono)]"
							>
								{badge}
							</span>
						</>
					) : null}
				</a>
			</li>
		)
	},
)
