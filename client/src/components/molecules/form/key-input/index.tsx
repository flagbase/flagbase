import React, { useEffect } from 'react';

import { useFormikContext } from 'formik';

import Input from '../input';

export const KeyInput = (props) => {
  const {
    setFieldValue,
    values: { name },
  } = useFormikContext<{ name: string }>();

  useEffect(
    function replaceSpacesWithDash() {
      if (name && name.trim() !== '') {
        setFieldValue('key', name.split(' ').join('-').toLowerCase());
      }
    },
    [name, setFieldValue],
  );

  return <Input {...props} />;
};
