import React, { Suspense } from 'react';

import { Button, EmptyState, Table, Tag, Loader } from '@flagbase/ui';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { Await, useLoaderData } from 'react-router-dom';

import { useVariations } from './variations.hooks';
import { useFlagbaseParams } from '../../lib/use-flagbase-params';
import { getVariationPath } from '../../router/router.paths';

export const variationColumns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Key',
    dataIndex: 'key',
    key: 'key',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Tags',
    dataIndex: 'tags',
    key: 'tags',
  },
];

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
              loading={false}
              dataSource={convertVariationsToTable({ variations, params })}
              columns={variationColumns}
              emptyState={
                <EmptyState
                  title="No variations found"
                  description="This flag does not have any variations yet."
                  cta={
                    <Button className="py-2" suffix={PlusCircleIcon}>
                      Create Variation
                    </Button>
                  }
                />
              }
            />
          </React.Fragment>
        )}
      </Await>
    </Suspense>
  );
}

export default Variations;
