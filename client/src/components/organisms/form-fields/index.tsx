import React from 'react';

import { Input, TagInput } from '@flagbase/ui';

const formMap = {
  input: Input,
  tagInput: TagInput,
};

const FormFields = ({ form }) => {
  console.log('FORM', form);

  return form.map((field) => {
    const Component = formMap[field.type];

    return <Component {...field} />;
  });
};

export default FormFields;
