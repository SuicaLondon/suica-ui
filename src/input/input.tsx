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
				'sui:border-control-line sui:bg-transparent sui:text-foreground sui:placeholder:text-muted sui:focus-visible:border-focus sui:focus-visible:ring-focus/20 sui:aria-invalid:border-danger sui:aria-invalid:ring-danger/20 sui:aria-[invalid=grammar]:border-danger sui:aria-[invalid=grammar]:ring-danger/20 sui:aria-[invalid=spelling]:border-danger sui:aria-[invalid=spelling]:ring-danger/20 sui:flex sui:h-9 sui:w-full sui:box-border sui:rounded-control sui:border sui:px-3 sui:py-1 sui:text-base sui:shadow-sm sui:transition-colors sui:outline-none sui:file:mr-3 sui:file:border-0 sui:file:bg-transparent sui:file:text-sm sui:file:font-medium sui:file:text-foreground sui:disabled:cursor-not-allowed sui:disabled:opacity-50 sui:focus-visible:ring-1 sui:md:text-sm sui:font-[family-name:var(--sui-theme-font-sans)] sui:[color-scheme:var(--sui-theme-color-scheme)]',
				className,
			)}
			{...inputProps}
		/>
	)
})
