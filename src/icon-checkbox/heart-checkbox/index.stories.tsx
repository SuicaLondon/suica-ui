import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { HeartCheckbox } from '.'

const meta = {
	title: 'Components/Icon Checkbox/Heart',
	component: HeartCheckbox,
	tags: ['autodocs'],
	parameters: { layout: 'centered' },
	args: {
		endLabel: 'Favourite',
		iconClassName: 'sui:text-primary-gray',
		onChange: fn(),
	},
} satisfies Meta<typeof HeartCheckbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: { defaultChecked: false },
	play: async ({ args, canvasElement }) => {
		const checkbox = within(canvasElement).getByRole('checkbox', {
			name: 'Favourite',
		})

		await userEvent.click(checkbox)
		await expect(checkbox).toBeChecked()
		await expect(args.onChange).toHaveBeenCalledOnce()
	},
}

export const Disabled: Story = {
	args: { checked: true, disabled: true },
}
