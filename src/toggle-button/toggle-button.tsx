import {
	forwardRef,
	type ComponentPropsWithoutRef,
	type ReactNode,
} from 'react'
import { cn } from '../cn.js'

export interface SwitchProps extends Omit<
	ComponentPropsWithoutRef<'input'>,
	'className' | 'type'
> {
	label?: ReactNode
	className?: string
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
	{ label, className, disabled, ...inputProps },
	ref,
) {
	return (
		<label
			className={cn(
				'inline-flex items-center gap-2 text-sm text-foreground',
				{
					'cursor-not-allowed opacity-50': disabled,
					'cursor-pointer': !disabled,
				},
				className,
			)}
		>
			{label}
			<input
				ref={ref}
				type="checkbox"
				role="switch"
				className="peer sr-only"
				disabled={disabled}
				{...inputProps}
			/>
			<span
				className={cn(
					'relative h-6 w-11 shrink-0 rounded-full bg-line-strong',
					'transition-colors peer-checked:bg-accent',
					'peer-focus-visible:outline-2 peer-focus-visible:outline-focus',
					'peer-focus-visible:outline-offset-2 after:absolute after:start-0.5',
					'after:top-0.5 after:size-5 after:rounded-full',
					'after:bg-surface-elevated after:transition-transform',
					'after:content-empty peer-checked:after:translate-x-5',
				)}
				aria-hidden="true"
			/>
		</label>
	)
})
