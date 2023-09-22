import React from 'react';

import { classNames } from '@flagbase/ui';
import { Switch } from '@headlessui/react';
import { useField, useFormikContext } from 'formik';

type ToggleProps = {
  label?: string;
  name: string;
  disabled?: boolean;
};

export default function Toggle({ label, name, ...props }: ToggleProps) {
  const [field, meta] = useField<boolean>({ name });
  const { setFieldValue } = useFormikContext<boolean>();

  return (
    <>
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <Switch
        aria-label={`${field.name} toggle`}
        checked={meta.value}
        onChange={(checked) => setFieldValue(field.name, checked)}
        className={classNames(
          props.disabled ? 'opacity-50 cursor-not-allowed' : '',
          field.value ? 'bg-indigo-600' : 'bg-gray-200',
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2',
        )}
        {...props}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={classNames(
            field.value ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
          )}
        />
      </Switch>
    </>
  );
}
