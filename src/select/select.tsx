import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'

export type SelectProps = ComponentPropsWithoutRef<'select'>

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
	function Select({ className, ...selectProps }, ref) {
		return (
			<select
				ref={ref}
				data-slot="select"
				className={cn(
					'sui:border-control-line sui:bg-transparent sui:text-foreground sui:focus-visible:border-focus sui:focus-visible:ring-focus/20 sui:aria-invalid:border-danger sui:aria-invalid:ring-danger/20 sui:aria-[invalid=grammar]:border-danger sui:aria-[invalid=grammar]:ring-danger/20 sui:aria-[invalid=spelling]:border-danger sui:aria-[invalid=spelling]:ring-danger/20 sui:flex sui:h-9 sui:w-full sui:box-border sui:rounded-control sui:border sui:px-3 sui:py-1 sui:text-sm sui:shadow-sm sui:transition-[border-color,box-shadow] sui:outline-none sui:disabled:cursor-not-allowed sui:disabled:opacity-50 sui:focus-visible:ring-1 sui:font-[family-name:var(--sui-theme-font-sans)] sui:[color-scheme:var(--sui-theme-color-scheme)]',
					className,
				)}
				{...selectProps}
			/>
		)
	},
)
