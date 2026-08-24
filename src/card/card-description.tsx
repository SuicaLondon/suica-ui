import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'

export const CardDescription = forwardRef<
	HTMLParagraphElement,
	ComponentPropsWithoutRef<'p'>
>(function CardDescription({ className, ...paragraphProps }, ref) {
	return (
		<p
			ref={ref}
			data-slot="card-description"
			className={cn('sui:m-0 sui:text-sm sui:leading-5 sui:text-muted', className)}
			{...paragraphProps}
		/>
	)
})
