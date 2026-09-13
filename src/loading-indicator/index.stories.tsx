import type { Meta, StoryObj } from '@storybook/react-vite'
import { LoadingIndicator } from './index'

const meta = {
	title: 'Components/LoadingIndicator',
	component: LoadingIndicator,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'LoadingIndicator provides progress status, animation, and a visible accessible label. Compose it with Overlay only when the surrounding surface must remain visible.',
			},
		},
	},
	args: {
		label: 'Refreshing analytics',
	},
} satisfies Meta<typeof LoadingIndicator>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
