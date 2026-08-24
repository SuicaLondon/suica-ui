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

const checkboxRowStyle = {
	display: 'flex',
	alignItems: 'center',
	gap: 8,
}

export const Default: Story = {
	render: (args) => (
		<div style={checkboxRowStyle}>
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
		<div style={{ display: 'grid', gap: 12 }}>
			<div style={checkboxRowStyle}>
				<Checkbox id="checkbox-unchecked" />
				<Label htmlFor="checkbox-unchecked">Unchecked</Label>
			</div>
			<div style={checkboxRowStyle}>
				<Checkbox id="checkbox-checked" defaultChecked />
				<Label htmlFor="checkbox-checked">Checked</Label>
			</div>
			<div style={checkboxRowStyle}>
				<Checkbox id="checkbox-required" required />
				<Label htmlFor="checkbox-required">Required</Label>
			</div>
			<div style={checkboxRowStyle}>
				<Checkbox id="checkbox-invalid" aria-invalid="true" />
				<Label htmlFor="checkbox-invalid">Invalid</Label>
			</div>
			<div style={checkboxRowStyle}>
				<Checkbox id="checkbox-disabled" disabled />
				<Label htmlFor="checkbox-disabled">Disabled</Label>
			</div>
			<div style={checkboxRowStyle}>
				<Checkbox id="checkbox-disabled-checked" disabled defaultChecked />
				<Label htmlFor="checkbox-disabled-checked">Disabled checked</Label>
			</div>
		</div>
	),
}
