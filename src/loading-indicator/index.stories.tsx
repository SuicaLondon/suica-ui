import type { Meta, StoryObj } from '@storybook/react-vite'
import { LoadingIndicator } from './index'

const meta = {
	title: 'Components/LoadingIndicator',
	component: LoadingIndicator,
	tags: ['autodocs'],
	parameters: { layout: 'centered' },
	args: {
		label: 'Refreshing analytics',
	},
} satisfies Meta<typeof LoadingIndicator>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
