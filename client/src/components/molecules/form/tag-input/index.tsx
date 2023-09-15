import React, { createElement, useState, useCallback } from 'react';

import { Tag, classNames } from '@flagbase/ui';
import { FieldHookConfig, useField } from 'formik';

export type TagInputProps = {
  prefix?: React.ElementType;
  label?: string;
  fieldConfig: FieldHookConfig<string[]>;
};

export const TagInput: React.FC<TagInputProps> = ({
  prefix,
  label,
  ...props
}) => {
  const [field, meta, helpers] = useField<string[]>(props);
  const [inputValue, setInputValue] = useState('');
  const tags = meta.value;
  const { name } = field;
  const { setValue } = helpers;

  const onDelete = useCallback(
    (tag: string) => {
      const newTags = tags.filter((t) => t !== tag);
      setValue(newTags);
    },
    [tags, setValue],
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      (event.key === 'Enter' || event.key === 'Tab' || event.key === ',') &&
      inputValue !== ''
    ) {
      event.preventDefault();
      const newTags = [...tags, inputValue];
      setValue(newTags);
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
          {tags.map((tag) => (
            <Tag className="h-fit py-2" key={tag} onDelete={onDelete}>
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
            onKeyDown={handleKeyDown}
            onChange={(event) => setInputValue(event.target.value)}
            value={inputValue}
            aria-label={label || 'Tag Input'}
          />
          <label
            htmlFor={name}
            className={classNames(
              `left-3 absolute peer-focus:top-0 peer-focus:text-xs pointer-events-none text-gray-700 transition-all`,
              tags.length === 0 ? 'top-4' : 'top-0 text-xs',
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
