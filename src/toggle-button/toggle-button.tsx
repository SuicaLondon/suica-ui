import {
	forwardRef,
	type ComponentPropsWithoutRef,
	type ReactNode,
} from 'react'
import { cn } from '../cn.js'

export interface SwitchProps
	extends Omit<ComponentPropsWithoutRef<'input'>, 'className' | 'type'> {
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
				'sui:text-primary-gray sui:dark:text-white sui:inline-flex sui:items-center sui:gap-2 sui:text-sm',
				{
					'sui:cursor-not-allowed sui:opacity-50': disabled,
					'sui:cursor-pointer': !disabled,
				},
				className,
			)}
		>
			{label}
			<input
				ref={ref}
				type="checkbox"
				role="switch"
				className="sui:peer sui:sr-only"
				disabled={disabled}
				{...inputProps}
			/>
			<span
				className="sui:peer-checked:bg-primary-gray sui:peer-focus-visible:outline-primary-gray sui:dark:peer-focus-visible:outline-white sui:dark:peer-checked:after:bg-primary-gray sui:relative sui:h-6 sui:w-11 sui:shrink-0 sui:rounded-full sui:bg-gray-300 sui:transition-colors sui:peer-focus-visible:outline-2 sui:peer-focus-visible:outline-offset-2 sui:after:absolute sui:after:start-0.5 sui:after:top-0.5 sui:after:size-5 sui:after:rounded-full sui:after:bg-white sui:after:shadow-sm sui:after:transition-transform sui:after:content-[''] sui:peer-checked:after:translate-x-5 sui:dark:bg-gray-600 sui:dark:peer-checked:bg-white"
				aria-hidden="true"
			/>
		</label>
	)
})
