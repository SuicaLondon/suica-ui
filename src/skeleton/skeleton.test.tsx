import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Skeleton, type SkeletonTone } from './index'

const gradientClassNameByTone: Record<SkeletonTone, string> = {
	white:
		'sui:bg-[linear-gradient(90deg,color-mix(in_srgb,var(--sui-theme-foreground)_5%,transparent)_20%,color-mix(in_srgb,white_72%,transparent)_50%,color-mix(in_srgb,var(--sui-theme-foreground)_5%,transparent)_80%)]',
	accent:
		'sui:bg-[linear-gradient(90deg,color-mix(in_srgb,var(--sui-theme-foreground)_5%,transparent)_20%,color-mix(in_srgb,var(--sui-theme-accent)_18%,transparent)_50%,color-mix(in_srgb,var(--sui-theme-foreground)_5%,transparent)_80%)]',
	success:
		'sui:bg-[linear-gradient(90deg,color-mix(in_srgb,var(--sui-theme-foreground)_5%,transparent)_20%,color-mix(in_srgb,var(--sui-theme-success)_18%,transparent)_50%,color-mix(in_srgb,var(--sui-theme-foreground)_5%,transparent)_80%)]',
	warning:
		'sui:bg-[linear-gradient(90deg,color-mix(in_srgb,var(--sui-theme-foreground)_5%,transparent)_20%,color-mix(in_srgb,var(--sui-theme-warning)_18%,transparent)_50%,color-mix(in_srgb,var(--sui-theme-foreground)_5%,transparent)_80%)]',
	danger:
		'sui:bg-[linear-gradient(90deg,color-mix(in_srgb,var(--sui-theme-foreground)_5%,transparent)_20%,color-mix(in_srgb,var(--sui-theme-danger)_18%,transparent)_50%,color-mix(in_srgb,var(--sui-theme-foreground)_5%,transparent)_80%)]',
}

describe('Skeleton', () => {
	it('is decorative by default and forwards native props and its ref', () => {
		const ref = createRef<HTMLDivElement>()
		render(
			<Skeleton
				ref={ref}
				data-testid="loading-preview"
				className="sui:h-12 sui:w-48"
			/>,
		)

		const skeleton = screen.getByTestId('loading-preview')
		expect(skeleton).toHaveAttribute('aria-hidden', 'true')
		expect(skeleton).toHaveAttribute('data-tone', 'white')
		expect(skeleton).toHaveClass(
			'sui:animate-skeleton-shimmer',
			'sui:motion-reduce:animate-none',
			gradientClassNameByTone.white,
			'sui:dark:bg-[linear-gradient(90deg,color-mix(in_srgb,var(--sui-theme-foreground)_5%,transparent)_20%,color-mix(in_srgb,white_24%,transparent)_50%,color-mix(in_srgb,var(--sui-theme-foreground)_5%,transparent)_80%)]',
			'sui:bg-[length:200%_100%]',
			'sui:h-12',
			'sui:w-48',
		)
		expect(skeleton).not.toHaveClass(
			'sui:animate-pulse',
			'sui:bg-line-strong',
			gradientClassNameByTone.accent,
		)
		expect(ref.current).toBe(skeleton)
	})

	it.each(
		(['accent', 'success', 'warning', 'danger'] as const).map((tone) => ({
			tone,
			className: gradientClassNameByTone[tone],
		})),
	)('maps the $tone tone to its theme gradient', ({ tone, className }) => {
		render(<Skeleton tone={tone} data-testid={`${tone}-skeleton`} />)

		const skeleton = screen.getByTestId(`${tone}-skeleton`)
		expect(skeleton).toHaveAttribute('data-tone', tone)
		expect(skeleton).toHaveClass(className)
	})
})
