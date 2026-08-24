import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'

export type CardTitleLevel = 2 | 3 | 4 | 5 | 6

export interface CardTitleProps extends ComponentPropsWithoutRef<'h3'> {
	level?: CardTitleLevel
}

const cardTitleTagByLevel: Record<
	CardTitleLevel,
	'h2' | 'h3' | 'h4' | 'h5' | 'h6'
> = {
	2: 'h2',
	3: 'h3',
	4: 'h4',
	5: 'h5',
	6: 'h6',
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
	function CardTitle({ className, level = 3, ...headingProps }, ref) {
		const Title = cardTitleTagByLevel[level]

		return (
			<Title
				ref={ref}
				data-slot="card-title"
				data-level={level}
				className={cn(
					'sui:m-0 sui:text-base sui:font-semibold sui:leading-none sui:tracking-tight',
					className,
				)}
				{...headingProps}
			/>
		)
	},
)
