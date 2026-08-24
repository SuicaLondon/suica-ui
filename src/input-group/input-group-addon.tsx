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
				'sui:text-muted sui:inline-flex sui:box-border sui:shrink-0 sui:items-center sui:justify-center sui:pl-3 sui:text-sm',
				className,
			)}
			{...addonProps}
		/>
	)
})
