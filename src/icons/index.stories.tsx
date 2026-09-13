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
		className: 'text-danger h-8 w-8',
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
		className: 'text-warning h-8 w-8',
	},
}
