'use client'

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

export interface NestedScrollViewProps extends Omit<
	ComponentPropsWithoutRef<'div'>,
	'children'
> {
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
				'relative h-dvh w-full overflow-hidden overscroll-none',
				className,
			)}
			{...props}
		>
			{header}
			<div
				{...scrollerProps}
				ref={scrollerRef}
				className={cn(
					'absolute inset-x-0 bottom-0 z-20 overflow-auto',
					'transition-scroll-position duration-150 motion-reduce:transition-none',
					'scrollbar-none',
					scrollerClassName,
				)}
				style={{
					top: distanceToTop,
					height: `calc(100dvh - ${distanceToTop}px)`,
				}}
				onScroll={handleScroll}
			>
				<div
					className={cn('w-full', contentClassName)}
					style={{ paddingBottom: Math.max(0, extraHeight) }}
				>
					{children}
				</div>
			</div>
		</div>
	)
})
