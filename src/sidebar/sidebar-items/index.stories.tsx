import type { Meta, StoryObj } from '@storybook/react'
import { SidebarItems } from '.'

const meta: Meta<typeof SidebarItems> = {
	title: 'Example/Sidebar/Items',
	component: SidebarItems,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		viewport: {
			viewport: {
				defaultViewport: 'normalDesktop',
			},
		},
	},
	argTypes: {
		withSidebarButton: {
			control: 'boolean',
			description:
				'Determine if the sidebar should leave padding top for the sidebar button. Make it *false* if you want the sidebar always opened',
		},
		className: {
			control: 'text',
			description: 'The Tailwind className for the sidebar items container',
		},
		children: {
			control: 'text',
			description: 'The children items of the sidebar',
		},
	},
} satisfies Meta<typeof SidebarItems>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultSidebarItems: Story = {
	args: {
		children: (
			<ul className="text-white">
				<li>1</li>
				<li>2</li>
				<li>3</li>
			</ul>
		),
	},
	parameters: {
		viewport: {
			defaultViewport: 'iphone14promax',
		},
	},
	render(args) {
		return (
			<div className="h-screen w-80">
				<SidebarItems>{args.children}</SidebarItems>
			</div>
		)
	},
}
