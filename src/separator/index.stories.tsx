import type { Meta, StoryObj } from '@storybook/react-vite'
import { Separator } from './index'

const meta = {
	title: 'Components/Separator',
	component: Separator,
	tags: ['autodocs'],
	parameters: { layout: 'centered' },
} satisfies Meta<typeof Separator>
export default meta
type Story = StoryObj<typeof meta>
export const Horizontal: Story = {
	render: () => (
		<div className="w-70">
			<p>Account</p>
			<Separator decorative={false} />
			<p>Preferences</p>
		</div>
	),
}
export const Vertical: Story = {
	render: () => (
		<div className="flex h-6 items-center gap-4">
			<span>Profile</span>
			<Separator orientation="vertical" decorative={false} />
			<span>Settings</span>
		</div>
	),
}
