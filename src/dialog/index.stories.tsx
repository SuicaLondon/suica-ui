import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { useState } from 'react'
import { Button } from '../button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from './index'

type ActionState = 'idle' | 'pending' | 'failure' | 'success'

function DestructiveDialogExample({
	initialState = 'idle',
}: {
	initialState?: ActionState
}) {
	const [open, setOpen] = useState(initialState !== 'idle')
	const [state, setState] = useState<ActionState>(initialState)
	const pending = state === 'pending'

	return (
		<Dialog open={open} onOpenChange={setOpen} dismissible={!pending}>
			<DialogTrigger>Delete post</DialogTrigger>
			<DialogContent>
				<DialogTitle>Delete this post?</DialogTitle>
				<DialogDescription>This action cannot be undone.</DialogDescription>
				{state === 'failure' && (
					<p role="alert" className="text-danger">
						Deletion failed. You can retry safely.
					</p>
				)}
				{state === 'success' && (
					<p role="status" className="text-accent">
						The post was deleted.
					</p>
				)}
				<DialogFooter>
					<DialogClose disabled={pending}>Cancel</DialogClose>
					<Button
						variant="destructive"
						disabled={pending || state === 'success'}
						onClick={() => setState('pending')}
					>
						{pending ? 'Deleting…' : 'Delete'}
					</Button>
					{pending && (
						<>
							<Button variant="outline" onClick={() => setState('failure')}>
								Simulate failure
							</Button>
							<Button variant="outline" onClick={() => setState('success')}>
								Simulate success
							</Button>
						</>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

const meta = {
	title: 'Components/Dialog',
	component: DestructiveDialogExample,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Dialog uses the native modal dialog element with controlled or uncontrolled state. DialogTitle and DialogDescription provide accessible naming. Set dismissible={false} while an async action is pending to block Escape, backdrop, and DialogClose dismissal.',
			},
		},
	},
} satisfies Meta<typeof DestructiveDialogExample>

export default meta
type Story = StoryObj<typeof meta>

export const DestructiveConfirmation: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		await userEvent.click(canvas.getByRole('button', { name: 'Delete post' }))
		await expect(
			canvas.getByRole('dialog', { name: 'Delete this post?' }),
		).toBeVisible()
		await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }))
		await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument()
	},
}

export const Pending: Story = { args: { initialState: 'pending' } }
export const Failure: Story = { args: { initialState: 'failure' } }
export const Success: Story = { args: { initialState: 'success' } }
