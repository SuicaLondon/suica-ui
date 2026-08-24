import {
	forwardRef,
	type ComponentPropsWithoutRef,
	type ReactNode,
} from 'react'
import { cn } from '../cn.js'

export interface SectionHeadingProps
	extends Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'title'> {
	title: ReactNode
	titleId: string
	eyebrow: ReactNode
	description: ReactNode
}

export const SectionHeading = forwardRef<HTMLDivElement, SectionHeadingProps>(
	function SectionHeading(
		{ title, titleId, eyebrow, description, className, ...props },
		ref,
	) {
		return (
			<div
				ref={ref}
				data-slot="section-heading"
				className={cn(
					'sui:flex sui:min-w-0 sui:box-border sui:items-center sui:gap-3 sui:px-1 sui:text-foreground sui:font-[family-name:var(--sui-theme-font-sans)]',
					className,
				)}
				{...props}
			>
				<p
					data-slot="section-heading-eyebrow"
					className="sui:m-0 sui:shrink-0 sui:text-[11px] sui:font-semibold sui:tracking-[0.14em] sui:text-muted sui:uppercase"
				>
					{eyebrow}
				</p>
				<h2
					id={titleId}
					data-slot="section-heading-title"
					className="sui:m-0 sui:shrink-0 sui:text-lg sui:font-semibold sui:tracking-tight"
				>
					{title}
				</h2>
				<p
					data-slot="section-heading-description"
					className="sui:m-0 sui:ml-auto sui:hidden sui:min-w-0 sui:truncate sui:text-sm sui:text-muted sui:sm:block"
				>
					{description}
				</p>
			</div>
		)
	},
)
