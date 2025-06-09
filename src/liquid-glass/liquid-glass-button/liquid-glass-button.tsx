import { memo } from 'react'
import { cn } from '../../cn'

export interface ILiquidGlassButtonProps {
	onClick: () => void
	children: React.ReactNode
}
/// This is a failed version of the liquid glass button.
export const LiquidGlassButton = memo(function LiquidGlassButton({
	onClick,
	children,
}: ILiquidGlassButtonProps) {
	return (
		<button
			className={cn(
				'rounded-2xl',
				'border-4 border-white/20 backdrop-blur-2xl hover:border-white/30',
				'shadow-md hover:shadow-lg',
			)}
			onClick={onClick}
		>
			<div
				className={cn(
					'rounded-xl p-4',
					'flex flex-col items-center justify-center gap-2',
					'bg-white/60 backdrop-blur-sm',
					'fill-gray-900 text-gray-900 hover:fill-blue-300 hover:text-blue-300',
				)}
			>
				{children}
			</div>
		</button>
	)
})
