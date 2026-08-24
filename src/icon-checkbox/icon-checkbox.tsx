import {
	forwardRef,
	type ComponentPropsWithoutRef,
	type ReactNode,
} from 'react'
import { cn } from '../cn.js'

export interface IconCheckboxProps
	extends Omit<ComponentPropsWithoutRef<'input'>, 'className' | 'type'> {
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
					'sui:inline-flex sui:items-center sui:gap-2 sui:text-sm sui:text-foreground',
					{
						'sui:cursor-not-allowed sui:opacity-50': disabled,
						'sui:cursor-pointer': !disabled,
					},
					className,
				)}
			>
				{startLabel}
				<span className="sui:relative sui:inline-flex sui:size-[1.375rem] sui:items-center sui:justify-center">
					<input
						ref={ref}
						type="checkbox"
						className="sui:peer sui:sr-only"
						disabled={disabled}
						{...inputProps}
					/>
					<span
						className={cn(
							'sui:inline-flex sui:size-full sui:items-center sui:justify-center sui:rounded-sm sui:transition-transform sui:peer-checked:hidden sui:peer-focus-visible:outline-2 sui:peer-focus-visible:outline-focus sui:peer-focus-visible:outline-offset-2',
							iconClassName,
						)}
						aria-hidden="true"
					>
						{uncheckedIcon}
					</span>
					<span
						className={cn(
							'sui:hidden sui:size-full sui:items-center sui:justify-center sui:rounded-sm sui:transition-transform sui:peer-checked:inline-flex sui:peer-focus-visible:outline-2 sui:peer-focus-visible:outline-focus sui:peer-focus-visible:outline-offset-2',
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
