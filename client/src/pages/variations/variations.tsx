import React, { Suspense } from 'react';

import { Tag, Loader } from '@flagbase/ui';
import { createColumnHelper } from '@tanstack/react-table';
import { Await, useLoaderData } from 'react-router-dom';

import { useVariations } from './variations.hooks';
import { Table } from '../../components/organisms/table/table';
import { useFlagbaseParams } from '../../lib/use-flagbase-params';
import { getVariationPath } from '../../router/router.paths';

export type Variation = {
  type: 'variation';
  id: string;
  attributes: {
    description: string;
    key: string;
    name: string;
    tags: string[];
  };
};

const columnHelper = createColumnHelper<Variation['attributes']>();

const getCellValue = (cell: any) => cell.getValue();

export const variationColumns = [
  columnHelper.accessor('name', {
    header: () => 'Name',
    cell: getCellValue,
  }),
  columnHelper.accessor('key', {
    header: () => 'key',
    cell: getCellValue,
  }),
  columnHelper.accessor('description', {
    header: () => 'description',
    cell: getCellValue,
  }),
  columnHelper.accessor('tags', {
    header: () => 'Tags',
    cell: getCellValue,
  }),
];

const convertVariationsToTable = ({
  variations,
  params,
}: {
  variations: Variation[];
  params: {
    instanceKey: string;
    workspaceKey: string;
    projectKey: string;
    flagKey: string;
  };
}) => {
  const { instanceKey, workspaceKey, projectKey, flagKey } = params || {};
  if (!instanceKey || !workspaceKey || !projectKey || !flagKey) {
    return [];
  }

  return variations.map((variation) => {
    return {
      key: variation.attributes.key,
      name: variation.attributes.name,
      description: variation.attributes.description,
      tags: variation.attributes.tags.map((tag) => <Tag key={tag}>{tag}</Tag>),
      href: getVariationPath({
        instanceKey,
        workspaceKey,
        projectKey,
        flagKey,
        variationKey: variation.attributes.key,
      }),
    };
  });
};

function Variations() {
  const { variations: prefetchedVariations } = useLoaderData() as {
    variations: Variation[];
  };
  const { data: variations } = useVariations() as { data: Variation[] };
  const params = useFlagbaseParams();

  return (
    <Suspense fallback={<Loader />}>
      <Await resolve={prefetchedVariations}>
        {() => (
          <React.Fragment>
            <Table
              data={convertVariationsToTable({ variations, params })}
              columns={variationColumns}
            />
          </React.Fragment>
        )}
      </Await>
    </Suspense>
  );
}

export default Variations;
