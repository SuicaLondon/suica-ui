import React, { ChangeEvent } from "react";

export type SliderCheckboxProps<T> = {
  selectedIndex: number;
  values: T[];
  onChecked: (value: T, index: number) => void;
};

export function SliderCheckbox<T>({
  selectedIndex,
  values,
  onChecked,
}: SliderCheckboxProps<T>) {
  return (
    <input
      type="range"
      min={0}
      max={values.length - 1}
      value={selectedIndex}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        const index = parseInt(e.target.value);
        onChecked(values[index], index);
      }}
    />
  );
}
