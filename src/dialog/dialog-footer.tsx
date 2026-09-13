import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'

export const DialogFooter = forwardRef<
	HTMLDivElement,
	ComponentPropsWithoutRef<'div'>
>(function DialogFooter({ className, ...props }, ref) {
	return (
		<div
			{...props}
			ref={ref}
			data-slot="dialog-footer"
			className={cn('mt-6 flex justify-end gap-2', className)}
		/>
	)
})
