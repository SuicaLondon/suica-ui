import { forwardRef, type ComponentPropsWithoutRef } from 'react'

/** Simulates a router that runs consumer handlers before intercepting navigation. */
export const RouterLink = forwardRef<
	HTMLAnchorElement,
	ComponentPropsWithoutRef<'a'> & { navigate: (href: string) => void }
>(function RouterLink({ navigate, onClick, ...props }, ref) {
	return (
		<a
			{...props}
			ref={ref}
			onClick={(event) => {
				onClick?.(event)
				if (
					event.defaultPrevented ||
					event.metaKey ||
					event.ctrlKey ||
					event.shiftKey ||
					event.altKey ||
					event.button !== 0 ||
					props.target === '_blank'
				)
					return
				event.preventDefault()
				navigate(event.currentTarget.getAttribute('href') ?? '')
			}}
		/>
	)
})
