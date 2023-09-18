import React from 'react';

import { Input } from '@flagbase/ui';

import { TagInput } from '../../molecules/form/tag-input';

const formMap = {
  input: Input,
  tagInput: TagInput,
};

const FormFields = ({ form }) => {
  console.log('FORM', form);

  return form.map((field, index) => {
    const Component = formMap[field.type];

    return <Component key={index} {...field} />;
  });
};

export default FormFields;
