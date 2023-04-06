import type { Meta, StoryObj } from '@storybook/react'

import Button from '.'
import * as Icons from '@heroicons/react/24/solid'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Button> = {
    title: 'Form/Button',
    component: Button,
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/7.0/react/writing-docs/docs-page
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        prefix: {
            options: Object.keys(Icons),
            mapping: Icons,
        },
    },
}

export default meta
type Story = StoryObj<typeof Button>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

export const Default: Story = {
    args: {
        type: 'button',
        children: 'Button',
    },
}
