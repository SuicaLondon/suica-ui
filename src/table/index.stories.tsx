import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Badge, type BadgeVariant } from '../badge/badge'
import { Button } from '../button/button'
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableControl,
	TableHead,
	TableHeader,
	type TablePagination,
	TableRow,
} from './table'

const meta = {
	title: 'Components/Table',
	component: Table,
	tags: ['autodocs'],
	parameters: { layout: 'centered' },
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
		<div
			style={{
				display: 'grid',
				gap: 12,
				width: 'min(920px, calc(100vw - 32px))',
			}}
		>
			<TableContainer
				aria-label="Scrollable recent posts"
				className="sui:border-line sui:bg-surface-elevated sui:border"
			>
				<Table aria-label="Recent posts">
					<TableHeader>
						<TableRow className="sui:bg-hover sui:hover:bg-hover">
							<TableHead className="sui:px-4" style={{ minWidth: 288 }}>
								Post
							</TableHead>
							<TableHead>Status</TableHead>
							<TableHead style={{ textAlign: 'right' }}>Views</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{posts.map((post) => (
							<TableRow key={post.title}>
								<TableCell className="sui:px-4" style={{ fontWeight: 500 }}>
									{post.title}
								</TableCell>
								<TableCell>
									<Badge size="sm" variant={badgeVariantByStatus[post.status]}>
										{post.status}
									</Badge>
								</TableCell>
								<TableCell style={{ textAlign: 'right' }}>{post.views}</TableCell>
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
