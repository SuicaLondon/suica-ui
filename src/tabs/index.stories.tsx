import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'
import { Tabs } from './tabs'
import { AlignDirection } from './tab.type'

const meta = {
	title: 'Example/Tabs',
	component: Tabs,
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs'],
	parameters: {
		// More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
		layout: 'fullscreen',
	},
	argTypes: {
		tabs: {
			control: 'array',
			description: "The tabs' configuration",
		},
		activeTabId: {
			control: 'string',
			description: "The selected tab's id",
		},
		direction: {
			control: 'string',
			description: 'The render direction of the tabs',
		},
		onChange: {
			action: 'clicked',
			description: 'The callback function when the user selected the tab',
			argTypesRegex: '^on.*',
		},
	},
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const HorizontalTabs: Story = {
	args: {
		tabs: [
			{ id: 'suica', label: 'Suica' },
			{ id: 'kitaca', label: 'Kitaca' },
			{ id: 'pasmo', label: 'Pasmo' },
			{ id: 'icoca', label: 'Icoca' },
		],
		activeTabId: 'suica',
	},
	render: function Render(args) {
		const [{ activeTabId }, updateArgs] = useArgs()

		const onChanged = ({ id }: { id: string }) => {
			updateArgs({ activeTabId: id })
			args.onChange?.({ id: id })
		}

		return <Tabs {...args} activeTabId={activeTabId} onChange={onChanged} />
	},
}
export const VerticalTabs: Story = {
	args: {
		tabs: [
			{ id: 'suica', label: 'Suica' },
			{ id: 'kitaca', label: 'Kitaca' },
			{ id: 'pasmo', label: 'Pasmo' },
			{ id: 'icoca', label: 'Icoca' },
		],
		activeTabId: 'suica',
		direction: AlignDirection.vertical,
	},
	render: function Render(args) {
		const [{ activeTabId }, updateArgs] = useArgs()

		const onChanged = ({ id }: { id: string }) => {
			updateArgs({ activeTabId: id })
			args.onChange?.({ id: id })
		}

		return <Tabs {...args} activeTabId={activeTabId} onChange={onChanged} />
	},
}
