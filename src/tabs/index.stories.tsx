import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Tabs } from "./tabs";
import { ALIGN_DIRECTION } from "./tab.type";

const meta = {
  title: "Example/Tabs",
  component: Tabs,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  argTypes: {},
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const defaultTabs: Story = {
  name: "Default Tabs",
  args: {
    tabs: [
      { id: "suica", label: "Suica" },
      { id: "kitaca", label: "Kitaca" },
      { id: "pasmo", label: "Pasmo" },
      { id: "icoca", label: "Icoca" },
    ],
    activeTabId: "suica",
  },
};
export const defaultTabsVertical: Story = {
  name: "Default Tabs Vertical",
  args: {
    tabs: [
      { id: "suica", label: "Suica" },
      { id: "kitaca", label: "Kitaca" },
      { id: "pasmo", label: "Pasmo" },
      { id: "icoca", label: "Icoca" },
    ],
    activeTabId: "suica",
    direction: ALIGN_DIRECTION.VERTICAL,
  },
};

export const ActionTabs: Story = {
  name: "Action Tabs",
  args: {
    tabs: [
      { id: "suica", label: "Suica" },
      { id: "kitaca", label: "Kitaca" },
      { id: "pasmo", label: "Pasmo" },
      { id: "icoca", label: "Icoca" },
    ],
    activeTabId: "suica",
  },
  render: function Render(args) {
    const [selectedTab, setSelectedTab] = useState<string>(args.activeTabId);

    function onChange({ id }: { id: string }) {
      setSelectedTab(id);
    }

    return <Tabs {...args} activeTabId={selectedTab} onChange={onChange} />;
  },
};
export const ActionTabsVertical: Story = {
  name: "Action Tabs Vertical",
  args: {
    tabs: [
      { id: "suica", label: "Suica" },
      { id: "kitaca", label: "Kitaca" },
      { id: "pasmo", label: "Pasmo" },
      { id: "icoca", label: "Icoca" },
    ],
    activeTabId: "suica",
    direction: ALIGN_DIRECTION.VERTICAL,
  },
  render: function Render(args) {
    const [selectedTab, setSelectedTab] = useState<string>(args.activeTabId);

    function onChange({ id }: { id: string }) {
      setSelectedTab(id);
    }

    return <Tabs {...args} activeTabId={selectedTab} onChange={onChange} />;
  },
};
