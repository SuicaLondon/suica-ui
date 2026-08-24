import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'
import { CheckboxIndicatorIcon } from './checkbox-indicator-icon.js'

export type CheckboxProps = Omit<ComponentPropsWithoutRef<'input'>, 'type'>

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
	function Checkbox({ className, ...checkboxProps }, ref) {
		return (
			<span
				data-slot="checkbox-root"
				className="sui:inline-grid sui:shrink-0 sui:align-middle"
			>
				<input
					ref={ref}
					type="checkbox"
					data-slot="checkbox"
					className={cn(
						'sui:border-accent sui:bg-transparent sui:checked:bg-accent sui:checked:text-surface-elevated sui:focus-visible:ring-focus sui:aria-invalid:border-danger sui:aria-invalid:ring-danger/20 sui:peer sui:col-start-1 sui:row-start-1 sui:m-0 sui:size-4 sui:box-border sui:shrink-0 sui:appearance-none sui:rounded-sm sui:border sui:shadow-sm sui:transition-colors sui:outline-none sui:disabled:cursor-not-allowed sui:disabled:opacity-50 sui:focus-visible:ring-1 sui:[color-scheme:var(--sui-theme-color-scheme)]',
						className,
					)}
					{...checkboxProps}
				/>
				<CheckboxIndicatorIcon />
			</span>
		)
	},
)
