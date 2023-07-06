import type {Meta, StoryObj} from '@storybook/react';
import {action} from '@storybook/addon-actions'
import {EditableSpan} from "../components/EditableSpan/EditableSpan"


const meta: Meta<typeof EditableSpan> = {
    title: 'TODOLIST/EditableSpan',
    component: EditableSpan,

    tags: ['autodocs'],
    argTypes: {
        value: {
            description: 'Start value empty. Add value push button set string.'
        }
 

    },
    args: {
        onChange: action("Change value editable span"),
        value: "HTML"
    }
};

export default meta;
type Story = StoryObj<typeof EditableSpan>;
export const EditableSpanStory: Story = {};



