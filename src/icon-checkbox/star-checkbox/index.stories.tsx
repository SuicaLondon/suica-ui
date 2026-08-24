import type { Meta, StoryObj } from '@storybook/react-vite'
import { StarCheckbox } from '.'

const meta = {
	title: 'Components/Icon Checkbox/Star',
	component: StarCheckbox,
	tags: ['autodocs'],
	parameters: { layout: 'centered' },
	args: {
		endLabel: 'Featured',
		iconClassName: 'sui:text-primary-gray',
	},
} satisfies Meta<typeof StarCheckbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: { defaultChecked: true },
}

export const WithLeadingLabel: Story = {
	args: {
		defaultChecked: false,
		endLabel: undefined,
		startLabel: 'Featured',
	},
}
