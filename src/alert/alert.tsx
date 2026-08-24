import {
	forwardRef,
	type AriaRole,
	type ComponentPropsWithoutRef,
	type ReactNode,
} from 'react'
import { cn } from '../cn.js'

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger'

export interface AlertProps
	extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
	variant?: AlertVariant
	icon?: ReactNode
	title?: ReactNode
	action?: ReactNode
}

const alertClassNameByVariant: Record<AlertVariant, string> = {
	info: 'sui:border-line-strong sui:bg-hover',
	success: 'sui:border-success-line sui:bg-success-soft',
	warning: 'sui:border-warning-line sui:bg-warning-soft',
	danger: 'sui:border-danger-line sui:bg-danger-soft',
}

const alertAccentClassNameByVariant: Record<AlertVariant, string> = {
	info: 'sui:text-accent',
	success: 'sui:text-success',
	warning: 'sui:text-warning',
	danger: 'sui:text-danger',
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
				'sui:flex sui:w-full sui:box-border sui:items-center sui:gap-3 sui:rounded-panel sui:border sui:p-3 sui:text-sm sui:leading-6 sui:text-foreground sui:font-[family-name:var(--sui-theme-font-sans)]',
				alertClassNameByVariant[variant],
				className,
			)}
			{...props}
		>
			{icon !== undefined ? (
				<span
					data-slot="alert-icon"
					className={cn(
						'sui:grid sui:size-5 sui:shrink-0 sui:place-items-center sui:leading-none sui:[&>svg]:size-5',
						alertAccentClassNameByVariant[variant],
					)}
				>
					{icon}
				</span>
			) : null}
			<div data-slot="alert-content" className="sui:min-w-0 sui:flex-1">
				{title !== undefined ? (
					<p
						data-slot="alert-title"
						className="sui:m-0 sui:font-semibold sui:text-current"
					>
						{title}
					</p>
				) : null}
				{children !== undefined ? (
					<div
						data-slot="alert-description"
						className={cn('sui:text-muted', {
							'sui:mt-1': title !== undefined,
						})}
					>
						{children}
					</div>
				) : null}
			</div>
			{action !== undefined ? (
				<div
					data-slot="alert-action"
					className={cn(
						'sui:ms-auto sui:shrink-0',
						alertAccentClassNameByVariant[variant],
					)}
				>
					{action}
				</div>
			) : null}
		</div>
	)
})
