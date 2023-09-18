import React from 'react';

import { useNotification } from '@flagbase/ui';
import { DocumentDuplicateIcon } from '@heroicons/react/20/solid';

export const CopyRow = ({ text }: { text: string }) => {
  const { addNotification } = useNotification();

  return (
    <div className="flex items-center gap-1">
      <div>{text}</div>
      <button
        type="button"
        className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
        onClick={(event) => {
          event.preventDefault();
          void navigator.clipboard.writeText(text).then(() => {
            addNotification({
              type: 'success',
              title: 'Copied',
              content: 'Copied to clipboard',
            });
          });
        }}
      >
        <DocumentDuplicateIcon className="h-5 w-5 cursor-pointer" />
      </button>
    </div>
  );
};
