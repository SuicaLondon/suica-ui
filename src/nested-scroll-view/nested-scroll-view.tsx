import {
	HTMLProps,
	ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import { twMerge } from 'tailwind-merge'

const ScrollBy = {
	Touch: 'Touch',
	Scroll: 'Scroll',
} as const
type ScrollByKey = (typeof ScrollBy)[keyof typeof ScrollBy]
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
	const scrollByRef = useRef<ScrollByKey | null>(null)
	const distanceToTopRef = useRef(scrollableDistance)
	const [isScrolling, setIsScrolling] = useState(false)
	const distanceToTop = distanceToTopRef.current

	useEffect(() => {
		const container = containerRef.current
		if (!container) {
			return
		}
		let timer: NodeJS.Timeout | null = null

		function onScroll() {
			if (!container) {
				return
			}
			// Desktop does not have touch event to trigger setIsScrolling(true)
			if (!isScrolling && scrollByRef.current !== ScrollBy.Touch) {
				if (!containerRef.current) {
					return
				}
				distanceToTopRef.current =
					scrollableDistance - containerRef.current.scrollTop
				setIsScrolling(true)
				scrollByRef.current = ScrollBy.Scroll
			}
			if (timer !== null) {
				clearTimeout(timer)
			}
			timer = setTimeout(function () {
				if (scrollByRef.current === ScrollBy.Touch) {
					return
				} else if (scrollByRef.current === ScrollBy.Scroll) {
					scrollByRef.current = null
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
		container.addEventListener('scroll', onScroll)
		return () => {
			if (container) {
				container.removeEventListener('scroll', onScroll)
			}
			if (timer) {
				clearTimeout(timer)
				timer = null
			}
		}
	}, [scrollableDistance, isScrolling])

	const handleTouchStart = useCallback(() => {
		if (!containerRef.current) {
			return
		}
		distanceToTopRef.current = scrollableDistance - containerRef.current.scrollTop
		setIsScrolling(true)
		scrollByRef.current = ScrollBy.Touch
	}, [scrollableDistance])

	const handleTouchEnd = useCallback(() => {
		scrollByRef.current = null
	}, [])

	return (
		<div
			className={twMerge(
				'no-scrollbar relative inset-0 h-screen w-screen',
				'overflow-y-hidden overflow-x-scroll overscroll-none',
				classNames?.container,
			)}
		>
			{header}
			<div
				ref={containerRef}
				className="no-scrollbar absolute bottom-0 z-20 h-full w-full overflow-auto"
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
