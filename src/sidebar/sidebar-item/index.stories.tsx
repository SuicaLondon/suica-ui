import type { Meta, StoryObj } from '@storybook/react'
import { SidebarItem } from '.'
import { FillStarIcon } from '../../icon-checkbox/star-checkbox/fill-star-icon'

const meta: Meta<typeof SidebarItem> = {
	title: 'Example/Sidebar/Item',
	component: SidebarItem,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		viewport: {
			viewport: {
				defaultViewport: 'customMobile',
			},
		},
	},
	argTypes: {
		href: {
			control: 'text',
			description: 'The hyper link of the item',
		},
		icon: {
			control: 'text',
			description: 'The icon on the left in the sidebar item content',
		},
		children: {
			control: 'text',
			description: 'The content of the sidebar item',
		},
		label: {
			control: 'text',
			description: 'The label on the right the sidebar item content',
		},
	},
} satisfies Meta<typeof SidebarItem>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultSidebarItem: Story = {
	args: {},
	parameters: {
		viewport: {
			defaultViewport: 'iphone14promax',
		},
	},
	render() {
		return (
			<div className="h-screen w-80">
				<SidebarItem href="/content/1" icon="😀" label="1">
					Content 1
				</SidebarItem>
				<SidebarItem href="/content/2" icon={<FillStarIcon />} label="@">
					Content 2
				</SidebarItem>
			</div>
		)
	},
}
