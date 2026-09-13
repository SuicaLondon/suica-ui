import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, Suspense, startTransition } from 'react'
import { Tabs, type TabItem } from './index'

const tabs: readonly TabItem[] = [
	{ id: 'overview', label: 'Overview', panel: 'Overview content' },
	{
		id: 'disabled',
		label: 'Disabled',
		panel: 'Disabled content',
		disabled: true,
	},
	{ id: 'details', label: 'Details', panel: 'Details content' },
]

describe('Tabs', () => {
	it('does not retain a lazy panel from an abandoned transition', async () => {
		const pending = new Promise<never>(() => {})
		let suspend = true
		const renderPanel = vi.fn()
		function PendingPanel() {
			renderPanel()
			if (suspend) throw pending
			return <div>Abandoned content</div>
		}
		const transitionTabs = [
			{ id: 'a', label: 'A', panel: 'Current content' },
			{ id: 'b', label: 'B', panel: <PendingPanel /> },
		]
		const view = (value: string) => (
			<Suspense fallback="Loading">
				<Tabs tabs={transitionTabs} value={value} mountStrategy="lazy" />
			</Suspense>
		)
		const { rerender } = render(view('a'))
		await act(async () => {
			startTransition(() => rerender(view('b')))
		})
		expect(renderPanel).toHaveBeenCalled()
		expect(screen.getByText('Current content')).toBeVisible()
		suspend = false
		rerender(view('a'))
		expect(screen.queryByText('Abandoned content')).toBeNull()
	})

	it('selects the first enabled tab by default and updates an uncontrolled value', async () => {
		const user = userEvent.setup()
		const onValueChange = vi.fn()

		const { container } = render(
			<Tabs
				tabs={tabs}
				aria-label="Project sections"
				onValueChange={onValueChange}
			/>,
		)

		const overview = screen.getByRole('tab', { name: 'Overview' })
		const details = screen.getByRole('tab', { name: 'Details' })
		const tablist = screen.getByRole('tablist', { name: 'Project sections' })

		expect(container.firstElementChild).toHaveAttribute('data-slot', 'tabs')
		expect(container.firstElementChild).toHaveClass('w-full')
		expect(tablist).toHaveAttribute('data-slot', 'tabs-list')
		expect(tablist).toHaveClass('scrollbar-none')
		expect(tablist).toHaveAttribute('aria-orientation', 'horizontal')
		expect(overview).toHaveAttribute('data-slot', 'tabs-trigger')
		expect(overview).toHaveClass('appearance-none', 'border-b-2')
		expect(overview).toHaveAttribute('aria-selected', 'true')
		expect(screen.getByRole('tabpanel', { name: 'Overview' })).toHaveAttribute(
			'data-slot',
			'tabs-panel',
		)
		expect(screen.getByRole('tabpanel', { name: 'Overview' })).toBeVisible()
		expect(screen.getByText('Details content')).not.toBeVisible()

		await user.click(details)

		expect(onValueChange).toHaveBeenCalledWith('details')
		expect(details).toHaveAttribute('aria-selected', 'true')
		expect(screen.getByRole('tabpanel', { name: 'Details' })).toBeVisible()
	})

	it('keeps controlled selection in the caller while still reporting requests', async () => {
		const user = userEvent.setup()
		const onValueChange = vi.fn()
		const ref = createRef<HTMLDivElement>()
		const { rerender } = render(
			<Tabs
				ref={ref}
				tabs={tabs}
				value="overview"
				onValueChange={onValueChange}
				data-testid="tabs-root"
			/>,
		)

		await user.click(screen.getByRole('tab', { name: 'Details' }))

		expect(onValueChange).toHaveBeenCalledWith('details')
		expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
			'aria-selected',
			'true',
		)
		expect(ref.current).toBe(screen.getByTestId('tabs-root'))

		rerender(
			<Tabs ref={ref} tabs={tabs} value="details" data-testid="tabs-root" />,
		)

		expect(screen.getByRole('tab', { name: 'Details' })).toHaveAttribute(
			'aria-selected',
			'true',
		)
	})

	it('moves focus past disabled tabs and supports manual activation', async () => {
		const user = userEvent.setup()
		const onValueChange = vi.fn()

		render(
			<Tabs
				tabs={tabs}
				defaultValue="overview"
				activationMode="manual"
				onValueChange={onValueChange}
			/>,
		)

		const overview = screen.getByRole('tab', { name: 'Overview' })
		const details = screen.getByRole('tab', { name: 'Details' })
		overview.focus()

		await user.keyboard('{ArrowRight}')

		expect(details).toHaveFocus()
		expect(details).toHaveAttribute('tabindex', '0')
		expect(overview).toHaveAttribute('tabindex', '-1')
		expect(overview).toHaveAttribute('aria-selected', 'true')
		expect(onValueChange).not.toHaveBeenCalled()

		await user.keyboard('{Enter}')

		expect(details).toHaveAttribute('aria-selected', 'true')
		expect(onValueChange).toHaveBeenCalledWith('details')
	})

	it('uses vertical arrow keys and wraps automatic selection', async () => {
		const user = userEvent.setup()

		render(<Tabs tabs={tabs} orientation="vertical" aria-label="Sections" />)

		const overview = screen.getByRole('tab', { name: 'Overview' })
		const details = screen.getByRole('tab', { name: 'Details' })
		overview.focus()

		await user.keyboard('{ArrowUp}')

		expect(details).toHaveFocus()
		expect(details).toHaveAttribute('aria-selected', 'true')
		expect(screen.getByRole('tablist', { name: 'Sections' })).toHaveAttribute(
			'aria-orientation',
			'vertical',
		)
		expect(overview).toHaveClass('border-s-2')
		expect(overview).not.toHaveClass('border-b-2')
	})

	it('applies the segmented appearance through variant mappings', () => {
		render(<Tabs tabs={tabs} variant="segmented" aria-label="Editor view" />)

		const tablist = screen.getByRole('tablist', { name: 'Editor view' })
		const overview = screen.getByRole('tab', { name: 'Overview' })

		expect(tablist).toHaveClass('rounded-control', 'bg-hover')
		expect(tablist).not.toHaveClass('border-b')
		expect(overview).toHaveClass(
			'data-[state=active]:bg-surface',
			'rounded-control',
		)
		expect(overview).not.toHaveClass('border-b-2')
	})

	it('keeps inactive panel state mounted by default', async () => {
		const user = userEvent.setup()
		render(
			<Tabs
				aria-label="Editors"
				tabs={[
					{
						id: 'first',
						label: 'First',
						panel: <input aria-label="Draft" />,
					},
					{ id: 'second', label: 'Second', panel: 'Second panel' },
				]}
			/>,
		)

		await user.type(screen.getByRole('textbox', { name: 'Draft' }), 'saved')
		await user.click(screen.getByRole('tab', { name: 'Second' }))
		await user.click(screen.getByRole('tab', { name: 'First' }))

		expect(screen.getByRole('textbox', { name: 'Draft' })).toHaveValue('saved')
	})

	it('unmounts inactive panels when mountStrategy is active', async () => {
		const user = userEvent.setup()
		render(
			<Tabs
				aria-label="Editors"
				mountStrategy="active"
				tabs={[
					{
						id: 'first',
						label: 'First',
						panel: <input aria-label="Draft" />,
					},
					{ id: 'second', label: 'Second', panel: 'Second panel' },
				]}
			/>,
		)

		await user.type(screen.getByRole('textbox', { name: 'Draft' }), 'reset')
		expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute(
			'aria-controls',
		)
		expect(screen.getByRole('tab', { name: 'Second' })).not.toHaveAttribute(
			'aria-controls',
		)
		await user.click(screen.getByRole('tab', { name: 'Second' }))
		expect(screen.queryByRole('textbox', { name: 'Draft' })).toBeNull()
		expect(screen.getByRole('tab', { name: 'First' })).not.toHaveAttribute(
			'aria-controls',
		)
		expect(screen.getByRole('tab', { name: 'Second' })).toHaveAttribute(
			'aria-controls',
		)

		await user.click(screen.getByRole('tab', { name: 'First' }))
		expect(screen.getByRole('textbox', { name: 'Draft' })).toHaveValue('')
	})

	it('mounts visited lazy panels once and preserves their state', async () => {
		const user = userEvent.setup()
		render(
			<Tabs
				aria-label="Lazy editors"
				mountStrategy="lazy"
				tabs={[
					{ id: 'first', label: 'First', panel: 'First panel' },
					{
						id: 'second',
						label: 'Second',
						panel: <input aria-label="Lazy draft" />,
					},
				]}
			/>,
		)

		expect(screen.queryByRole('textbox', { name: 'Lazy draft' })).toBeNull()
		expect(screen.getByRole('tab', { name: 'Second' })).not.toHaveAttribute(
			'aria-controls',
		)
		await user.click(screen.getByRole('tab', { name: 'Second' }))
		await user.type(screen.getByRole('textbox', { name: 'Lazy draft' }), 'saved')
		await user.click(screen.getByRole('tab', { name: 'First' }))

		const preservedDraft = screen.getByRole('textbox', {
			name: 'Lazy draft',
			hidden: true,
		})
		expect(preservedDraft).toHaveValue('saved')
		expect(preservedDraft).not.toBeVisible()
	})

	it('mounts every panel with the always strategy', () => {
		render(<Tabs tabs={tabs} mountStrategy="always" />)
		expect(screen.getByText('Overview content')).toBeInTheDocument()
		expect(screen.getByText('Details content')).toBeInTheDocument()
	})

	it.each(['active', 'lazy', 'always'] as const)(
		'preserves keyboard selection with the %s strategy',
		async (mountStrategy) => {
			const user = userEvent.setup()
			render(<Tabs tabs={tabs} mountStrategy={mountStrategy} />)
			const overview = screen.getByRole('tab', { name: 'Overview' })
			overview.focus()
			await user.keyboard('{ArrowRight}')
			expect(screen.getByRole('tab', { name: 'Details' })).toHaveAttribute(
				'aria-selected',
				'true',
			)
		},
	)
})
