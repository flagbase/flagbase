import React from 'react';

import { Input as BaseInput } from '@flagbase/ui';
import { useField } from 'formik';

const Input = (props) => {
  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : '';

  return (
    <BaseInput
      {...props}
      {...field}
      placeholder={undefined}
      error={errorText}
    />
  );
};

export default Input;
