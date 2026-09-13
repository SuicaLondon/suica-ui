'use client'

import {
	forwardRef,
	type ComponentPropsWithoutRef,
	type ReactNode,
} from 'react'
import { Button } from '../button/button.js'
import { cn } from '../cn.js'
import { Select } from '../select/select.js'
import { ChevronLeftIcon } from './chevron-left-icon.js'
import { ChevronRightIcon } from './chevron-right-icon.js'

export interface TablePagination {
	page: number
	pageSize: number
	total: number
	totalPages: number
}

export interface TablePaginationChange {
	page: number
	pageSize: number
}

export type TableControlProps = Omit<
	ComponentPropsWithoutRef<'div'>,
	'aria-label' | 'children'
> & {
	'aria-label': string
	actions?: ReactNode
	busy?: boolean
	itemLabel: string
	onPaginationChange: (next: TablePaginationChange) => void
	pageSizeOptions?: readonly number[]
	pagination: Readonly<TablePagination>
}

function sentenceCase(value: string) {
	return value.replace(/^./u, (firstCharacter) => firstCharacter.toUpperCase())
}

export const TableControl = forwardRef<HTMLDivElement, TableControlProps>(
	function TableControl(
		{
			'aria-label': ariaLabel,
			actions,
			busy = false,
			className,
			itemLabel,
			onPaginationChange,
			pageSizeOptions,
			pagination,
			...divProps
		},
		ref,
	) {
		const hasPageSizeOptions = Boolean(pageSizeOptions?.length)

		return (
			<div
				ref={ref}
				data-slot="table-control"
				aria-busy={busy}
				className={cn(
					'box-border flex min-h-12 w-full min-w-0 flex-col gap-2',
					'rounded-panel border border-line bg-surface-elevated p-2',
					'font-sans text-foreground sm:flex-row sm:flex-wrap',
					'sm:items-center sm:justify-between',
					className,
				)}
				{...divProps}
			>
				<p
					data-slot="table-control-summary"
					aria-live="polite"
					aria-atomic="true"
					className="m-0 min-w-0 text-sm text-muted"
				>
					Page <span className="font-medium text-foreground">{pagination.page}</span>{' '}
					of {pagination.totalPages} · {pagination.total.toLocaleString()}{' '}
					{itemLabel}
				</p>
				<div
					data-slot="table-control-actions"
					className={cn(
						'flex w-full min-w-0 flex-wrap items-center',
						'gap-2 sm:w-auto sm:shrink-0',
					)}
				>
					{hasPageSizeOptions && (
						<Select
							aria-label={`${sentenceCase(itemLabel)} per page`}
							value={pagination.pageSize}
							disabled={busy}
							className="h-8 w-26 max-w-full shrink-0"
							onChange={(event) => {
								onPaginationChange({
									page: 1,
									pageSize: Number(event.currentTarget.value),
								})
							}}
						>
							{pageSizeOptions?.map((pageSize) => (
								<option key={pageSize} value={pageSize}>
									{pageSize} / page
								</option>
							))}
						</Select>
					)}
					<nav aria-label={ariaLabel} className="flex shrink-0 items-center gap-2">
						<Button
							variant="outline"
							size="xs"
							aria-label="Previous page"
							disabled={busy || pagination.page <= 1}
							onClick={() => {
								onPaginationChange({
									page: pagination.page - 1,
									pageSize: pagination.pageSize,
								})
							}}
						>
							<ChevronLeftIcon />
							<span className="hidden sm:inline">Previous</span>
						</Button>
						<Button
							variant="outline"
							size="xs"
							aria-label="Next page"
							disabled={busy || pagination.page >= pagination.totalPages}
							onClick={() => {
								onPaginationChange({
									page: pagination.page + 1,
									pageSize: pagination.pageSize,
								})
							}}
						>
							<span className="hidden sm:inline">Next</span>
							<ChevronRightIcon />
						</Button>
					</nav>
					{actions}
				</div>
			</div>
		)
	},
)
