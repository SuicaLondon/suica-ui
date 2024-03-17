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
}: INestedScrollViewProps) {
	const containerRef = useRef<HTMLDivElement>(null)
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
				console.log('finished')
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
	}, [scrollableDistance])
	console.log(classNames)
	return (
		<div
			ref={containerRef}
			className={twMerge(
				'w-screen h-screen overflow-y-hidden overflow-x-scroll fixed bottom-0',
				classNames?.container,
			)}
		>
			{header}
			<div
				className="bottom-0 relative z-20 w-full overflow-auto"
				style={{
					marginTop: isScrolling ? 0 : distanceToTop,
					height: `calc(100vh - ${minDistanceToTop}px)`,
					top: -distanceToTop,
				}}
				onTouchStart={handleTouchStart}
			>
				<div
					style={{
						height: isScrolling
							? scrollableDistance
							: scrollableDistance - distanceToTop,
					}}
				></div>
				<div className={twMerge('w-full', classNames?.content)}>{children}</div>
			</div>
		</div>
	)
}
