import type { Meta, StoryObj } from '@storybook/react'
import {
	ILiquidGlassButtonProps,
	LiquidGlassButton,
} from './liquid-glass-button'
import { StarIcon } from '../../icon-checkbox/star-checkbox/star-icon'
import { cn } from '../../cn'

const meta = {
	title: 'Example/LiquidGlassButton',
	component: LiquidGlassButton,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
		action: {
			actions: {
				argTypesRegex: '^on.*',
			},
		},
	},
	argTypes: {
		children: {
			control: 'text',
			description: 'The label of the button',
		},
		onClick: {
			action: 'clicked',
			description: 'The callback function when the user click the button',
			argTypesRegex: '^on.*',
		},
	},
} satisfies Meta<typeof LiquidGlassButton>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultLiquidGlassButton: Story = {
	args: {
		onClick: () => {},
		children: 'Click me',
	},
	render: function Render(args: ILiquidGlassButtonProps) {
		return (
			<div
				className={cn(
					'flex h-[500px] w-[500px] items-center justify-center',
					'bg-[url("https://suica.dev/_next/image?url=%2Favatar.jpeg&w=256&q=75")] bg-cover bg-center',
				)}
			>
				<LiquidGlassButton {...args}>
					<StarIcon />
					{args.children}
				</LiquidGlassButton>
			</div>
		)
	},
}
