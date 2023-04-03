import React from 'react'
import { PlusCircleFilled } from '@ant-design/icons'
import type { Meta, StoryObj } from '@storybook/react'

import Input from '.'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Input> = {
    title: 'Example/Input',
    component: Input,
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/7.0/react/writing-docs/docs-page
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {},
    decorators: [
        (Story) => (
            <div className="w-1/3 mx-auto">
                <Story />
            </div>
        ),
    ],
}

export default meta
type Story = StoryObj<typeof Input>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

export const WithPlaceholder: Story = {
    args: {
        placeholder: 'Enter your name',
    },
}

export const WithPrefix: Story = {
    args: {
        prefix: PlusCircleFilled,
    },
}

export const Disabled: Story = {
    args: {
        placeholder: 'Enter your name',
        disabled: true,
    },
}
