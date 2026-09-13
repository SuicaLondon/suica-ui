import {
	forwardRef,
	type AriaRole,
	type ComponentPropsWithoutRef,
	type ReactNode,
} from 'react'
import { cn } from '../cn.js'

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger'

export interface AlertProps extends Omit<
	ComponentPropsWithoutRef<'div'>,
	'title'
> {
	variant?: AlertVariant
	icon?: ReactNode
	title?: ReactNode
	action?: ReactNode
}

const alertClassNameByVariant: Record<AlertVariant, string> = {
	info: 'border-line-strong bg-hover',
	success: 'border-success-line bg-success-soft',
	warning: 'border-warning-line bg-warning-soft',
	danger: 'border-danger-line bg-danger-soft',
}

const alertAccentClassNameByVariant: Record<AlertVariant, string> = {
	info: 'text-accent',
	success: 'text-success',
	warning: 'text-warning',
	danger: 'text-danger',
}

const alertRoleByVariant: Record<AlertVariant, AriaRole> = {
	info: 'status',
	success: 'status',
	warning: 'alert',
	danger: 'alert',
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
	{ variant = 'info', icon, title, action, children, className, role, ...props },
	ref,
) {
	return (
		<div
			ref={ref}
			data-slot="alert"
			data-variant={variant}
			role={role ?? alertRoleByVariant[variant]}
			className={cn(
				'box-border flex w-full items-center gap-3 rounded-panel',
				'border p-3 text-sm leading-6 text-foreground',
				'font-sans',
				alertClassNameByVariant[variant],
				className,
			)}
			{...props}
		>
			{icon !== undefined && (
				<span
					data-slot="alert-icon"
					className={cn(
						'grid size-5 shrink-0 place-items-center leading-none',
						'alert-icon',
						alertAccentClassNameByVariant[variant],
					)}
				>
					{icon}
				</span>
			)}
			<div data-slot="alert-content" className="min-w-0 flex-1">
				{title !== undefined && (
					<p data-slot="alert-title" className="m-0 font-semibold text-current">
						{title}
					</p>
				)}
				{children !== undefined && (
					<div
						data-slot="alert-description"
						className={cn('text-muted', {
							'mt-1': title !== undefined,
						})}
					>
						{children}
					</div>
				)}
			</div>
			{action !== undefined && (
				<div
					data-slot="alert-action"
					className={cn('ms-auto shrink-0', alertAccentClassNameByVariant[variant])}
				>
					{action}
				</div>
			)}
		</div>
	)
})
