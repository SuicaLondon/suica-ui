import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
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
		children: {},
	},
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

function SidebarRender(defaultOpened: boolean) {
	const [isOpened, setIsOpened] = useState<boolean>(defaultOpened)
	return (
		<>
			<Sidebar.Button isOpened={isOpened} setIsOpened={setIsOpened} />
			<Sidebar isOpened={isOpened} setIsOpened={setIsOpened}>
				<Sidebar.Items>
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
		return SidebarRender(false)
	},
}
export const DesktopSidebar: Story = {
	args: {
		children: null,
	},
	parameters: {
		viewport: {
			defaultViewport: 'customMobile',
		},
	},
	render() {
		return SidebarRender(false)
	},
}
