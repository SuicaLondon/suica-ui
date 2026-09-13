import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { useCallback, useState } from 'react'
import type { TabItem } from './tab.type'
import { TabsLifecyclePanel } from '../test/tabs-lifecycle-panel'
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
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Use Arrow keys, Home, and End to move between tabs. Manual activation additionally uses Enter or Space. The default is always for backward compatibility. Choose active for the least initial work or lazy to preserve panels after their first visit.',
			},
		},
	},
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

export const ActivePanelOnly: Story = {
	args: {
		defaultValue: 'suica',
		mountStrategy: 'active',
	},
}

function MountStrategyExample() {
	const [events, setEvents] = useState<string[]>([])
	const record = useCallback(
		(event: string) => setEvents((current) => [...current.slice(-7), event]),
		[],
	)
	const tabs = (strategy: string): readonly TabItem[] => [
		{
			id: 'one',
			label: 'One',
			panel: <TabsLifecyclePanel label={`${strategy} one`} onEvent={record} />,
		},
		{
			id: 'two',
			label: 'Two',
			panel: <TabsLifecyclePanel label={`${strategy} two`} onEvent={record} />,
		},
	]

	return (
		<div className="grid gap-6">
			{(['active', 'lazy', 'always'] as const).map((strategy) => (
				<section key={strategy}>
					<h2>{strategy}</h2>
					<Tabs
						aria-label={`${strategy} mounting`}
						mountStrategy={strategy}
						tabs={tabs(strategy)}
					/>
				</section>
			))}
			<output aria-live="polite">{events.join(' · ')}</output>
		</div>
	)
}

export const MountStrategies: Story = {
	render: () => <MountStrategyExample />,
}
