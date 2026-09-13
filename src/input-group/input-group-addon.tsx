import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'

export type InputGroupAddonProps = ComponentPropsWithoutRef<'span'>

export const InputGroupAddon = forwardRef<
	HTMLSpanElement,
	InputGroupAddonProps
>(function InputGroupAddon({ className, ...addonProps }, ref) {
	return (
		<span
			ref={ref}
			data-slot="input-group-addon"
			className={cn(
				'box-border inline-flex shrink-0 items-center text-muted',
				'justify-center pl-3 text-sm',
				className,
			)}
			{...addonProps}
		/>
	)
})
