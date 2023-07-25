import type { Meta, StoryObj } from "@storybook/react";
import { AddItemForm } from "components/AddItemForm/AddItemForm";
import { action } from "@storybook/addon-actions";

const meta: Meta<typeof AddItemForm> = {
  title: "TODOLIST/AddItemForm",
  component: AddItemForm,

  tags: ["autodocs"],

  argTypes: {
    addItem: {
      description: "Button clicked inside form",
      action: "clicked",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AddItemForm>;

export const AddItemFormStory: Story = {
  args: {
    addItem: action("Clicked inside form"),
  },
};
