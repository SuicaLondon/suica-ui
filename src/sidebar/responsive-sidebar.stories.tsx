import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '../icons'
import {
	Sidebar,
	SidebarItem,
	SidebarItems,
	SidebarTrigger,
	useResponsiveSidebar,
} from './index'

function ResponsiveSidebarExample() {
	const sidebar = useResponsiveSidebar()

	const navigationItems = [
		{ href: '#posts', label: 'Posts', icon: 'star-fill' as const },
		{ href: '#favourites', label: 'Favourites', icon: 'heart-fill' as const },
	]

	return (
		<div className="flex min-h-96">
			{!sidebar.isDesktop && (
				<SidebarTrigger
					open={sidebar.mobileOpen}
					onOpenChange={sidebar.setMobileOpen}
					label={sidebar.mobileOpen ? 'Close navigation' : 'Open navigation'}
					fixed
				/>
			)}
			<Sidebar
				open={sidebar.open}
				mode={sidebar.mode}
				onOpenChange={sidebar.setOpen}
				label="Responsive navigation"
				closeLabel="Close navigation backdrop"
			>
				<SidebarItems label="Primary links" triggerInset={!sidebar.isDesktop}>
					{navigationItems.map((item) => (
						<SidebarItem
							key={item.href}
							href={item.href}
							icon={<Icon icon={item.icon} />}
						>
							{item.label}
						</SidebarItem>
					))}
				</SidebarItems>
			</Sidebar>
			<main className="flex-1 p-6">
				Resize the canvas across the default md breakpoint (48rem). Mobile open:
				{String(sidebar.mobileOpen)}.
			</main>
		</div>
	)
}

const meta = {
	title: 'Components/Sidebar/Responsive Composition',
	component: ResponsiveSidebarExample,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'useResponsiveSidebar keeps independent desktop and mobile state around one navigation tree. It defaults to the md breakpoint (48rem), closes the mobile surface when entering desktop mode, and exposes mobileOpen for browser theme-color synchronization.',
			},
		},
	},
} satisfies Meta<typeof ResponsiveSidebarExample>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
