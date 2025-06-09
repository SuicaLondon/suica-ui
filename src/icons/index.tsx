import { lazy as _lazy, HTMLAttributes, Suspense, useMemo } from 'react'
import { twMerge } from 'tailwind-merge'

function lazy(importFn: Function) {
	return _lazy(async () => {
		const icon = await importFn()
		if (icon?.ReactComponent) {
			return { default: icon.ReactComponent }
		}

		return icon
	})
}

const icons = {
	star: lazy(async () => import('./assets/icons/star.svg')),
	'star-fill': lazy(async () => import('./assets/icons/star.fill.svg')),
	heart: lazy(async () => import('./assets/icons/heart.svg')),
	'heart-fill': lazy(async () => import('./assets/icons/heart.fill.svg')),
} as const

export type IconProps = HTMLAttributes<HTMLDivElement> & {
	icon: keyof typeof icons
	className?: string
}

export function Icon({ icon, className }: IconProps) {
	const Svg = useMemo(() => icons[icon], [icon])

	if (!Svg) return null

	return (
		<Suspense fallback={null}>
			<Svg
				className={twMerge(
					'fill-primary-dark flex-center h-6 w-6 object-contain dark:fill-primary-gray',
					className,
				)}
			/>
		</Suspense>
	)
}
