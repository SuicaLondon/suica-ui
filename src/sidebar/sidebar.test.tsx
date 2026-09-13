import { RouterLink } from '../test/router-link'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { Sidebar, SidebarItem, SidebarItems, SidebarTrigger } from './index'

function SidebarHarness({
	responsive = false,
	desktop = false,
}: {
	responsive?: boolean
	desktop?: boolean
} = {}) {
	const [open, setOpen] = useState(false)

	if (responsive) {
		const navigation = (
			<SidebarItems label="Responsive links" triggerInset={!desktop}>
				<SidebarItem href="/posts">Posts</SidebarItem>
			</SidebarItems>
		)

		return (
			<>
				{desktop ? null : (
					<SidebarTrigger
						open={open}
						onOpenChange={setOpen}
						label="Toggle responsive navigation"
					/>
				)}
				<Sidebar
					open={desktop || open}
					mode={desktop ? 'persistent' : 'modal'}
					onOpenChange={setOpen}
					label="Responsive navigation"
					closeLabel="Close responsive navigation"
				>
					{navigation}
				</Sidebar>
			</>
		)
	}

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
		expect(trigger).toHaveClass('appearance-none', 'size-11')
		expect(sidebar).toHaveAttribute('data-slot', 'sidebar')
		expect(sidebar).toHaveClass('data-[state=open]:translate-x-0')
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
		expect(nav).toHaveClass('pt-18')
		expect(nav.querySelector('ul')).toHaveAttribute('data-slot', 'sidebar-list')
		expect(item).toHaveAttribute('data-slot', 'sidebar-item')
		expect(item).toHaveClass('no-underline', 'min-h-11')
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

	it('supports a persistent dashboard layout without modal side effects', () => {
		render(
			<Sidebar
				open
				mode="persistent"
				onOpenChange={() => undefined}
				label="Dashboard navigation"
				closeLabel="Close navigation"
			>
				<SidebarItems label="Dashboard links" triggerInset={false}>
					<SidebarItem href="/dashboard">Dashboard</SidebarItem>
				</SidebarItems>
			</Sidebar>,
		)

		const sidebar = screen.getByRole('complementary', {
			name: 'Dashboard navigation',
		})
		expect(sidebar).toHaveAttribute('data-mode', 'persistent')
		expect(sidebar).not.toHaveAttribute('aria-modal')
		expect(screen.queryByRole('button', { name: 'Close navigation' })).toBeNull()
		expect(document.body.style.overflow).toBe('')
		expect(screen.getByRole('link', { name: 'Dashboard' })).not.toHaveFocus()
		expect(
			screen.getByRole('navigation', { name: 'Dashboard links' }),
		).toHaveClass('pt-4')
	})

	it('supports one navigation composition across responsive modes', async () => {
		const user = userEvent.setup()
		const { rerender } = render(<SidebarHarness responsive desktop={false} />)
		const mobileSidebar = screen.getByRole('dialog', { hidden: true })
		expect(mobileSidebar).toHaveAttribute('aria-label', 'Responsive navigation')
		expect(mobileSidebar).toHaveAttribute('aria-hidden', 'true')
		const trigger = screen.getByRole('button', {
			name: 'Toggle responsive navigation',
		})

		await user.click(trigger)
		expect(screen.getByRole('link', { name: 'Posts' })).toHaveFocus()
		expect(document.body.style.overflow).toBe('hidden')
		await user.keyboard('{Escape}')
		expect(trigger).toHaveFocus()
		expect(mobileSidebar).toHaveAttribute('aria-hidden', 'true')
		await user.click(trigger)
		await user.click(
			screen.getByRole('button', { name: 'Close responsive navigation' }),
		)
		expect(trigger).toHaveFocus()
		expect(mobileSidebar).toHaveAttribute('aria-hidden', 'true')

		rerender(<SidebarHarness responsive desktop />)

		expect(
			screen.getByRole('complementary', { name: 'Responsive navigation' }),
		).toHaveAttribute('data-mode', 'persistent')
		expect(
			screen.queryByRole('button', { name: 'Toggle responsive navigation' }),
		).toBeNull()
		expect(screen.getAllByRole('link', { name: 'Posts' })).toHaveLength(1)
		expect(document.body.style.overflow).toBe('')
	})
})

it('composes a router link with sidebar content, active styling and refs', async () => {
	const user = userEvent.setup()
	const ref = createRef<HTMLAnchorElement>()
	const navigate = vi.fn()
	const onClick = vi.fn()
	render(
		<SidebarItems label="Routes">
			<SidebarItem
				ref={ref}
				aria-current="page"
				icon={<span>Icon</span>}
				badge="3"
				className="px-5"
				onClick={onClick}
				render={(props) => (
					<RouterLink {...props} href="/en/posts?q=react" navigate={navigate} />
				)}
			>
				Posts
			</SidebarItem>
		</SidebarItems>,
	)
	const link = screen.getByRole('link', { name: 'Posts 3' })
	expect(ref.current).toBe(link)
	expect(link.parentElement?.tagName).toBe('LI')
	expect(link.querySelector('a')).toBeNull()
	expect(link).toHaveAttribute('aria-current', 'page')
	expect(link).toHaveAttribute('data-slot', 'sidebar-item')
	expect(link).toHaveClass(
		'px-5',
		'aria-[current=page]:bg-hover',
		'focus-visible:outline-2',
	)
	expect(screen.getByText('Icon').parentElement).toHaveAttribute(
		'aria-hidden',
		'true',
	)
	await user.tab()
	expect(link).toHaveFocus()
	await user.keyboard('{Enter}')
	expect(onClick).toHaveBeenCalledOnce()
	expect(navigate).toHaveBeenCalledExactlyOnceWith('/en/posts?q=react')
})
