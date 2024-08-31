import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'
import { Icon } from '../icons'
import { Sidebar } from './index'

const meta: Meta<typeof Sidebar> = {
	title: 'Example/Sidebar',
	component: Sidebar,
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
		children: {
			control: 'text',
			description:
				'The content of the sidebar, it normally is <Sidebar.Items /> which can provide the background style for the sidebar.',
		},
		isOpened: {
			control: 'boolean',
			description: 'Determines if the sidebar is opened or not',
			argTypesRegex: '.*ed$',
		},
		setIsOpened: {
			action: 'clicked',
			description:
				'The callback function when the user click the sidebar backdrop',
			argTypesRegex: '^on.*',
		},
		className: {
			control: 'text',
			description: 'The Tailwind className for the sidebar container',
		},
	},
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

function SidebarRender() {
	const [{ isOpened }, updateArgs] = useArgs()

	const handleOpened = (newIsOpened: boolean) => {
		updateArgs({ isOpened: newIsOpened })
	}

	return (
		<>
			<Sidebar.Button isOpened={isOpened} setIsOpened={handleOpened} isHovered />
			<Sidebar isOpened={isOpened} setIsOpened={handleOpened}>
				<Sidebar.Items className="pt-16">
					<Sidebar.Item
						href="/item1"
						icon={
							<Icon
								icon="heart-fill"
								className={'flex-center h-iconSize w-iconSize'}
							/>
						}
						label="Nothing"
					>
						Item 1
					</Sidebar.Item>
					<Sidebar.Item
						href="/item2"
						icon={
							<Icon icon="heart" className={'flex-center h-iconSize w-iconSize'} />
						}
						label="Nothing"
					>
						Item 2
					</Sidebar.Item>
				</Sidebar.Items>
			</Sidebar>
		</>
	)
}

export const MobileSidebar: Story = {
	args: {
		children: null,
	},
	parameters: {
		viewport: {
			defaultViewport: 'iphone14promax',
		},
	},
	render() {
		return SidebarRender()
	},
}

export const DesktopSidebarWithButton: Story = {
	args: {
		children: null,
	},
	parameters: {
		viewport: {
			defaultViewport: 'customMobile',
		},
	},
	render() {
		return SidebarRender()
	},
}
