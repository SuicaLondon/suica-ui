import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import type { TabItem } from './tab.type'
import { Tabs } from './tabs'

const transitTabs: readonly TabItem[] = [
	{
		id: 'suica',
		label: 'Suica',
		panel: <p>JR East transit card.</p>,
	},
	{
		id: 'kitaca',
		label: 'Kitaca',
		panel: <p>JR Hokkaido transit card.</p>,
	},
	{
		id: 'pasmo',
		label: 'Pasmo',
		panel: <p>Tokyo rail and bus transit card.</p>,
	},
	{
		id: 'disabled',
		label: 'Unavailable',
		panel: <p>This panel cannot be selected.</p>,
		disabled: true,
	},
]

const meta = {
	title: 'Components/Tabs',
	component: Tabs,
	tags: ['autodocs'],
	parameters: { layout: 'centered' },
	args: {
		'aria-label': 'Transit cards',
		tabs: transitTabs,
	},
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
	args: { defaultValue: 'suica' },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		await userEvent.click(canvas.getByRole('tab', { name: 'Kitaca' }))
		await expect(canvas.getByRole('tab', { name: 'Kitaca' })).toHaveAttribute(
			'aria-selected',
			'true',
		)
		await expect(canvas.getByText('JR Hokkaido transit card.')).toBeVisible()
	},
}

export const Vertical: Story = {
	args: {
		defaultValue: 'kitaca',
		orientation: 'vertical',
	},
}

export const Segmented: Story = {
	args: {
		defaultValue: 'suica',
		variant: 'segmented',
	},
}

export const ManualActivation: Story = {
	args: {
		activationMode: 'manual',
		defaultValue: 'suica',
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const suicaTab = canvas.getByRole('tab', { name: 'Suica' })
		const kitacaTab = canvas.getByRole('tab', { name: 'Kitaca' })

		suicaTab.focus()
		await userEvent.keyboard('{ArrowRight}')
		await expect(kitacaTab).toHaveFocus()
		await expect(kitacaTab).toHaveAttribute('aria-selected', 'false')
		await userEvent.keyboard('{Enter}')
		await expect(kitacaTab).toHaveAttribute('aria-selected', 'true')
	},
}
