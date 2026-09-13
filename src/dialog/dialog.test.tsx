import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from './index'

function DialogHarness({ dismissible = true }: { dismissible?: boolean }) {
	const [open, setOpen] = useState(false)
	return (
		<Dialog open={open} onOpenChange={setOpen} dismissible={dismissible}>
			<DialogTrigger>Delete post</DialogTrigger>
			<DialogContent>
				<DialogTitle>Confirm deletion</DialogTitle>
				<DialogDescription>This action cannot be undone.</DialogDescription>
				<DialogFooter>
					<DialogClose>Cancel</DialogClose>
					<button type="button">Delete</button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

beforeAll(() => {
	Object.defineProperties(HTMLDialogElement.prototype, {
		showModal: {
			configurable: true,
			value(this: HTMLDialogElement) {
				this.setAttribute('open', '')
			},
		},
		close: {
			configurable: true,
			value(this: HTMLDialogElement) {
				this.removeAttribute('open')
				this.dispatchEvent(new Event('close'))
			},
		},
	})
})

describe('Dialog', () => {
	it('supports uncontrolled pointer and keyboard opening', async () => {
		const user = userEvent.setup()
		render(
			<Dialog>
				<DialogTrigger>Preferences</DialogTrigger>
				<DialogContent>
					<DialogTitle>Preferences</DialogTitle>
					<DialogDescription>Update your preferences.</DialogDescription>
					<DialogClose>Done</DialogClose>
				</DialogContent>
			</Dialog>,
		)
		const trigger = screen.getByRole('button', { name: 'Preferences' })
		trigger.focus()
		await user.keyboard('{Enter}')
		expect(screen.getByRole('dialog', { name: 'Preferences' })).toHaveAttribute(
			'open',
		)
		await user.click(screen.getByRole('button', { name: 'Done' }))
		expect(screen.queryByRole('dialog')).toBeNull()
		expect(trigger).toHaveFocus()
	})

	it('wires its title and description and moves focus inside', async () => {
		const user = userEvent.setup()
		render(<DialogHarness />)
		await user.click(screen.getByRole('button', { name: 'Delete post' }))
		const dialog = screen.getByRole('dialog', { name: 'Confirm deletion' })
		const description = screen.getByText('This action cannot be undone.')
		expect(dialog).toHaveAttribute('aria-describedby', description.id)
		expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus()
	})

	it('cycles focus and closes on Escape', async () => {
		const user = userEvent.setup()
		render(<DialogHarness />)
		const trigger = screen.getByRole('button', { name: 'Delete post' })
		await user.click(trigger)
		const dialog = screen.getByRole('dialog')
		const cancel = screen.getByRole('button', { name: 'Cancel' })
		const confirm = screen.getByRole('button', { name: 'Delete' })
		confirm.focus()
		fireEvent.keyDown(dialog, { key: 'Tab' })
		expect(cancel).toHaveFocus()
		fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true })
		expect(confirm).toHaveFocus()
		fireEvent(dialog, new Event('cancel', { cancelable: true }))
		await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
		expect(trigger).toHaveFocus()
	})

	it('supports explicit Escape and overlay dismissal options', async () => {
		const onOpenChange = vi.fn()
		render(
			<Dialog
				open
				onOpenChange={onOpenChange}
				closeOnEscape={false}
				closeOnOverlayClick={false}
			>
				<DialogContent>
					<DialogTitle>Locked</DialogTitle>
					<DialogDescription>Use an action to close.</DialogDescription>
				</DialogContent>
			</Dialog>,
		)
		const dialog = screen.getByRole('dialog')
		fireEvent(dialog, new Event('cancel', { cancelable: true }))
		fireEvent.click(dialog, { clientX: 0, clientY: 0 })
		expect(onOpenChange).not.toHaveBeenCalled()
	})

	it('dismisses from the overlay when enabled', async () => {
		const user = userEvent.setup()
		render(<DialogHarness />)
		await user.click(screen.getByRole('button', { name: 'Delete post' }))
		const dialog = screen.getByRole('dialog')
		vi.spyOn(dialog, 'getBoundingClientRect').mockReturnValue({
			bottom: 400,
			height: 300,
			left: 100,
			right: 500,
			top: 100,
			width: 400,
			x: 100,
			y: 100,
			toJSON: () => ({}),
		})
		fireEvent.click(dialog, { clientX: 50, clientY: 50 })
		await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
	})

	it('prevents every dismissal path while pending', async () => {
		render(<DialogHarness dismissible={false} />)
		const user = userEvent.setup()
		await user.click(screen.getByRole('button', { name: 'Delete post' }))
		const dialog = screen.getByRole('dialog')
		const close = screen.getByRole('button', { name: 'Cancel' })
		expect(close).toBeDisabled()
		fireEvent(dialog, new Event('cancel', { cancelable: true }))
		fireEvent.click(dialog, { clientX: 0, clientY: 0 })
		expect(dialog).toHaveAttribute('open')
	})

	it('locks scrolling and cleans up after close and unmount', async () => {
		const user = userEvent.setup()
		const { unmount } = render(<DialogHarness />)
		await user.click(screen.getByRole('button', { name: 'Delete post' }))
		expect(document.body.style.overflow).toBe('hidden')
		await user.click(screen.getByRole('button', { name: 'Cancel' }))
		expect(document.body.style.overflow).toBe('')
		await user.click(screen.getByRole('button', { name: 'Delete post' }))
		unmount()
		expect(document.body.style.overflow).toBe('')
	})

	it('supports a consumer-provided trigger without nested buttons', async () => {
		const user = userEvent.setup()
		render(
			<Dialog>
				<DialogTrigger
					render={(props) => <button {...props}>Custom trigger</button>}
				/>
				<DialogContent>
					<DialogTitle>Custom</DialogTitle>
					<DialogDescription>Custom trigger example.</DialogDescription>
				</DialogContent>
			</Dialog>,
		)
		expect(screen.getAllByRole('button')).toHaveLength(1)
		await user.click(screen.getByRole('button', { name: 'Custom trigger' }))
		expect(screen.getByRole('dialog', { name: 'Custom' })).toBeVisible()
	})
})
