import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "@storybook/preview-api";
import { SliderCheckbox, SliderCheckboxProps } from "./SliderCheckbox";
import { useState } from "react";

const meta = {
  title: "Example/SliderCheckbox",
  component: SliderCheckbox,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  argTypes: { onChecked: { action: "clicked" } },
} satisfies Meta<typeof SliderCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IntList: Story = {
  name: "Int list",
  args: {
    selectedIndex: 0,
    values: [1, 2, 3],
  },
  render: function Render(args) {
    const values: number[] = args.values as number[];
    const [selectedIndex, setSelectedIndex] = useState<number>(
      args.selectedIndex
    );

    function onChange(value: number, index: number) {
      setSelectedIndex(index);
    }

    return (
      <SliderCheckbox
        values={values}
        selectedIndex={selectedIndex}
        onChecked={onChange}
      />
    );
  },
};

export const StringList: Story = {
  name: "Int list",
  args: {
    selectedIndex: 1,
    values: ["Penguin 1", "Penguin 2", "Penguin 3", "Penguin 4"],
  },
  render: function Render(args) {
    const values: string[] = args.values as string[];
    const [selectedIndex, setSelectedIndex] = useState<number>(
      args.selectedIndex
    );

    function onChange(value: string, index: number) {
      setSelectedIndex(index);
    }

    return (
      <SliderCheckbox
        values={values}
        selectedIndex={selectedIndex}
        onChecked={onChange}
      />
    );
  },
};
