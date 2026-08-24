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
					'sui:relative sui:w-full sui:box-border sui:overflow-auto sui:rounded-panel sui:focus-visible:outline-2 sui:focus-visible:outline-focus sui:focus-visible:outline-offset-2',
					className,
				)}
				{...divProps}
			/>
		)
	},
)
