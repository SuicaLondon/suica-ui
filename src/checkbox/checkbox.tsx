import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'
import { CheckboxIndicatorIcon } from './checkbox-indicator-icon.js'

export type CheckboxProps = Omit<ComponentPropsWithoutRef<'input'>, 'type'>

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
	function Checkbox({ className, ...checkboxProps }, ref) {
		return (
			<span
				data-slot="checkbox-root"
				className="inline-grid shrink-0 align-middle"
			>
				<input
					ref={ref}
					type="checkbox"
					data-slot="checkbox"
					className={cn(
						'border-accent bg-transparent checked:bg-accent',
						'checked:text-surface-elevated focus-visible:ring-focus',
						'peer aria-invalid:border-danger aria-invalid:ring-danger/20',
						'col-start-1 row-start-1 m-0 box-border size-4 shrink-0',
						'appearance-none rounded-sm border transition-colors',
						'outline-none disabled:cursor-not-allowed disabled:opacity-50',
						'focus-visible:ring-1',
						className,
					)}
					{...checkboxProps}
				/>
				<CheckboxIndicatorIcon />
			</span>
		)
	},
)
