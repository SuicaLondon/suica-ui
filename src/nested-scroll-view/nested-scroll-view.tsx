import {
	forwardRef,
	useEffect,
	useRef,
	useState,
	type ComponentPropsWithoutRef,
	type ReactNode,
	type Ref,
	type UIEvent,
} from 'react'
import { cn } from '../cn.js'

export interface NestedScrollViewProps
	extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	scrollableDistance: number
	minDistanceToTop: number
	extraHeight?: number
	header: ReactNode
	children: ReactNode
	scrollerClassName?: string
	contentClassName?: string
	scrollerProps?: Omit<
		ComponentPropsWithoutRef<'div'>,
		'className' | 'children' | 'onScroll' | 'style'
	>
	scrollerRef?: Ref<HTMLDivElement>
}

export const NestedScrollView = forwardRef<
	HTMLDivElement,
	NestedScrollViewProps
>(function NestedScrollView(
	{
		scrollableDistance,
		minDistanceToTop,
		extraHeight = 0,
		header,
		children,
		className,
		scrollerClassName,
		contentClassName,
		scrollerProps,
		scrollerRef,
		...props
	},
	ref,
) {
	const minimumTop = Math.max(0, minDistanceToTop)
	const expandedTop = Math.max(minimumTop, scrollableDistance)
	const [scrollTop, setScrollTop] = useState(0)
	const distanceToTop = Math.max(minimumTop, expandedTop - scrollTop)
	const animationFrameRef = useRef<number | null>(null)

	useEffect(() => {
		return () => {
			if (animationFrameRef.current !== null) {
				cancelAnimationFrame(animationFrameRef.current)
			}
		}
	}, [])

	function handleScroll(event: UIEvent<HTMLDivElement>) {
		const scrollTop = event.currentTarget.scrollTop
		if (animationFrameRef.current !== null) {
			cancelAnimationFrame(animationFrameRef.current)
		}

		animationFrameRef.current = requestAnimationFrame(() => {
			setScrollTop(Math.max(0, scrollTop))
			animationFrameRef.current = null
		})
	}

	return (
		<div
			ref={ref}
			className={cn(
				'sui:relative sui:h-dvh sui:w-full sui:overflow-hidden sui:overscroll-none sui:[scrollbar-width:none] sui:[&::-webkit-scrollbar]:hidden',
				className,
			)}
			{...props}
		>
			{header}
			<div
				{...scrollerProps}
				ref={scrollerRef}
				className={cn(
					'sui:absolute sui:inset-x-0 sui:bottom-0 sui:z-20 sui:overflow-auto sui:transition-[top,height] sui:duration-150 sui:motion-reduce:transition-none sui:[scrollbar-width:none] sui:[&::-webkit-scrollbar]:hidden',
					scrollerClassName,
				)}
				style={{
					top: distanceToTop,
					height: `calc(100dvh - ${distanceToTop}px)`,
				}}
				onScroll={handleScroll}
			>
				<div
					className={cn('sui:w-full', contentClassName)}
					style={{ paddingBottom: Math.max(0, extraHeight) }}
				>
					{children}
				</div>
			</div>
		</div>
	)
})
