import {
	forwardRef,
	type ComponentPropsWithoutRef,
	type ReactNode,
} from 'react'
import { cn } from '../cn.js'

export interface SectionHeadingProps extends Omit<
	ComponentPropsWithoutRef<'div'>,
	'children' | 'title'
> {
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
					'box-border flex min-w-0 items-center gap-3 px-1',
					'font-sans text-foreground',
					className,
				)}
				{...props}
			>
				<p
					data-slot="section-heading-eyebrow"
					className={
						'm-0 shrink-0 text-eyebrow font-semibold tracking-eyebrow text-muted uppercase'
					}
				>
					{eyebrow}
				</p>
				<h2
					id={titleId}
					data-slot="section-heading-title"
					className="m-0 shrink-0 text-lg font-semibold tracking-tight"
				>
					{title}
				</h2>
				<p
					data-slot="section-heading-description"
					className={
						'm-0 ml-auto hidden min-w-0 truncate text-sm text-muted sm:block'
					}
				>
					{description}
				</p>
			</div>
		)
	},
)
