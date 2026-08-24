import { createElement } from 'react'
import {
	Alert,
	Button,
	Card,
	Field,
	Input,
	InputGroup,
	LoadingIndicator,
	Overlay,
	Select,
	Sidebar,
	SidebarItem,
	SidebarItems,
	Skeleton,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableControl,
	TableHead,
	TableHeader,
	TableRow,
	type ButtonProps,
	type FieldProps,
	type SpinnerProps,
	type SkeletonProps,
	type SkeletonTone,
	type SidebarMode,
	type SwitchProps,
	type TableControlProps,
	type TablePagination,
} from 'suica-ui'
import 'suica-ui/styles.css'

const switchProps = {
	label: 'Notifications',
	name: 'notifications',
} satisfies SwitchProps

void switchProps

const sidebarMode = 'persistent' satisfies SidebarMode

const persistentSidebar = createElement(
	Sidebar,
	{
		open: true,
		mode: sidebarMode,
		onOpenChange: () => undefined,
		label: 'Dashboard navigation',
		closeLabel: 'Close navigation',
	},
	createElement(
		SidebarItems,
		{ label: 'Dashboard links', triggerInset: false },
		createElement(SidebarItem, { href: '/dashboard' }, 'Dashboard'),
	),
)

void persistentSidebar

const buttonProps = {
	variant: 'outline',
	size: 'sm',
} satisfies ButtonProps

const fieldProps = {
	label: 'Title',
	error: 'A title is required.',
	children: createElement(Input, { name: 'title' }),
} satisfies FieldProps

const spinnerProps = {
	label: 'Upload progress',
	percentage: 64,
} satisfies SpinnerProps

const skeletonTone = 'white' satisfies SkeletonTone

const skeletonProps = {
	tone: skeletonTone,
} satisfies SkeletonProps

const tablePagination = {
	page: 1,
	pageSize: 25,
	total: 42,
	totalPages: 2,
} satisfies TablePagination

const tableControlProps = {
	'aria-label': 'Post pages',
	itemLabel: 'posts',
	pagination: tablePagination,
	onPaginationChange: () => undefined,
} satisfies TableControlProps

void buttonProps
void fieldProps
void spinnerProps
void skeletonProps
void tableControlProps
void [
	Alert,
	Button,
	Card,
	Field,
	Input,
	InputGroup,
	LoadingIndicator,
	Overlay,
	Select,
	Sidebar,
	SidebarItem,
	SidebarItems,
	Skeleton,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableControl,
	TableHead,
	TableHeader,
	TableRow,
]
