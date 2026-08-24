import type { Meta, StoryObj } from '@storybook/react-vite'
import { LoadingIndicator } from '../loading-indicator'
import { Overlay } from './index'

const meta = {
	title: 'Components/Overlay',
	component: Overlay,
	tags: ['autodocs'],
	parameters: { layout: 'centered' },
} satisfies Meta<typeof Overlay>

export default meta
type Story = StoryObj<typeof meta>

const frameStyle = {
	position: 'relative' as const,
	height: 160,
	width: 480,
	maxWidth: 'calc(100vw - 32px)',
	padding: 20,
}

export const Default: Story = {
	render: (args) => (
		<div style={frameStyle}>
			Dashboard content remains visible beneath the overlay.
			<Overlay {...args} />
		</div>
	),
}

export const WithLoadingIndicator: Story = {
	render: (args) => (
		<div style={frameStyle}>
			Dashboard content remains visible beneath the overlay.
			<Overlay {...args}>
				<LoadingIndicator label="Refreshing analytics" />
			</Overlay>
		</div>
	),
}
