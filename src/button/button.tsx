import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'

export type ButtonVariant =
	| 'default'
	| 'destructive'
	| 'outline'
	| 'secondary'
	| 'subtle'
	| 'ghost'
	| 'link'

export type ButtonSize = 'default' | 'xs' | 'sm' | 'lg' | 'icon'

export interface ButtonClassNameOptions {
	variant?: ButtonVariant
	size?: ButtonSize
	className?: string
}

const buttonVariantClassName: Record<ButtonVariant, string> = {
	default:
		'sui:border-accent sui:bg-accent sui:text-surface sui:hover:bg-accent/90',
	destructive:
		'sui:border-danger sui:bg-danger sui:text-surface sui:hover:bg-danger/90',
	outline:
		'sui:border-line-strong sui:bg-surface sui:text-foreground sui:hover:border-accent sui:hover:bg-hover sui:hover:text-accent',
	secondary:
		'sui:border-foreground sui:bg-foreground sui:text-surface sui:hover:bg-foreground/85',
	subtle:
		'sui:border-current sui:bg-transparent sui:text-current sui:hover:bg-current/5',
	ghost:
		'sui:border-transparent sui:bg-transparent sui:text-foreground sui:hover:bg-hover sui:hover:text-accent',
	link:
		'sui:border-transparent sui:bg-transparent sui:text-accent sui:underline-offset-4 sui:hover:underline',
}

const buttonSizeClassName: Record<ButtonSize, string> = {
	default: 'sui:min-h-11 sui:px-4 sui:py-2',
	xs: 'sui:min-h-8 sui:px-2 sui:py-1 sui:text-xs',
	sm: 'sui:min-h-9 sui:px-3 sui:py-1.5 sui:text-xs',
	lg: 'sui:min-h-12 sui:px-6 sui:py-3',
	icon: 'sui:size-11 sui:p-0',
}

const buttonBaseClassName =
	'sui:inline-flex sui:box-border sui:touch-manipulation sui:cursor-pointer sui:appearance-none sui:items-center sui:justify-center sui:gap-2 sui:whitespace-nowrap sui:rounded-control sui:border sui:text-sm sui:font-medium sui:[font-family:var(--sui-theme-font-sans)] sui:transition-[border-color,background-color,color,opacity] sui:duration-150 sui:focus-visible:outline-2 sui:focus-visible:outline-focus sui:focus-visible:outline-offset-2 sui:disabled:cursor-not-allowed sui:disabled:opacity-50 sui:motion-reduce:transition-none sui:[&_svg]:pointer-events-none sui:[&_svg]:size-4 sui:[&_svg]:shrink-0'

export function buttonClassName({
	variant = 'default',
	size = 'default',
	className,
}: ButtonClassNameOptions = {}) {
	return cn(
		buttonBaseClassName,
		buttonVariantClassName[variant],
		buttonSizeClassName[size],
		className,
	)
}

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
	variant?: ButtonVariant
	size?: ButtonSize
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	function Button(
		{
			variant = 'default',
			size = 'default',
			type = 'button',
			className,
			...buttonProps
		},
		ref,
	) {
		return (
			<button
				ref={ref}
				data-slot="button"
				data-variant={variant}
				data-size={size}
				type={type}
				className={buttonClassName({ variant, size, className })}
				{...buttonProps}
			/>
		)
	},
)
