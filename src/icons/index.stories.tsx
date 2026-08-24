import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '.'

const meta = {
	title: 'Components/Icon',
	component: Icon,
	tags: ['autodocs'],
	parameters: { layout: 'centered' },
	args: {
		icon: 'heart',
		title: 'Favourite',
		style: { color: '#b91c1c', height: 32, width: 32 },
	},
	argTypes: {
		icon: {
			control: 'select',
			options: ['warning', 'heart', 'heart-fill', 'star', 'star-fill'],
		},
	},
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Heart: Story = {}

export const Star: Story = {
	args: {
		icon: 'star-fill',
		title: 'Featured',
		style: { color: '#a16207', height: 32, width: 32 },
	},
}
