import { RouterLink } from '../test/router-link'
import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, useState, type MouseEvent } from 'react'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuLink,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from './index'
import { renderToString } from 'react-dom/server'
import { hydrateRoot } from 'react-dom/client'
import { getMenuPosition } from './menu-position'

function DropdownMenuHarness({
	onOpenChange = () => undefined,
}: {
	onOpenChange?: (open: boolean) => void
}) {
	const [open, setOpen] = useState(false)

	return (
		<DropdownMenu
			open={open}
			onOpenChange={(nextOpen) => {
				setOpen(nextOpen)
				onOpenChange(nextOpen)
			}}
		>
			<DropdownMenuTrigger>Account</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Settings</DropdownMenuLabel>
				<DropdownMenuItem>Profile</DropdownMenuItem>
				<DropdownMenuItem disabled>Billing</DropdownMenuItem>
				<DropdownMenuLink href="/logout">Log out</DropdownMenuLink>
				<DropdownMenuSeparator />
				<DropdownMenuItem>Theme</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

describe('DropdownMenu', () => {
	it.each([false, true])(
		'hydrates an initially open menu (controlled: %s)',
		async (controlled) => {
			const menu = (
				<DropdownMenu {...(controlled ? { open: true } : { defaultOpen: true })}>
					<DropdownMenuTrigger>Hydrated menu</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem>Action</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
			const container = document.createElement('div')
			container.innerHTML = renderToString(menu)
			document.body.append(container)
			const onRecoverableError = vi.fn()
			const consoleError = vi.spyOn(console, 'error')
			let root: ReturnType<typeof hydrateRoot> | undefined
			try {
				await act(async () => {
					root = hydrateRoot(container, menu, { onRecoverableError })
				})
				expect(screen.getByRole('menu')).toBeVisible()
				expect(screen.getByRole('menuitem', { name: 'Action' })).toHaveFocus()
				expect(onRecoverableError).not.toHaveBeenCalled()
				expect(consoleError).not.toHaveBeenCalled()
			} finally {
				await act(async () => root?.unmount())
				container.remove()
				consoleError.mockRestore()
			}
		},
	)

	it('restores focus after clicking non-focusable outside content', async () => {
		const user = userEvent.setup()
		render(
			<>
				<DropdownMenuHarness />
				<div>Outside text</div>
			</>,
		)
		const trigger = screen.getByRole('button', { name: 'Account' })
		await user.click(trigger)
		await user.click(screen.getByText('Outside text'))
		expect(screen.queryByRole('menu')).toBeNull()
		expect(trigger).toHaveFocus()
	})

	it('opens from its trigger and exposes the menu relationship', async () => {
		const user = userEvent.setup()
		render(<DropdownMenuHarness />)

		const trigger = screen.getByRole('button', { name: 'Account' })
		expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
		expect(trigger).toHaveAttribute('aria-expanded', 'false')
		expect(screen.queryByRole('menu')).toBeNull()

		await user.click(trigger)

		const menu = screen.getByRole('menu', { name: 'Account' })
		expect(trigger).toHaveAttribute('aria-expanded', 'true')
		expect(trigger).toHaveAttribute('aria-controls', menu.id)
		expect(menu).toHaveAttribute('data-align', 'end')
		expect(screen.getByRole('menuitem', { name: 'Profile' })).toHaveFocus()
	})

	it('supports roving keyboard focus and skips disabled items', async () => {
		const user = userEvent.setup()
		render(<DropdownMenuHarness />)
		const trigger = screen.getByRole('button', { name: 'Account' })
		trigger.focus()

		await user.keyboard('{ArrowUp}')
		expect(screen.getByRole('menuitem', { name: 'Theme' })).toHaveFocus()

		await user.keyboard('{ArrowDown}')
		expect(screen.getByRole('menuitem', { name: 'Profile' })).toHaveFocus()

		await user.keyboard('{ArrowDown}')
		expect(screen.getByRole('menuitem', { name: 'Log out' })).toHaveFocus()

		await user.keyboard('{End}')
		expect(screen.getByRole('menuitem', { name: 'Theme' })).toHaveFocus()
		await user.keyboard('{Home}')
		expect(screen.getByRole('menuitem', { name: 'Profile' })).toHaveFocus()
	})

	it('supports first-character typeahead', async () => {
		const user = userEvent.setup()
		render(<DropdownMenuHarness />)
		await user.click(screen.getByRole('button', { name: 'Account' }))

		await user.keyboard('t')

		expect(screen.getByRole('menuitem', { name: 'Theme' })).toHaveFocus()
	})

	it('opens with Enter and Space from the native trigger', async () => {
		const user = userEvent.setup()
		render(<DropdownMenuHarness />)
		const trigger = screen.getByRole('button', { name: 'Account' })
		trigger.focus()

		await user.keyboard('{Enter}')
		expect(screen.getByRole('menu')).toBeVisible()
		await user.keyboard('{Escape}')

		await user.keyboard(' ')
		expect(screen.getByRole('menu')).toBeVisible()
	})

	it('respects a prevented native trigger click', async () => {
		const user = userEvent.setup()
		render(
			<DropdownMenu>
				<DropdownMenuTrigger onClick={(event) => event.preventDefault()}>
					Prevented
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>Action</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		)

		await user.click(screen.getByRole('button', { name: 'Prevented' }))

		expect(screen.queryByRole('menu')).toBeNull()
	})

	it('closes on selection and restores focus to the trigger', async () => {
		const user = userEvent.setup()
		const onOpenChange = vi.fn()
		render(<DropdownMenuHarness onOpenChange={onOpenChange} />)
		const trigger = screen.getByRole('button', { name: 'Account' })
		await user.click(trigger)

		await user.click(screen.getByRole('menuitem', { name: 'Profile' }))

		expect(screen.queryByRole('menu')).toBeNull()
		expect(trigger).toHaveFocus()
		expect(onOpenChange).toHaveBeenLastCalledWith(false)
	})

	it('closes on Escape and outside interaction', async () => {
		const user = userEvent.setup()
		render(
			<>
				<DropdownMenuHarness />
				<button type="button">Outside</button>
			</>,
		)
		const trigger = screen.getByRole('button', { name: 'Account' })
		await user.click(trigger)
		await user.keyboard('{Escape}')
		expect(screen.queryByRole('menu')).toBeNull()
		expect(trigger).toHaveFocus()

		await user.click(trigger)
		await user.click(screen.getByRole('button', { name: 'Outside' }))
		expect(screen.queryByRole('menu')).toBeNull()
		expect(screen.getByRole('button', { name: 'Outside' })).toHaveFocus()
	})

	it('closes when Tab moves focus outside the menu composition', async () => {
		const user = userEvent.setup()
		render(
			<>
				<DropdownMenuHarness />
				<button type="button">After menu</button>
			</>,
		)
		await user.click(screen.getByRole('button', { name: 'Account' }))

		await user.tab()

		expect(screen.queryByRole('menu')).toBeNull()
		expect(screen.getByRole('button', { name: 'After menu' })).toHaveFocus()
	})

	it('can keep the menu open when selection opts out', async () => {
		const user = userEvent.setup()
		render(
			<DropdownMenu defaultOpen>
				<DropdownMenuTrigger>Filters</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem closeOnSelect={false}>Toggle filter</DropdownMenuItem>
					<DropdownMenuItem disabled>Unavailable</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		)

		await user.click(screen.getByRole('menuitem', { name: 'Toggle filter' }))
		expect(screen.getByRole('menu')).toBeVisible()
		expect(screen.getByRole('menuitem', { name: 'Unavailable' })).toBeDisabled()
	})

	it('uses the latest controlled onOpenChange callback', async () => {
		const user = userEvent.setup()
		const firstCallback = vi.fn()
		const latestCallback = vi.fn()
		const menu = (onOpenChange: (open: boolean) => void) => (
			<DropdownMenu open onOpenChange={onOpenChange}>
				<DropdownMenuTrigger>Controlled</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>Action</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		)
		const { rerender } = render(menu(firstCallback))
		rerender(menu(latestCallback))

		await user.keyboard('{Escape}')

		expect(firstCallback).not.toHaveBeenCalled()
		expect(latestCallback).toHaveBeenCalledWith(false)
	})

	it('forwards native props and refs', async () => {
		const user = userEvent.setup()
		const triggerRef = createRef<HTMLButtonElement>()
		const itemRef = createRef<HTMLButtonElement>()
		const rootRef = createRef<HTMLDivElement>()
		const contentRef = createRef<HTMLDivElement>()
		const linkRef = createRef<HTMLAnchorElement>()
		const onClick = vi.fn()
		render(
			<DropdownMenu ref={rootRef} defaultOpen data-testid="menu-root">
				<DropdownMenuTrigger ref={triggerRef}>Actions</DropdownMenuTrigger>
				<DropdownMenuContent ref={contentRef} data-testid="menu-content">
					<DropdownMenuItem ref={itemRef} onClick={onClick}>
						Archive
					</DropdownMenuItem>
					<DropdownMenuLink ref={linkRef} href="#details">
						Details
					</DropdownMenuLink>
				</DropdownMenuContent>
			</DropdownMenu>,
		)

		expect(triggerRef.current).toBe(
			screen.getByRole('button', { name: 'Actions' }),
		)
		expect(itemRef.current).toBe(
			screen.getByRole('menuitem', { name: 'Archive' }),
		)
		expect(rootRef.current).toBe(screen.getByTestId('menu-root'))
		expect(contentRef.current).toBe(screen.getByTestId('menu-content'))
		expect(linkRef.current).toBe(
			screen.getByRole('menuitem', { name: 'Details' }),
		)
		await user.click(screen.getByRole('menuitem', { name: 'Archive' }))
		expect(onClick).toHaveBeenCalledOnce()
	})

	it('calls onSelect and allows it to prevent closing', async () => {
		const user = userEvent.setup()
		const onSelect = vi.fn((event: MouseEvent) => event.preventDefault())
		render(
			<DropdownMenu defaultOpen>
				<DropdownMenuTrigger>Actions</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem onSelect={onSelect}>Archive</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		)
		await user.click(screen.getByRole('menuitem', { name: 'Archive' }))
		expect(onSelect).toHaveBeenCalledOnce()
		expect(screen.getByRole('menu')).toBeVisible()
	})

	it('selects focused items with Enter and Space', async () => {
		const user = userEvent.setup()
		const onSelect = vi.fn()
		render(
			<DropdownMenu>
				<DropdownMenuTrigger>Keyboard actions</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem onSelect={onSelect}>Archive</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		)
		const trigger = screen.getByRole('button', { name: 'Keyboard actions' })
		trigger.focus()
		await user.keyboard('{ArrowDown}{Enter}')
		expect(onSelect).toHaveBeenCalledOnce()
		expect(screen.queryByRole('menu')).toBeNull()

		trigger.focus()
		await user.keyboard('{ArrowDown} ')
		expect(onSelect).toHaveBeenCalledTimes(2)
	})

	it.each([
		['ltr', 'start', 100],
		['ltr', 'center', 80],
		['ltr', 'end', 60],
		['rtl', 'start', 60],
		['rtl', 'center', 80],
		['rtl', 'end', 100],
	] as const)('positions %s %s alignment', (direction, align, expectedLeft) => {
		const trigger = document.createElement('button')
		trigger.style.direction = direction
		const content = document.createElement('div')
		vi.spyOn(trigger, 'getBoundingClientRect').mockReturnValue({
			bottom: 130,
			height: 30,
			left: 100,
			right: 140,
			top: 100,
			width: 40,
			x: 100,
			y: 100,
			toJSON: () => ({}),
		})
		vi.spyOn(content, 'getBoundingClientRect').mockReturnValue({
			bottom: 60,
			height: 60,
			left: 0,
			right: 80,
			top: 0,
			width: 80,
			x: 0,
			y: 0,
			toJSON: () => ({}),
		})
		const position = getMenuPosition(trigger, content, 'bottom', align, 8)
		expect(position).toMatchObject({ left: expectedLeft, side: 'bottom' })
	})

	it('supports a consumer-provided trigger without nested buttons', async () => {
		const user = userEvent.setup()
		render(
			<DropdownMenu>
				<DropdownMenuTrigger
					render={(props) => <button {...props}>Custom account</button>}
				/>
				<DropdownMenuContent>
					<DropdownMenuItem>Profile</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		)
		expect(screen.getAllByRole('button')).toHaveLength(1)
		await user.click(screen.getByRole('button', { name: 'Custom account' }))
		expect(screen.getByRole('menu')).toBeVisible()
	})

	it('portals, flips, and clamps content at viewport edges', async () => {
		const user = userEvent.setup()
		vi
			.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
			.mockImplementation(function (this: HTMLElement) {
				const isContent = this.dataset.slot === 'dropdown-menu-content'
				return {
					bottom: isContent ? 120 : 595,
					height: isContent ? 120 : 30,
					left: isContent ? 0 : 780,
					right: isContent ? 240 : 820,
					top: isContent ? 0 : 565,
					width: isContent ? 240 : 40,
					x: isContent ? 0 : 780,
					y: isContent ? 0 : 565,
					toJSON: () => ({}),
				}
			})
		Object.defineProperty(window, 'innerWidth', {
			configurable: true,
			value: 800,
		})
		Object.defineProperty(window, 'innerHeight', {
			configurable: true,
			value: 600,
		})
		render(
			<div dir="rtl">
				<DropdownMenu>
					<DropdownMenuTrigger>Edge</DropdownMenuTrigger>
					<DropdownMenuContent side="bottom" align="start">
						<DropdownMenuItem>Action</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>,
		)
		await user.click(screen.getByRole('button', { name: 'Edge' }))
		const menu = screen.getByRole('menu')
		expect(menu.parentElement).toBe(document.body)
		expect(menu).toHaveAttribute('data-side', 'top')
		expect(Number.parseFloat(menu.style.left)).toBeGreaterThanOrEqual(8)
		expect(Number.parseFloat(menu.style.left)).toBeLessThanOrEqual(552)
	})
})

describe('DropdownMenuLink render', () => {
	it('preserves keyboard selection, refs and router navigation', async () => {
		const user = userEvent.setup()
		const ref = createRef<HTMLAnchorElement>()
		const navigate = vi.fn()
		render(
			<DropdownMenu>
				<DropdownMenuTrigger>Routes</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLink
						ref={ref}
						className="px-5"
						render={(props) => (
							<RouterLink {...props} href="/en/posts?q=react" navigate={navigate} />
						)}
					>
						Posts
					</DropdownMenuLink>
				</DropdownMenuContent>
			</DropdownMenu>,
		)
		const trigger = screen.getByRole('button', { name: 'Routes' })
		trigger.focus()
		await user.keyboard('{ArrowDown}')
		const link = screen.getByRole('menuitem')
		expect(ref.current).toBe(link)
		expect(link).toHaveFocus()
		expect(link).toHaveAttribute('tabindex', '-1')
		expect(link).toHaveAttribute('data-slot', 'dropdown-menu-item')
		expect(link).toHaveClass('px-5')
		await user.keyboard('{Enter}')
		expect(navigate).toHaveBeenCalledExactlyOnceWith('/en/posts?q=react')
		expect(screen.queryByRole('menu')).toBeNull()
		expect(trigger).toHaveFocus()
	})

	it.each(['disabled', 'cancelClick', 'cancelSelect', 'keepOpen'] as const)(
		'respects %s with a router link',
		(mode) => {
			const navigate = vi.fn()
			const onSelect = vi.fn((event: MouseEvent<HTMLAnchorElement>) => {
				if (mode === 'cancelSelect') event.preventDefault()
			})
			render(
				<DropdownMenu defaultOpen>
					<DropdownMenuTrigger>Routes</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLink
							disabled={mode === 'disabled'}
							closeOnSelect={mode !== 'keepOpen'}
							onClick={(event) => {
								if (mode === 'cancelClick') event.preventDefault()
							}}
							onSelect={onSelect}
							render={(props) => (
								<RouterLink {...props} href="/posts" navigate={navigate} />
							)}
						>
							Posts
						</DropdownMenuLink>
					</DropdownMenuContent>
				</DropdownMenu>,
			)
			fireEvent.click(screen.getByRole('menuitem'))
			expect(screen.getByRole('menu')).toBeVisible()
			expect(navigate).toHaveBeenCalledTimes(mode === 'keepOpen' ? 1 : 0)
			expect(onSelect).toHaveBeenCalledTimes(
				mode === 'disabled' || mode === 'cancelClick' ? 0 : 1,
			)
		},
	)
})
