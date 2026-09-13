import type { Meta, StoryObj } from '@storybook/react-vite'
import { ScalableTag, TagCloud } from './index'
import { Icon } from '../icons/index'

const meta = {
	title: 'Components/ScalableTag',
	component: ScalableTag,
	tags: ['autodocs'],
	parameters: { layout: 'centered' },
	args: { children: 'React', count: 8, href: '#react', prefix: '#' },
	argTypes: {
		prefix: { control: 'text' },
		count: { control: { type: 'number', min: 0 } },
	},
} satisfies Meta<typeof ScalableTag>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Cloud: Story = {
	render: () => (
		<TagCloud aria-label="Topics">
			{[
				{ name: 'React', count: 12 },
				{ name: 'TypeScript', count: 6 },
				{ name: 'Design', count: 3 },
				{ name: 'CSS', count: 2 },
				{ name: 'Travel', count: 1 },
			].map(({ name, count }) => (
				<li key={name}>
					<ScalableTag href={`#${name.toLowerCase()}`} count={count}>
						{name}
					</ScalableTag>
				</li>
			))}
		</TagCloud>
	),
}

export const CustomPrefixes: Story = {
	render: () => (
		<TagCloud aria-label="Custom prefixes">
			<li>
				<ScalableTag
					href="#mentions"
					count={8}
					prefix="@"
					prefixClassName="text-blue-500"
				>
					Mentions
				</ScalableTag>
			</li>
			<li>
				<ScalableTag
					href="#favorites"
					count={5}
					prefix={<Icon icon="star-fill" className="size-3" />}
				>
					Favorites
				</ScalableTag>
			</li>
			<li>
				<ScalableTag href="#plain" count={3} prefix={null}>
					Plain
				</ScalableTag>
			</li>
		</TagCloud>
	),
}
