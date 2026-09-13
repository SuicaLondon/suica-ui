import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Badge, type BadgeVariant } from '../badge/badge'
import { Button } from '../button/button'
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableHeader,
	TableRow,
} from './table'
import { TableControl, type TablePagination } from './table-control'

const meta = {
	title: 'Components/Table',
	component: Table,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Use native Table primitives with TableContainer when horizontal scrolling is possible. TableControl is a separate client component for pagination, busy state, page size, and live summaries; routing and data fetching remain in the consumer.',
			},
		},
	},
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

type StoryPostStatus = 'Published' | 'Draft' | 'Scheduled'

interface StoryPost {
	title: string
	status: StoryPostStatus
	views: string
}

const badgeVariantByStatus: Record<StoryPostStatus, BadgeVariant> = {
	Published: 'success',
	Draft: 'outline',
	Scheduled: 'warning',
}

const posts: StoryPost[] = [
	{ title: 'Spring update', status: 'Published', views: '4,820' },
	{ title: 'A week in London', status: 'Draft', views: '—' },
	{ title: 'Building Suica UI', status: 'Scheduled', views: '1,240' },
]

const initialPagination: TablePagination = {
	page: 2,
	pageSize: 25,
	total: 1042,
	totalPages: 42,
}

function DashboardTableStory() {
	const [pagination, setPagination] = useState(initialPagination)

	return (
		<div className="story-viewport grid w-230 gap-3">
			<TableContainer
				aria-label="Scrollable recent posts"
				className="border border-line bg-surface-elevated"
			>
				<Table aria-label="Recent posts">
					<TableHeader>
						<TableRow className="bg-hover hover:bg-hover">
							<TableHead className="min-w-72 px-4">Post</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">Views</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{posts.map((post) => (
							<TableRow key={post.title}>
								<TableCell className="px-4 font-medium">{post.title}</TableCell>
								<TableCell>
									<Badge size="sm" variant={badgeVariantByStatus[post.status]}>
										{post.status}
									</Badge>
								</TableCell>
								<TableCell className="text-right">{post.views}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<TableControl
				aria-label="Post pages"
				itemLabel="posts"
				pagination={pagination}
				pageSizeOptions={[10, 25, 50, 100]}
				onPaginationChange={(nextPagination) => {
					setPagination((currentPagination) => ({
						...currentPagination,
						...nextPagination,
					}))
				}}
				actions={
					<Button size="xs" variant="outline">
						Refresh
					</Button>
				}
			/>
		</div>
	)
}

export const Dashboard: Story = {
	render: () => <DashboardTableStory />,
}
