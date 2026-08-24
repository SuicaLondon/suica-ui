import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
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
		expect(container.firstElementChild).toHaveClass('sui:w-full')
		expect(tablist).toHaveAttribute('data-slot', 'tabs-list')
		expect(tablist).toHaveClass('sui:[&::-webkit-scrollbar]:hidden')
		expect(tablist).toHaveAttribute('aria-orientation', 'horizontal')
		expect(overview).toHaveAttribute('data-slot', 'tabs-trigger')
		expect(overview).toHaveClass('sui:appearance-none', 'sui:border-b-2')
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
		expect(overview).toHaveClass('sui:border-s-2')
		expect(overview).not.toHaveClass('sui:border-b-2')
	})

	it('applies the segmented appearance through variant mappings', () => {
		render(<Tabs tabs={tabs} variant="segmented" aria-label="Editor view" />)

		const tablist = screen.getByRole('tablist', { name: 'Editor view' })
		const overview = screen.getByRole('tab', { name: 'Overview' })

		expect(tablist).toHaveClass('sui:rounded-control', 'sui:bg-hover')
		expect(tablist).not.toHaveClass('sui:border-b')
		expect(overview).toHaveClass(
			'sui:data-[state=active]:bg-surface',
			'sui:rounded-control',
		)
		expect(overview).not.toHaveClass('sui:border-b-2')
	})
})
