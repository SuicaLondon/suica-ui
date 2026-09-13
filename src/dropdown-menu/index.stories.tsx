import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuLink,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from './index'

const meta = {
	title: 'Components/DropdownMenu',
	component: DropdownMenu,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'DropdownMenu portals content above overflow contexts and supports top or bottom placement with start, center, or end alignment. Placement flips and clamps at viewport edges, including RTL layouts. Use Arrow keys, Home, End, typeahead, Enter, and Space; Escape returns focus to the trigger.',
			},
		},
	},
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

export const AccountMenu: Story = {
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger>Account</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Signed in as Suica</DropdownMenuLabel>
				<DropdownMenuLink href="#profile">Profile</DropdownMenuLink>
				<DropdownMenuItem>Preferences</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="text-danger">Log out</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const page = within(canvasElement.ownerDocument.body)
		const trigger = canvas.getByRole('button', { name: 'Account' })
		await userEvent.click(trigger)
		await expect(page.getByRole('menu')).toBeVisible()
		await expect(page.getByRole('menuitem', { name: 'Profile' })).toHaveFocus()
	},
}

export const LanguageMenu: Story = {
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger>English</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem>English</DropdownMenuItem>
				<DropdownMenuItem>繁體中文</DropdownMenuItem>
				<DropdownMenuItem>日本語</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	),
}

export const TopFromClippedSidebar: Story = {
	render: () => (
		<div className="h-48 overflow-hidden border p-4 pt-32">
			<DropdownMenu>
				<DropdownMenuTrigger>Sidebar account</DropdownMenuTrigger>
				<DropdownMenuContent side="top" align="start">
					<DropdownMenuItem>Profile</DropdownMenuItem>
					<DropdownMenuItem>Log out</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	),
}

export const RtlEdgeCollision: Story = {
	parameters: { layout: 'fullscreen' },
	render: () => (
		<div dir="rtl" className="flex min-h-80 items-end p-2">
			<DropdownMenu defaultOpen>
				<DropdownMenuTrigger>الحساب</DropdownMenuTrigger>
				<DropdownMenuContent side="bottom" align="end">
					<DropdownMenuItem>الملف الشخصي</DropdownMenuItem>
					<DropdownMenuItem>تسجيل الخروج</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	),
}

export const CustomLink: Story = {
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger>Navigation</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLink render={(props) => <a {...props} href="#posts" />}>
					Posts
				</DropdownMenuLink>
			</DropdownMenuContent>
		</DropdownMenu>
	),
}
