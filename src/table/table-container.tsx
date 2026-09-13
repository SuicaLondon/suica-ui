import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'

type TableContainerAccessibleName =
	| { 'aria-label': string; 'aria-labelledby'?: string }
	| { 'aria-label'?: string; 'aria-labelledby': string }

export type TableContainerProps = Omit<
	ComponentPropsWithoutRef<'div'>,
	'aria-label' | 'aria-labelledby'
> &
	TableContainerAccessibleName

export const TableContainer = forwardRef<HTMLDivElement, TableContainerProps>(
	function TableContainer(
		{
			className,
			role = 'region',
			tabIndex = 0,
			'aria-label': ariaLabel,
			'aria-labelledby': ariaLabelledBy,
			...divProps
		},
		ref,
	) {
		return (
			<div
				ref={ref}
				data-slot="table-container"
				role={role}
				tabIndex={tabIndex}
				aria-label={ariaLabel}
				aria-labelledby={ariaLabelledBy}
				className={cn(
					'relative box-border w-full overflow-auto rounded-panel',
					'focus-visible:outline-2 focus-visible:outline-focus',
					'focus-visible:outline-offset-2',
					className,
				)}
				{...divProps}
			/>
		)
	},
)
