import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Label } from '../label'
import { Checkbox } from './checkbox'

const meta = {
	title: 'Forms/Checkbox',
	component: Checkbox,
	tags: ['autodocs'],
	parameters: { layout: 'centered' },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	render: (args) => (
		<div className="flex items-center gap-2">
			<Checkbox {...args} id="checkbox-default" />
			<Label htmlFor="checkbox-default">Show published posts only</Label>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const checkbox = canvas.getByRole('checkbox', {
			name: 'Show published posts only',
		})

		await expect(checkbox).not.toBeChecked()
		await userEvent.click(checkbox)
		await expect(checkbox).toBeChecked()
	},
}

export const States: Story = {
	render: () => (
		<div className="grid gap-3">
			<div className="flex items-center gap-2">
				<Checkbox id="checkbox-unchecked" />
				<Label htmlFor="checkbox-unchecked">Unchecked</Label>
			</div>
			<div className="flex items-center gap-2">
				<Checkbox id="checkbox-checked" defaultChecked />
				<Label htmlFor="checkbox-checked">Checked</Label>
			</div>
			<div className="flex items-center gap-2">
				<Checkbox id="checkbox-required" required />
				<Label htmlFor="checkbox-required">Required</Label>
			</div>
			<div className="flex items-center gap-2">
				<Checkbox id="checkbox-invalid" aria-invalid="true" />
				<Label htmlFor="checkbox-invalid">Invalid</Label>
			</div>
			<div className="flex items-center gap-2">
				<Checkbox id="checkbox-disabled" disabled />
				<Label htmlFor="checkbox-disabled">Disabled</Label>
			</div>
			<div className="flex items-center gap-2">
				<Checkbox id="checkbox-disabled-checked" disabled defaultChecked />
				<Label htmlFor="checkbox-disabled-checked">Disabled checked</Label>
			</div>
		</div>
	),
}
