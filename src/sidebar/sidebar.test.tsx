import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { Sidebar, SidebarItem, SidebarItems, SidebarTrigger } from './index'

function SidebarHarness() {
	const [open, setOpen] = useState(false)

	return (
		<>
			<SidebarTrigger
				open={open}
				onOpenChange={setOpen}
				label="Toggle navigation"
			/>
			<Sidebar
				open={open}
				onOpenChange={setOpen}
				label="Primary navigation"
				closeLabel="Close navigation"
			>
				<SidebarItems label="Main menu">
					<SidebarItem href="/projects">Projects</SidebarItem>
				</SidebarItems>
			</Sidebar>
		</>
	)
}

describe('Sidebar', () => {
	it('coordinates trigger, backdrop, and hidden state through the public API', async () => {
		const user = userEvent.setup()

		render(<SidebarHarness />)

		const trigger = screen.getByRole('button', { name: 'Toggle navigation' })
		const sidebar = document.getElementById('suica-sidebar')
		if (!(sidebar instanceof HTMLElement)) {
			throw new Error('Expected the sidebar to render')
		}

		expect(trigger).toHaveAttribute('aria-expanded', 'false')
		expect(trigger).toHaveAttribute('aria-controls', 'suica-sidebar')
		expect(trigger).toHaveAttribute('data-slot', 'sidebar-trigger')
		expect(trigger).toHaveClass('sui:appearance-none', 'sui:size-11')
		expect(sidebar).toHaveAttribute('data-slot', 'sidebar')
		expect(sidebar).toHaveClass('sui:data-[state=open]:translate-x-0')
		expect(sidebar).toHaveAttribute('aria-hidden', 'true')
		expect(sidebar).toHaveAttribute('inert')
		expect(screen.queryByRole('button', { name: 'Close navigation' })).toBeNull()

		await user.click(trigger)

		expect(trigger).toHaveAttribute('aria-expanded', 'true')
		expect(trigger.querySelector('svg')).toHaveAttribute(
			'data-slot',
			'sidebar-trigger-icon',
		)
		expect(trigger.querySelector('svg')).toHaveAttribute('viewBox', '0 0 24 24')
		expect(trigger.querySelector('path')).toHaveAttribute(
			'd',
			'M5 5L19 19M19 5L5 19',
		)
		expect(sidebar).toHaveAttribute('aria-hidden', 'false')
		expect(sidebar).toHaveAttribute('aria-modal', 'true')
		expect(sidebar).not.toHaveAttribute('inert')
		expect(screen.getByRole('dialog', { name: 'Primary navigation' })).toBe(
			sidebar,
		)
		expect(screen.getByRole('link', { name: 'Projects' })).toHaveFocus()
		expect(document.body).toHaveStyle({ overflow: 'hidden' })

		await user.click(screen.getByRole('button', { name: 'Close navigation' }))

		expect(trigger).toHaveAttribute('aria-expanded', 'false')
		expect(sidebar).toHaveAttribute('aria-hidden', 'true')
		expect(trigger).toHaveFocus()
		expect(document.body.style.overflow).toBe('')
	})

	it('requests closure on Escape only while open', async () => {
		const user = userEvent.setup()
		const onOpenChange = vi.fn()
		const { rerender } = render(
			<Sidebar
				open={false}
				onOpenChange={onOpenChange}
				label="Menu"
				closeLabel="Close menu"
			/>,
		)

		await user.keyboard('{Escape}')
		expect(onOpenChange).not.toHaveBeenCalled()

		rerender(
			<Sidebar
				open
				onOpenChange={onOpenChange}
				label="Menu"
				closeLabel="Close menu"
			/>,
		)
		await user.keyboard('{Escape}')

		expect(onOpenChange).toHaveBeenCalledWith(false)
	})

	it('renders labelled navigation and forwards native anchor and element props', () => {
		const navRef = createRef<HTMLElement>()
		const itemRef = createRef<HTMLAnchorElement>()

		render(
			<SidebarItems ref={navRef} label="Account" data-testid="account-nav">
				<SidebarItem
					ref={itemRef}
					href="/profile"
					icon={<span>avatar</span>}
					badge={<span>3 new</span>}
					target="_blank"
				>
					Profile
				</SidebarItem>
			</SidebarItems>,
		)

		const nav = screen.getByRole('navigation', { name: 'Account' })
		const item = screen.getByRole('link', { name: 'Profile 3 new' })
		expect(navRef.current).toBe(nav)
		expect(nav).toBe(screen.getByTestId('account-nav'))
		expect(itemRef.current).toBe(item)
		expect(item).toHaveAttribute('href', '/profile')
		expect(item).toHaveAttribute('target', '_blank')
		expect(nav).toHaveAttribute('data-slot', 'sidebar-nav')
		expect(nav).toHaveClass('sui:pt-[4.5rem]')
		expect(nav.querySelector('ul')).toHaveAttribute('data-slot', 'sidebar-list')
		expect(item).toHaveAttribute('data-slot', 'sidebar-item')
		expect(item).toHaveClass('sui:no-underline', 'sui:min-h-11')
		expect(screen.getByText('avatar').parentElement).toHaveAttribute(
			'aria-hidden',
			'true',
		)
	})

	it('traps keyboard focus inside the open modal sidebar', async () => {
		const user = userEvent.setup()

		render(
			<Sidebar
				open
				onOpenChange={() => undefined}
				label="Navigation"
				closeLabel="Close navigation"
			>
				<a href="/first">First</a>
				<a href="/last">Last</a>
			</Sidebar>,
		)

		const first = screen.getByRole('link', { name: 'First' })
		const last = screen.getByRole('link', { name: 'Last' })
		expect(first).toHaveFocus()

		last.focus()
		await user.keyboard('{Tab}')
		expect(first).toHaveFocus()

		await user.keyboard('{Shift>}{Tab}{/Shift}')
		expect(last).toHaveFocus()
	})
})
