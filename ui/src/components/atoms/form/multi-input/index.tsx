import React, { useState } from 'react';

import { Transition } from '@headlessui/react';
import { PlusIcon, XCircleIcon } from '@heroicons/react/20/solid';
import { ErrorMessage, FieldArray, FieldConfig, useField } from 'formik';

import { Input } from '../input';

export type MultiInputProps = {
  icon?: React.ElementType;
  label?: string;
  autocomplete?: string;
  name?: string;
  addText?: string;
  multiInputLabels: {
    [key: string]: string;
  };
} & FieldConfig &
  React.InputHTMLAttributes<HTMLInputElement>;

const MultiInput: React.FC<MultiInputProps> = ({
  name,
  label,
  addText,
  multiInputLabels,
  ...props
}) => {
  const [field] = useField({ name, ...props });
  const inputs = field.value;
  const [shape] = useState(inputs[0]);

  if (!Array.isArray(inputs)) {
    console.error('MultiInput: inputs is not an array');

    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative mb-3">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-base font-semibold leading-6 text-gray-900">
            {label}
          </span>
        </div>
      </div>
      <FieldArray name={name}>
        {({ remove, push }) => (
          <div>
            <div className="flex flex-col items-center gap-5">
              {inputs.map((input, index: number) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-5 md:flex-row"
                >
                  {Object.keys(input).map((key) => (
                    <Transition
                      key={`${name}.${index}.${key}`}
                      appear={true}
                      show={true}
                      enter="transition-opacity duration-150"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="transition-opacity duration-150"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div>
                        <Input
                          label={multiInputLabels[key]}
                          name={`${name}.${index}.${key}`}
                          type="text"
                        />
                        <ErrorMessage
                          name={`${name}.${index}.${key}`}
                          component="div"
                        />
                      </div>
                    </Transition>
                  ))}
                  <XCircleIcon
                    onClick={() => remove(index)}
                    className="h-5 w-5 cursor-pointer"
                  />
                </div>
              ))}
            </div>

            <div className="relative">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative mt-3 flex justify-center">
                <button
                  onClick={() => push(shape)}
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
