import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge, type BadgeSize, type BadgeVariant } from './badge'

const badgeVariants: BadgeVariant[] = [
	'default',
	'secondary',
	'outline',
	'destructive',
	'success',
	'warning',
]

const badgeSizes: BadgeSize[] = ['md', 'sm']

const badgeLabelByVariant: Record<BadgeVariant, string> = {
	default: 'Published',
	secondary: 'Scheduled',
	outline: 'Draft',
	destructive: 'Failed',
	success: 'Ready',
	warning: 'Needs review',
}

const badgeSizeLabel: Record<BadgeSize, string> = {
	md: 'Medium',
	sm: 'Small',
}

const meta = {
	title: 'Components/Badge',
	component: Badge,
	tags: ['autodocs'],
	parameters: { layout: 'centered' },
	args: { children: 'Published' },
	argTypes: {
		variant: {
			control: 'select',
			options: [
				'default',
				'secondary',
				'outline',
				'destructive',
				'success',
				'warning',
			],
		},
		size: { control: 'select', options: ['sm', 'md'] },
	},
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Variants: Story = {
	render: () => (
		<div className="flex flex-col gap-3">
			{badgeSizes.map((size) => (
				<div key={size} className="flex items-center gap-3">
					<span className="w-11 shrink-0 text-xs text-muted">
						{badgeSizeLabel[size]}
					</span>
					<div className="flex flex-wrap gap-2">
						{badgeVariants.map((variant) => (
							<Badge key={variant} size={size} variant={variant}>
								{badgeLabelByVariant[variant]}
							</Badge>
						))}
					</div>
				</div>
			))}
		</div>
	),
}

export const Playground: Story = {}
