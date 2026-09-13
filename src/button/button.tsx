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
	default: 'border-accent bg-accent text-surface hover:bg-accent/90',
	destructive: 'border-danger bg-danger text-surface hover:bg-danger/90',
	outline: cn(
		'border-line-strong bg-surface text-foreground',
		'hover:border-accent hover:bg-hover hover:text-accent',
	),
	secondary:
		'border-foreground bg-foreground text-surface hover:bg-foreground/85',
	subtle: 'border-current bg-transparent text-current hover:bg-current/5',
	ghost: cn(
		'border-transparent bg-transparent text-foreground hover:bg-hover',
		'hover:text-accent',
	),
	link:
		'border-transparent bg-transparent text-accent underline-offset-4 hover:underline',
}

const buttonSizeClassName: Record<ButtonSize, string> = {
	default: 'min-h-11 px-4 py-2',
	xs: 'min-h-8 px-2 py-1 text-xs',
	sm: 'min-h-9 px-3 py-1.5 text-xs',
	lg: 'min-h-12 px-6 py-3',
	icon: 'size-11 p-0',
}

const buttonBaseClassName = cn(
	'box-border inline-flex cursor-pointer touch-manipulation',
	'appearance-none items-center justify-center gap-2',
	'rounded-control border text-sm font-medium whitespace-nowrap',
	'font-sans',
	'transition-button-colors duration-150',
	'focus-visible:outline-2 focus-visible:outline-focus',
	'focus-visible:outline-offset-2 disabled:cursor-not-allowed',
	'disabled:opacity-50 motion-reduce:transition-none',
	'button-icons',
)

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
				className={buttonClassName({ variant, size, className: className })}
				{...buttonProps}
			/>
		)
	},
)
