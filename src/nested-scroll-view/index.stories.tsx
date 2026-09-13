import type { Meta, StoryObj } from '@storybook/react-vite'
import { NestedScrollView } from './nested-scroll-view'

const items = Array.from({ length: 40 }, (_, index) => `Item ${index + 1}`)

const meta = {
	title: 'Components/NestedScrollView',
	component: NestedScrollView,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
	args: {
		scrollableDistance: 220,
		minDistanceToTop: 72,
		extraHeight: 24,
		scrollerProps: {
			'aria-label': 'Example items',
			tabIndex: 0,
		},
		header: (
			<header className="h-72 bg-surface-elevated p-8 text-foreground">
				<h2 className="text-2xl font-semibold">Collapsing header</h2>
				<p className="mt-2">Scroll the content to reveal more room.</p>
			</header>
		),
		children: (
			<div className="bg-surface text-foreground">
				{items.map((item) => (
					<div key={item} className="border-b border-line p-4">
						{item}
					</div>
				))}
			</div>
		),
	},
} satisfies Meta<typeof NestedScrollView>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const FixedHeaderRemainder: Story = {
	args: {
		scrollableDistance: 260,
		minDistanceToTop: 120,
	},
}
