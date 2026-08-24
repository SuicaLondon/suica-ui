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
			<header
				style={{
					background: '#1e2123',
					color: 'white',
					height: 288,
					padding: 32,
				}}
			>
				<h2 style={{ fontSize: 24, fontWeight: 600 }}>Collapsing header</h2>
				<p style={{ marginTop: 8 }}>Scroll the content to reveal more room.</p>
			</header>
		),
		children: (
			<div style={{ background: 'white' }}>
				{items.map((item) => (
					<div key={item} style={{ borderBottom: '1px solid #e5e7eb', padding: 16 }}>
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
