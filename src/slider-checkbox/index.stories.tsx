import type { Meta, StoryObj } from '@storybook/react-vite'
import type { DiscreteSliderProps } from './slider-checkbox'
import { DiscreteSlider } from './slider-checkbox'

function StringSlider(props: DiscreteSliderProps<string>) {
	return <DiscreteSlider {...props} />
}

const meta = {
	title: 'Components/DiscreteSlider',
	component: StringSlider,
	tags: ['autodocs'],
	parameters: { layout: 'centered' },
	args: {
		'aria-label': 'Transit card',
		values: ['Suica', 'Kitaca', 'Pasmo', 'Icoca'],
	},
} satisfies Meta<typeof StringSlider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: { defaultValueIndex: 1 },
}

export const Empty: Story = {
	args: { values: [] },
}
