import cn from 'classnames'
import { ChangeEvent, HTMLAttributes } from 'react'

export interface SliderCheckboxProps<T>
  extends HTMLAttributes<HTMLButtonElement> {
  selectedIndex: number
  values: T[]
  onChecked: (value: T, index: number) => void
}

export function SliderCheckbox<T>({
  selectedIndex,
  values,
  onChecked,
}: SliderCheckboxProps<T>) {
  return (
    <input
      type="range"
      className={cn(
        'h-4 m-1 appearance-none bg-transparent cursor-pointer disabled:opacity-50 disabled:pointer-events-none focus:outline-none',
        '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:-mt-1 [&::-webkit-slider-thumb]:rounded-full',
        '[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-slider-thumb',
        '[&::-webkit-slider-runnable-track]:w-full [&::-webkit-slider-runnable-track]:rounded-full',
        '[&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:bg-gray-800',
        '[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full',
        '[&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-primary-dart',
        '[&::-moz-range-track]:w-full [&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full',
        '[&::-moz-range-track]:bg-gray-800'
      )}
      min={0}
      max={values.length - 1}
      value={selectedIndex}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        const index = parseInt(e.target.value)
        onChecked(values[index], index)
      }}
    />
  )
}
