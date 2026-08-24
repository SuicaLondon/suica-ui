import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from '../input/index'
import { InputGroup, InputGroupAddon } from './index'
import { SearchIcon } from './search-icon'

const meta = {
	title: 'Forms/InputGroup',
	component: InputGroup,
	tags: ['autodocs'],
	parameters: { layout: 'centered' },
} satisfies Meta<typeof InputGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Prefix: Story = {
	render: () => (
		<InputGroup className="sui:w-[28rem] sui:max-w-full">
			<InputGroupAddon>/blogs/</InputGroupAddon>
			<Input aria-label="Post slug" placeholder="my-post" />
		</InputGroup>
	),
}

export const Search: Story = {
	render: () => (
		<InputGroup className="sui:w-[28rem] sui:max-w-full">
			<InputGroupAddon aria-hidden="true" className="sui:pr-2">
				<SearchIcon />
			</InputGroupAddon>
			<Input type="search" aria-label="Search posts" placeholder="Search posts" />
		</InputGroup>
	),
}

export const Invalid: Story = {
	render: () => (
		<InputGroup className="sui:w-[28rem] sui:max-w-full">
			<InputGroupAddon>/blogs/</InputGroupAddon>
			<Input aria-label="Post slug" aria-invalid="true" defaultValue="taken" />
		</InputGroup>
	),
}
