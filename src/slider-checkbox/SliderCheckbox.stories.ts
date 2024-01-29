import type { Meta, StoryObj } from "@storybook/react";

import { SliderCheckbox } from "./SliderCheckbox";

const meta = {
  title: "Example/SliderCheckbox",
  component: SliderCheckbox,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof SliderCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Test1: Story = {};

export const Test2: Story = {};
