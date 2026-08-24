import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { useState } from 'react'
import { Icon } from '../icons'
import { Sidebar, SidebarItem, SidebarItems, SidebarTrigger } from './index'
import { getSidebarState, type SidebarState } from './sidebar-state.js'

const meta = {
	title: 'Components/Sidebar',
	component: Sidebar,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

const triggerLabelByState: Record<SidebarState, string> = {
	closed: 'Open navigation',
	open: 'Close navigation',
}

function SidebarExample({
	initiallyOpen = false,
}: {
	initiallyOpen?: boolean
}) {
	const [open, setOpen] = useState(initiallyOpen)
	const state = getSidebarState(open)

	return (
		<div style={{ minHeight: 384, padding: 16 }}>
			<SidebarTrigger
				open={open}
				onOpenChange={setOpen}
				label={triggerLabelByState[state]}
			/>
			<Sidebar
				open={open}
				onOpenChange={setOpen}
				label="Main navigation"
				closeLabel="Close navigation backdrop"
			>
				<SidebarItems label="Main navigation links">
					<SidebarItem href="#favourites" icon={<Icon icon="heart-fill" />}>
						Favourites
					</SidebarItem>
					<SidebarItem
						href="#featured"
						icon={<Icon icon="star-fill" />}
						badge={<span style={{ fontSize: 12 }}>2</span>}
					>
						Featured
					</SidebarItem>
				</SidebarItems>
			</Sidebar>
		</div>
	)
}

export const Default: Story = {
	args: {
		open: false,
		onOpenChange: () => {},
		label: 'Main navigation',
		closeLabel: 'Close navigation backdrop',
		children: null,
	},
	render: () => <SidebarExample />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		await userEvent.click(canvas.getByRole('button', { name: 'Open navigation' }))
		await expect(canvas.getByRole('dialog')).toHaveAttribute(
			'aria-hidden',
			'false',
		)
		await userEvent.click(
			canvas.getByRole('button', { name: 'Close navigation backdrop' }),
		)
		await expect(canvas.getByRole('dialog', { hidden: true })).toHaveAttribute(
			'aria-hidden',
			'true',
		)
	},
}

export const Open: Story = {
	args: {
		open: true,
		onOpenChange: () => {},
		label: 'Main navigation',
		closeLabel: 'Close navigation backdrop',
		children: null,
	},
	render: () => <SidebarExample initiallyOpen />,
}

export const Persistent: Story = {
	args: {
		open: true,
		mode: 'persistent',
		onOpenChange: () => {},
		label: 'Dashboard navigation',
		closeLabel: 'Close navigation',
		children: (
			<SidebarItems label="Dashboard links" triggerInset={false}>
				<SidebarItem href="#posts" icon={<Icon icon="star-fill" />}>
					Posts
				</SidebarItem>
				<SidebarItem href="#favourites" icon={<Icon icon="heart-fill" />}>
					Favourites
				</SidebarItem>
			</SidebarItems>
		),
	},
}
