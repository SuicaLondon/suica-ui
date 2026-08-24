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
					'sui:border-line sui:bg-surface-elevated sui:text-foreground sui:flex sui:min-h-12 sui:min-w-0 sui:w-full sui:shrink-0 sui:box-border sui:flex-col sui:gap-2 sui:rounded-panel sui:border sui:p-2 sui:shadow-sm sui:sm:flex-row sui:sm:flex-wrap sui:sm:items-center sui:sm:justify-between sui:font-[family-name:var(--sui-theme-font-sans)]',
					className,
				)}
				{...divProps}
			>
				<p
					data-slot="table-control-summary"
					aria-live="polite"
					aria-atomic="true"
					className="sui:m-0 sui:min-w-0 sui:text-sm sui:text-muted"
				>
					Page{' '}
					<span className="sui:font-medium sui:text-foreground">
						{pagination.page}
					</span>{' '}
					of {pagination.totalPages} · {pagination.total.toLocaleString()}{' '}
					{itemLabel}
				</p>
				<div
					data-slot="table-control-actions"
					className="sui:flex sui:w-full sui:min-w-0 sui:max-w-full sui:flex-wrap sui:items-center sui:gap-2 sui:sm:w-auto sui:sm:shrink-0"
				>
					{hasPageSizeOptions && (
						<Select
							aria-label={`${sentenceCase(itemLabel)} per page`}
							value={pagination.pageSize}
							disabled={busy}
							className="sui:h-8 sui:w-[104px] sui:max-w-full sui:shrink-0"
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
					<nav
						aria-label={ariaLabel}
						className="sui:flex sui:shrink-0 sui:items-center sui:gap-2"
					>
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
							<span className="sui:hidden sui:sm:inline">Previous</span>
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
							<span className="sui:hidden sui:sm:inline">Next</span>
							<ChevronRightIcon />
						</Button>
					</nav>
					{actions}
				</div>
			</div>
		)
	},
)
