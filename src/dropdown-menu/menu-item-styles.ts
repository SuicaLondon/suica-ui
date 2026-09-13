import { cn } from '../cn.js'
export const dropdownMenuItemClassName = cn(
	'flex min-h-10 items-center rounded-control px-3 py-2',
	'text-sm text-foreground hover:bg-hover hover:text-accent',
	'focus-visible:bg-hover focus-visible:text-accent',
	'focus-visible:outline-2 focus-visible:outline-focus',
	'font-inherit focus-visible:-outline-offset-2',
)
