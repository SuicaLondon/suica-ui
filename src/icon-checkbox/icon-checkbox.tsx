import {
	forwardRef,
	type ComponentPropsWithoutRef,
	type ReactNode,
} from 'react'
import { cn } from '../cn.js'

export interface IconCheckboxProps extends Omit<
	ComponentPropsWithoutRef<'input'>,
	'className' | 'type'
> {
	checkedIcon: ReactNode
	uncheckedIcon: ReactNode
	startLabel?: ReactNode
	endLabel?: ReactNode
	className?: string
	iconClassName?: string
}

export const IconCheckbox = forwardRef<HTMLInputElement, IconCheckboxProps>(
	function IconCheckbox(
		{
			checkedIcon,
			uncheckedIcon,
			startLabel,
			endLabel,
			className,
			iconClassName,
			disabled,
			...inputProps
		},
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
				{startLabel}
				<span
					className={'relative inline-flex size-5.5 items-center justify-center'}
				>
					<input
						ref={ref}
						type="checkbox"
						className="peer sr-only"
						disabled={disabled}
						{...inputProps}
					/>
					<span
						className={cn(
							'inline-flex size-full items-center justify-center rounded-sm',
							'transition-transform peer-checked:hidden',
							'peer-focus-visible:outline-2 peer-focus-visible:outline-focus',
							'peer-focus-visible:outline-offset-2',
							iconClassName,
						)}
						aria-hidden="true"
					>
						{uncheckedIcon}
					</span>
					<span
						className={cn(
							'hidden size-full items-center justify-center rounded-sm',
							'transition-transform peer-checked:inline-flex',
							'peer-focus-visible:outline-2 peer-focus-visible:outline-focus',
							'peer-focus-visible:outline-offset-2',
							iconClassName,
						)}
						aria-hidden="true"
					>
						{checkedIcon}
					</span>
				</span>
				{endLabel}
			</label>
		)
	},
)
