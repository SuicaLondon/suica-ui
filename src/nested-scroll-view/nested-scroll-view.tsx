import {
	HTMLProps,
	ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import { twMerge } from 'tailwind-merge'

export interface INestedScrollViewProps {
	scrollableDistance: number
	minDistanceToTop: number
	extraHeight?: number
	header: ReactNode
	children: ReactNode
	classNames?: {
		container?: HTMLProps<HTMLElement>['className']
		content?: HTMLProps<HTMLElement>['className']
	}
}

export function NestedScrollView({
	scrollableDistance,
	minDistanceToTop,
	header,
	children,
	classNames,
	extraHeight = 0,
}: INestedScrollViewProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const isTouchingRef = useRef(false)
	const distanceToTopRef = useRef(scrollableDistance)
	const [isScrolling, setIsScrolling] = useState(false)
	const distanceToTop = distanceToTopRef.current

	useEffect(() => {
		const container = containerRef.current
		if (!container) {
			return
		}
		let timer: NodeJS.Timeout | null = null

		function onScrollEnd() {
			if (!container) {
				return
			}
			if (timer !== null) {
				clearTimeout(timer)
			}
			timer = setTimeout(function () {
				if (isTouchingRef.current) {
					return
				}
				if (!container) {
					return
				}
				const scrollTop = container.scrollTop
				if (scrollTop > scrollableDistance) {
					distanceToTopRef.current = 0
				} else {
					distanceToTopRef.current = scrollableDistance - container.scrollTop
				}
				setIsScrolling(false)
			}, 50)
		}
		container.addEventListener('scroll', onScrollEnd)
		return () => {
			if (container) {
				container.removeEventListener('scroll', onScrollEnd)
			}
			if (timer) {
				clearTimeout(timer)
				timer = null
			}
		}
	}, [scrollableDistance])

	const handleTouchStart = useCallback(() => {
		if (!containerRef.current) {
			return
		}
		distanceToTopRef.current = scrollableDistance - containerRef.current.scrollTop
		setIsScrolling(true)
		isTouchingRef.current = true
	}, [scrollableDistance])

	const handleTouchEnd = useCallback(() => {
		isTouchingRef.current = false
	}, [])

	return (
		<div
			className={twMerge(
				'w-screen h-screen relative inset-0 no-scrollbar',
				'overflow-y-hidden overflow-x-scroll overscroll-none',
				classNames?.container,
			)}
		>
			{header}
			<div
				ref={containerRef}
				className="bottom-0 absolute z-20 h-full w-full overflow-auto no-scrollbar"
				style={{
					marginTop: isScrolling ? 0 : distanceToTop,
					height: `calc(100vh - ${minDistanceToTop}px)`,
					top: scrollableDistance,
				}}
				onTouchStart={handleTouchStart}
				onTouchEnd={handleTouchEnd}
			>
				<div
					className="pointer-events-none"
					style={{
						height: isScrolling
							? scrollableDistance
							: scrollableDistance - distanceToTop,
					}}
				/>
				<div
					className={twMerge('w-full', classNames?.content)}
					style={{ paddingBottom: extraHeight }}
				>
					{children}
				</div>
			</div>
		</div>
	)
}
