import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn.js'
import { CardContent } from './card-content.js'
import { CardDescription } from './card-description.js'
import { CardFooter } from './card-footer.js'
import { CardHeader } from './card-header.js'
import { CardTitle } from './card-title.js'

const CardRoot = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
	function Card({ className, ...divProps }, ref) {
		return (
			<div
				ref={ref}
				data-slot="card"
				className={cn(
					'sui:box-border sui:rounded-panel sui:border sui:border-line sui:bg-surface-elevated sui:text-foreground sui:shadow-sm sui:font-[family-name:var(--sui-theme-font-sans)]',
					className,
				)}
				{...divProps}
			/>
		)
	},
)

export const Card = Object.assign(CardRoot, {
	Header: CardHeader,
	Title: CardTitle,
	Description: CardDescription,
	Content: CardContent,
	Footer: CardFooter,
})

export { CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
export type { CardTitleLevel, CardTitleProps } from './card-title.js'
