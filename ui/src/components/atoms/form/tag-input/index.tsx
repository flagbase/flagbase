import React, { createElement, useState } from 'react';

import {
  FieldHookConfig,
  FormikFormProps,
  useField,
  useFormikContext,
} from 'formik';

import { classNames } from '../../../../helpers';
import { Tag } from '../../layout/tag';

export type TagInputProps = {
  prefix?: React.ElementType;
  label?: string;
  fieldConfig: FieldHookConfig<string[]>;
};

export const TagInput: React.FC<TagInputProps> = ({
  prefix,
  label,
  fieldConfig,
}) => {
  const [field, meta] = useField<string[]>(fieldConfig);
  const [inputValue, setInputValue] = useState('');
  const { placeholder } = fieldConfig;
  const { setFieldValue } = useFormikContext();
  const name = field.name;
  const tags = meta.value;

  const onDelete = (tag: string) => {
    const newTags = tags.filter((t) => t !== tag);
    setFieldValue(name, newTags);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    //if keyCode is enter, tab or comma
    console.log('key', event.keyCode);
    if (
      (event.keyCode === 13 || event.keyCode === 9 || event.keyCode === 188) &&
      inputValue !== ''
    ) {
      event.preventDefault();
      const newTags = [...tags, inputValue];
      setFieldValue(name, newTags);
      setInputValue('');
    }
  };

  return (
    <div>
      <div className="relative rounded-md shadow-sm">
        {prefix && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {createElement(prefix)}
          </div>
        )}
        <div className="flex w-full flex-wrap items-center gap-3 rounded-md border border-gray-300 p-2 sm:text-sm">
          {tags.map((tag, index) => (
            <Tag
              className="h-fit py-2"
              key={`${tag}_${index}`}
              onDelete={onDelete}
            >
              {tag}
            </Tag>
          ))}
          <input
            type="text"
            id={name}
            className={classNames(
              `block w-full rounded-md border-0 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm flex-grow basis-0 h-10`,
              prefix ? 'pl-10' : '',
              'peer',
            )}
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
            onChange={(event) => setInputValue(event.target.value)}
            value={inputValue}
          />
          <label
            htmlFor={label}
            className={classNames(
              `left-3 absolute peer-focus:top-0 peer-focus:text-xs  pointer-events-none text-gray-700 transition-all`,
              tags.length === 0 ? 'top-4' : '',
              tags.length > 0 ? 'top-0 text-xs' : '',
              'peer-disabled:top-0 peer-disabled:text-xs bg-white',
            )}
          >
            {label}
          </label>
        </div>
      </div>
    </div>
  );
};
