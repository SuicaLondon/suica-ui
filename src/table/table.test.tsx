import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableContainer,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from './index'
import { TableControl } from './table-control'

describe('Table', () => {
	it('renders native table semantics and accessible checkbox names', () => {
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
		expect(
			screen.getByRole('checkbox', { name: 'Select all posts' }),
		).toBeInTheDocument()
		expect(
			screen.getByRole('checkbox', { name: 'Select Spring update' }),
		).toBeInTheDocument()
		expect(
			screen.getByRole('cell', { name: 'Spring update' }),
		).toBeInTheDocument()
		expect(screen.getByRole('caption')).toHaveTextContent(
			'Recent dashboard posts',
		)
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
		expect(control).toHaveClass('custom-control')
		expect(control).toHaveAttribute('aria-busy', 'false')
		const summary = control.querySelector('[data-slot="table-control-summary"]')
		expect(summary).toHaveTextContent('Page 2 of 6 · 135 viewers')
		expect(summary).toHaveAttribute('aria-live', 'polite')
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
