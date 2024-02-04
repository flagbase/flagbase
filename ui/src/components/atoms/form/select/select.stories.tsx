import React, { useState } from 'react';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import * as Icons from '@heroicons/react/24/solid';
import type { Meta, StoryObj } from '@storybook/react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import { Select } from '.';

const meta: Meta<typeof Select> = {
  title: 'Atoms/Form/Select',
  component: Select,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    label: 'Select',
    value: { name: 'Equal', value: 'equal' },
    options: [
      { name: 'Equal', value: 'equal' },
      { name: 'Greater Than', value: 'greater_than' },
      { name: 'Greater Than or Equal', value: 'greater_than_or_equal' },
      { name: 'Contains', value: 'contains' },
      { name: 'Regex', value: 'regex' },
    ],
  },
  render: ({options, value}) => {
    const [selected, setSelected] = useState(value)

    return (
        <Select options={options} value={selected} onChange={setSelected} />
    )
  }
};

