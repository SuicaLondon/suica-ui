import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../button/button'
import { Icon } from '../icons'
import { Alert } from './alert'

const meta = {
	title: 'Components/Alert',
	component: Alert,
	tags: ['autodocs'],
	parameters: { layout: 'padded' },
	decorators: [
		(Story) => (
			<div className="sui:w-full sui:max-w-2xl">
				<Story />
			</div>
		),
	],
	args: {
		title: 'Dashboard updated',
		children: 'The latest viewer data is now available.',
		variant: 'info',
	},
	argTypes: {
		variant: {
			control: 'select',
			options: ['info', 'success', 'warning', 'danger'],
		},
	},
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithIconAndAction: Story = {
	args: {
		variant: 'warning',
		icon: <Icon icon="warning" />,
		title: 'Draft has unpublished changes',
		children: 'Publish when this version is ready for readers.',
		action: (
			<Button size="xs" variant="subtle">
				Review
			</Button>
		),
	},
}

export const Danger: Story = {
	args: {
		variant: 'danger',
		title: 'Unable to save',
		children: 'Check your connection and try again.',
	},
}
