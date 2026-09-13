import type { Meta, StoryObj } from '@storybook/react-vite'
import { LoadingIndicator } from '../loading-indicator'
import { Overlay } from './index'

const meta = {
	title: 'Components/Overlay',
	component: Overlay,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Overlay is a visual layer only. Compose it with LoadingIndicator when an existing surface should remain visible while it refreshes.',
			},
		},
	},
} satisfies Meta<typeof Overlay>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	render: (args) => (
		<div className="story-viewport relative h-40 w-120 p-5">
			Dashboard content remains visible beneath the overlay.
			<Overlay {...args} />
		</div>
	),
}

export const WithLoadingIndicator: Story = {
	render: (args) => (
		<div className="story-viewport relative h-40 w-120 p-5">
			Dashboard content remains visible beneath the overlay.
			<Overlay {...args}>
				<LoadingIndicator label="Refreshing analytics" />
			</Overlay>
		</div>
	),
}
