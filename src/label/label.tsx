import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'

export type LabelProps = ComponentPropsWithoutRef<'label'>

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
	{ className, ...labelProps },
	ref,
) {
	return (
		<label
			ref={ref}
			data-slot="label"
			className={cn(
				'text-sm leading-none font-medium text-foreground',
				'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
				'data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50',
				'font-sans',
				className,
			)}
			{...labelProps}
		/>
	)
})
