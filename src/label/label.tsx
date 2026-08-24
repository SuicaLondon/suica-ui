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
				'sui:text-foreground sui:text-sm sui:leading-none sui:font-medium sui:peer-disabled:cursor-not-allowed sui:peer-disabled:opacity-70 sui:data-[disabled=true]:cursor-not-allowed sui:data-[disabled=true]:opacity-50 sui:font-[family-name:var(--sui-theme-font-sans)]',
				className,
			)}
			{...labelProps}
		/>
	)
})
