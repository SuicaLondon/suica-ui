import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import type { ReactNode } from 'react'
import { Button, buttonClassName } from './button'

const meta = {
	title: 'Components/Button',
	component: Button,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Button renders a native button and safely defaults to type="button". Set type="submit" explicitly for form submission. Style anchors or router links with buttonClassName instead of nesting an anchor inside Button.',
			},
		},
	},
	args: {
		children: 'Save changes',
		type: 'button',
		onClick: fn(),
	},
	argTypes: {
		variant: {
			control: 'select',
			options: [
				'default',
				'destructive',
				'outline',
				'secondary',
				'subtle',
				'ghost',
				'link',
			],
		},
		size: {
			control: 'select',
			options: ['default', 'xs', 'sm', 'lg', 'icon'],
		},
	},
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	play: async ({ args, canvasElement }) => {
		const button = within(canvasElement).getByRole('button', {
			name: 'Save changes',
		})
		await userEvent.click(button)
		await expect(args.onClick).toHaveBeenCalledOnce()
	},
}

export const Outline: Story = {
	args: { variant: 'outline' },
}

export const Destructive: Story = {
	args: { children: 'Delete post', variant: 'destructive' },
}

export const Disabled: Story = {
	args: { disabled: true },
}

function RouterLink({
	href,
	className,
	children,
}: {
	href: string
	className?: string
	children: ReactNode
}) {
	return (
		<a href={href} className={className}>
			{children}
		</a>
	)
}

export const Links: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<a href="#default" className={buttonClassName()}>
				Default link
			</a>
			<a href="#outline" className={buttonClassName({ variant: 'outline' })}>
				Outline link
			</a>
			<RouterLink
				href="#destructive"
				className={buttonClassName({ variant: 'destructive' })}
			>
				Destructive router link
			</RouterLink>
			<a
				href="#icon"
				aria-label="Open settings"
				className={buttonClassName({ variant: 'ghost', size: 'icon' })}
			>
				<span aria-hidden="true">⚙</span>
			</a>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		await expect(canvas.getAllByRole('link')).toHaveLength(4)
		await expect(canvas.queryByRole('button')).not.toBeInTheDocument()
	},
}
