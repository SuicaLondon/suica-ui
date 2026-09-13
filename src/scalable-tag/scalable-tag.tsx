import {
	forwardRef,
	type ComponentPropsWithoutRef,
	type ComponentPropsWithRef,
	type ReactElement,
	type ReactNode,
} from 'react'
import { cn } from '../cn.js'

export type ScalableTagRenderProps = ComponentPropsWithRef<'a'> & {
	'data-slot'?: string
}

export interface ScalableTagProps extends Omit<
	ComponentPropsWithoutRef<'a'>,
	'prefix'
> {
	/** Controls the font size and displayed count. */
	count: number
	/** Decorative content before the label. Pass null to hide it. */
	prefix?: ReactNode
	prefixClassName?: string
	/** Return one anchor and forward all supplied props when using a router. */
	render?: (props: ScalableTagRenderProps) => ReactElement
}

function tagSize(count: number): string {
	if (count >= 8) return 'text-4xl font-bold text-foreground max-md:text-3xl'
	if (count >= 5) return 'text-3xl font-bold text-foreground max-md:text-2xl'
	if (count >= 3) return 'text-2xl font-semibold text-foreground max-md:text-xl'
	if (count >= 2) return 'text-xl font-medium max-md:text-lg'
	return 'text-base font-normal text-muted max-md:text-sm'
}

export const ScalableTag = forwardRef<HTMLAnchorElement, ScalableTagProps>(
	function ScalableTag(
		{
			count,
			prefix = '#',
			prefixClassName,
			render,
			children,
			className,
			...props
		},
		ref,
	) {
		const anchorProps: ScalableTagRenderProps = {
			ref,
			'data-slot': 'scalable-tag',
			className: cn(
				'inline-flex items-start gap-1.5 whitespace-nowrap',
				'tracking-tag text-foreground no-underline',
				'transition-colors duration-200 hover:text-accent',
				'focus-visible:outline-1 focus-visible:outline-offset-6',
				'focus-visible:outline-focus motion-reduce:transition-none',
				'font-sans',
				tagSize(count),
				'leading-compact',
				className,
			),
			...props,
			children: (
				<>
					{prefix != null && prefix !== false && (
						<span
							data-slot="scalable-tag-prefix"
							aria-hidden="true"
							className={cn(
								'tag-prefix-offset text-xs font-medium tracking-normal',
								'font-mono text-accent',
								prefixClassName,
							)}
						>
							{prefix}
						</span>
					)}
					<span data-slot="scalable-tag-label">{children}</span>
					<span className="sr-only">: </span>
					<sup
						data-slot="scalable-tag-count"
						className={cn(
							'tag-count-offset text-xs font-normal tracking-normal',
							'font-mono text-muted',
						)}
					>
						{count}
					</sup>
				</>
			),
		}
		return render ? render(anchorProps) : <a {...anchorProps} />
	},
)
