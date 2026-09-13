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
			className={cn('m-0 text-sm leading-5 text-muted', className)}
			{...paragraphProps}
		/>
	)
})
