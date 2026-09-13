import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'

export type InputProps = ComponentPropsWithoutRef<'input'>

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
	{ className, ...inputProps },
	ref,
) {
	return (
		<input
			ref={ref}
			data-slot="input"
			className={cn(
				'border-control-line bg-transparent text-foreground',
				'placeholder:text-muted focus-visible:border-focus',
				'focus-visible:ring-focus/20 aria-invalid:border-danger',
				'aria-invalid:ring-danger/20 aria-[invalid=grammar]:border-danger',
				'aria-[invalid=grammar]:ring-danger/20',
				'aria-[invalid=spelling]:border-danger',
				'flex h-9 w-full aria-[invalid=spelling]:ring-danger/20',
				'box-border rounded-control border px-3 py-1 text-base',
				'transition-colors outline-none file:mr-3 file:border-0',
				'file:bg-transparent file:text-sm file:font-medium',
				'file:text-foreground disabled:cursor-not-allowed disabled:opacity-50',
				'focus-visible:ring-1 md:text-sm',
				'font-sans',
				className,
			)}
			{...inputProps}
		/>
	)
})
