import React from 'react';

import { PlusIcon } from '@heroicons/react/20/solid';
import {
  ErrorMessage,
  Field,
  FieldArray,
  FieldConfig,
  useField,
  useFormikContext,
} from 'formik';

import Input from '../input/input';

export type MultiInputProps = {
  icon?: React.ElementType;
  label?: string;
  autocomplete?: string;
  name?: string;
  addText?: string;
} & FieldConfig &
  React.InputHTMLAttributes<HTMLInputElement>;

const MultiInput: React.FC<MultiInputProps> = ({
  icon,
  className,
  label,
  name,
  autoComplete = 'off',
  addText,
  ...props
}) => {
  const [field, meta] = useField(props);
  const context = useFormikContext();
  console.log('TEST', field, meta);
  console.log('context', context);
  const { values } = context;
  const inputs = values[name];

  return (
    <div className="flex flex-col gap-3">
      <FieldArray name={name}>
        {({ remove, push }) => (
          <div>
            {console.log('VALS', values)}
            {inputs.length > 0 &&
              inputs.map((friend, index) => (
                <div className="row" key={index}>
                  <div className="col">
                    <label htmlFor={`friends.${index}.name`}>Name</label>
                    <Input
                      name={`${name}.${index}.name`}
                      placeholder="Jane Doe"
                      type="text"
                    />
                    <ErrorMessage
                      name={`${name}.${index}.name`}
                      component="div"
                      className="field-error"
                    />
                  </div>
                  <div className="col">
                    <label htmlFor={`${name}.${index}.email`}>Email</label>
                    <Input
                      name={`${name}.${index}.email`}
                      placeholder="jane@acme.com"
                      type="email"
                    />
                    <ErrorMessage
                      name={`${name}.${index}.name`}
                      component="div"
                      className="field-error"
                    />
                  </div>
                  <div className="col">
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => remove(index)}
                    >
                      X
                    </button>
                  </div>
                </div>
              ))}

            <div className="relative">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center">
                <button
                  onClick={() => push({ name: '', email: '' })}
                  type="button"
                  className="inline-flex items-center gap-x-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  <PlusIcon
                    className="-ml-1 -mr-0.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span>{addText}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </FieldArray>
    </div>
  );
};

export default MultiInput;
