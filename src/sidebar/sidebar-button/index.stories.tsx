import type { Meta, StoryObj } from '@storybook/react'
import { SidebarButton } from '.'
import { useArgs } from '@storybook/preview-api'

const meta: Meta<typeof SidebarButton> = {
	title: 'Example/Sidebar/Button',
	component: SidebarButton,
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
		isHovered: {
			control: 'boolean',
			description: 'Determines if the sidebar button is using the fixed position',
			argTypesRegex: '.*ed$',
		},
		isOpened: {
			control: 'boolean',
			description: 'Determines if the sidebar is opened or not',
			argTypesRegex: '.*ed$',
		},
		setIsOpened: {
			action: 'clicked',
			description: 'The callback function when the user click the sidebar button',
			argTypesRegex: '^on.*',
		},
		className: {
			control: 'text',
			description: 'The Tailwind className for the sidebar button container',
		},
	},
} satisfies Meta<typeof SidebarButton>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultSidebarButton: Story = {
	args: {
		isHovered: true,
		isOpened: false,
		setIsOpened: () => {},
	},
	parameters: {
		viewport: {
			defaultViewport: 'iphone14promax',
		},
	},
	render(args) {
		const [{ isOpened, isHovered }, updateArgs] = useArgs()

		const handleOpened = (newIsOpened: boolean) => {
			updateArgs({ isOpened: newIsOpened })
			args.setIsOpened(newIsOpened)
		}
		return (
			<div className="h-80 w-80">
				<SidebarButton
					isHovered={isHovered}
					isOpened={isOpened}
					setIsOpened={handleOpened}
				/>
			</div>
		)
	},
}
