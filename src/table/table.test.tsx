import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableContainer,
	TableControl,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from './index'

describe('Table', () => {
	it('renders the Blog dashboard table density with native semantics', () => {
		const tableRef = createRef<HTMLTableElement>()
		render(
			<Table ref={tableRef} aria-label="Posts">
				<TableCaption>Recent dashboard posts</TableCaption>
				<TableHeader>
					<TableRow data-testid="header-row">
						<TableHead>Title</TableHead>
						<TableHead>
							<input type="checkbox" aria-label="Select all posts" />
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell>Spring update</TableCell>
						<TableCell>
							<input type="checkbox" aria-label="Select Spring update" />
						</TableCell>
					</TableRow>
				</TableBody>
				<TableFooter>
					<TableRow>
						<TableCell colSpan={2}>1 post</TableCell>
					</TableRow>
				</TableFooter>
			</Table>,
		)

		const table = screen.getByRole('table', { name: 'Posts' })
		expect(tableRef.current).toBe(table)
		expect(table.parentElement).not.toHaveAttribute(
			'data-slot',
			'table-container',
		)
		expect(screen.getAllByRole('columnheader')).toHaveLength(2)
		const titleHead = screen.getByRole('columnheader', { name: 'Title' })
		expect(titleHead).toHaveAttribute('scope', 'col')
		expect(titleHead).toHaveClass('sui:px-2', 'sui:font-medium', 'sui:text-muted')
		expect(titleHead).not.toHaveClass(
			'sui:text-xs',
			'sui:uppercase',
			'sui:[font-family:var(--sui-theme-font-mono)]',
		)
		expect(screen.getByTestId('header-row')).toHaveClass('sui:hover:bg-hover')
		expect(screen.getAllByRole('columnheader')[1]).toHaveClass(
			'sui:[&>[role=checkbox]]:translate-y-[2px]',
		)
		expect(screen.getByRole('cell', { name: 'Spring update' })).toHaveClass(
			'sui:p-2',
		)
		expect(screen.getAllByRole('cell')[1]).toHaveClass(
			'sui:[&>[role=checkbox]]:translate-y-[2px]',
		)
		expect(screen.getByRole('caption')).toHaveTextContent(
			'Recent dashboard posts',
		)
		expect(screen.getByRole('caption')).toHaveClass('sui:mt-4')
	})

	it('offers an explicit overflow container and forwards primitive refs', () => {
		const containerRef = createRef<HTMLDivElement>()
		const tableRef = createRef<HTMLTableElement>()
		const rowRef = createRef<HTMLTableRowElement>()
		render(
			<TableContainer
				ref={containerRef}
				aria-label="Scrollable selected posts"
				data-testid="table-container"
			>
				<Table ref={tableRef}>
					<TableBody>
						<TableRow ref={rowRef} data-state="selected">
							<TableCell>Selected post</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>,
		)

		expect(containerRef.current).toBe(screen.getByTestId('table-container'))
		expect(containerRef.current).toHaveAttribute('role', 'region')
		expect(containerRef.current).toHaveAttribute('tabindex', '0')
		expect(tableRef.current).toBe(screen.getByRole('table'))
		expect(rowRef.current).toHaveAttribute('data-state', 'selected')
		expect(rowRef.current).toHaveClass(
			'sui:hover:bg-hover',
			'sui:data-[state=selected]:bg-hover',
		)
		expect(containerRef.current).toHaveClass(
			'sui:overflow-auto',
			'sui:rounded-panel',
		)
	})

	it('accepts an aria-labelledby container name and a custom tab stop', () => {
		render(
			<>
				<h2 id="results-title">Results</h2>
				<TableContainer aria-labelledby="results-title" tabIndex={-1}>
					<Table />
				</TableContainer>
			</>,
		)

		const container = screen.getByRole('region', { name: 'Results' })
		expect(container).toHaveAttribute('tabindex', '-1')
	})

	it('renders and operates the Blog dashboard pagination footer', async () => {
		const user = userEvent.setup()
		const onPaginationChange = vi.fn()
		const controlRef = createRef<HTMLDivElement>()

		render(
			<TableControl
				ref={controlRef}
				aria-label="Viewer pages"
				itemLabel="viewers"
				pagination={{ page: 2, pageSize: 25, total: 135, totalPages: 6 }}
				pageSizeOptions={[10, 25, 50, 100]}
				onPaginationChange={onPaginationChange}
				className="custom-control"
				data-testid="table-control"
				actions={<button type="button">Refresh locations</button>}
			/>,
		)

		const control = screen.getByTestId('table-control')
		expect(controlRef.current).toBe(control)
		expect(control).toHaveClass(
			'custom-control',
			'sui:min-h-12',
			'sui:min-w-0',
			'sui:rounded-panel',
			'sui:bg-surface-elevated',
			'sui:p-2',
			'sui:gap-2',
			'sui:sm:flex-wrap',
		)
		expect(control).not.toHaveClass('sui:min-h-16', 'sui:p-3', 'sui:gap-3')
		expect(control).toHaveAttribute('aria-busy', 'false')
		const summary = control.querySelector('[data-slot="table-control-summary"]')
		expect(summary).toHaveTextContent('Page 2 of 6 · 135 viewers')
		expect(summary).toHaveAttribute('aria-live', 'polite')
		expect(summary).toHaveClass('sui:min-w-0')
		expect(
			control.querySelector('[data-slot="table-control-actions"]'),
		).toHaveClass(
			'sui:w-full',
			'sui:min-w-0',
			'sui:max-w-full',
			'sui:flex-wrap',
			'sui:sm:w-auto',
		)
		expect(screen.getByRole('navigation', { name: 'Viewer pages' })).toBeVisible()
		expect(
			screen.getByRole('combobox', { name: 'Viewers per page' }),
		).toHaveValue('25')
		expect(
			screen.getByRole('button', { name: 'Refresh locations' }),
		).toBeVisible()
		expect(screen.getByRole('button', { name: 'Previous page' })).toHaveAttribute(
			'data-variant',
			'outline',
		)
		expect(screen.getByRole('button', { name: 'Next page' })).toHaveAttribute(
			'data-size',
			'xs',
		)

		await user.click(screen.getByRole('button', { name: 'Previous page' }))
		expect(onPaginationChange).toHaveBeenLastCalledWith({
			page: 1,
			pageSize: 25,
		})

		await user.click(screen.getByRole('button', { name: 'Next page' }))
		expect(onPaginationChange).toHaveBeenLastCalledWith({
			page: 3,
			pageSize: 25,
		})

		await user.selectOptions(
			screen.getByRole('combobox', { name: 'Viewers per page' }),
			'50',
		)
		expect(onPaginationChange).toHaveBeenLastCalledWith({
			page: 1,
			pageSize: 50,
		})
	})

	it('supports pagination without a page-size selector and disables busy boundaries', () => {
		const onPaginationChange = vi.fn()
		render(
			<TableControl
				aria-label="Post pages"
				itemLabel="posts"
				pagination={{ page: 1, pageSize: 20, total: 0, totalPages: 1 }}
				busy
				onPaginationChange={onPaginationChange}
			/>,
		)

		expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
		const summary = document.querySelector('[data-slot="table-control-summary"]')
		expect(summary).toHaveTextContent('Page 1 of 1 · 0 posts')
		expect(summary).toHaveAttribute('aria-atomic', 'true')
		expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
		expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
		expect(summary?.parentElement).toHaveAttribute('aria-busy', 'true')
	})
})
