import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Button } from './button'

const meta = {
	title: 'Components/Button',
	component: Button,
	tags: ['autodocs'],
	parameters: { layout: 'centered' },
	args: {
		children: 'Save changes',
		type: 'button',
		onClick: fn(),
	},
	argTypes: {
		variant: {
			control: 'select',
			options: [
				'default',
				'destructive',
				'outline',
				'secondary',
				'subtle',
				'ghost',
				'link',
			],
		},
		size: {
			control: 'select',
			options: ['default', 'xs', 'sm', 'lg', 'icon'],
		},
	},
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	play: async ({ args, canvasElement }) => {
		const button = within(canvasElement).getByRole('button', {
			name: 'Save changes',
		})
		await userEvent.click(button)
		await expect(args.onClick).toHaveBeenCalledOnce()
	},
}

export const Outline: Story = {
	args: { variant: 'outline' },
}

export const Destructive: Story = {
	args: { children: 'Delete post', variant: 'destructive' },
}

export const Disabled: Story = {
	args: { disabled: true },
}
