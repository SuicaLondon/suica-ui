import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Switch } from './toggle-button'

const meta = {
	title: 'Components/Switch',
	component: Switch,
	tags: ['autodocs'],
	parameters: { layout: 'centered' },
	args: {
		label: 'Dark mode',
		onChange: fn(),
	},
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: { defaultChecked: false },
	play: async ({ args, canvasElement }) => {
		const control = within(canvasElement).getByRole('switch', {
			name: 'Dark mode',
		})

		await userEvent.click(control)
		await expect(control).toBeChecked()
		await expect(args.onChange).toHaveBeenCalledOnce()
	},
}

export const Disabled: Story = {
	args: { checked: true, disabled: true },
}
