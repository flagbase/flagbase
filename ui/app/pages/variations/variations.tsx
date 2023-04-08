import React, { Suspense } from 'react';

import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Await, useLoaderData } from 'react-router-dom';

import { createVariation, fetchVariations, VariationCreateBody } from './api';
import Button from '../../../components/button';
import EmptyState from '../../../components/empty-state';
import { Loader } from '../../../components/loader';
import Table from '../../../components/table/table';
import Tag from '../../../components/tag';
import { configureAxios } from '../../lib/axios';
import { useFlagbaseParams } from '../../lib/use-flagbase-params';
import { getVariationsKey } from '../../router/loaders';
import { getVariationPath } from '../../router/router';

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

export const useAddVariation = () => {
  const queryClient = useQueryClient();
  const { instanceKey, workspaceKey, projectKey, flagKey } =
    useFlagbaseParams();
  const mutation = useMutation({
    mutationFn: async (values: VariationCreateBody) => {
      if (!instanceKey || !workspaceKey || !projectKey || !flagKey) {
        throw new Error('Missing required params');
      }
      await createVariation({
        workspaceKey,
        projectKey,
        flagKey,
        variation: values,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getVariationsKey({
          instanceKey,
          workspaceKey,
          projectKey,
          flagKey,
        }),
      });
    },
  });

  return mutation;
};

export const useVariations = () => {
  const { instanceKey, workspaceKey, projectKey, flagKey } =
    useFlagbaseParams();

  const query = useQuery<Variation[]>(
    getVariationsKey({
      instanceKey,
      workspaceKey,
      projectKey,
      flagKey,
    }),
    {
      queryFn: async () => {
        if (!instanceKey || !workspaceKey || !projectKey || !flagKey) {
          throw new Error('Missing required params');
        }

        await configureAxios(instanceKey);

        return fetchVariations({
          workspaceKey: workspaceKey,
          projectKey: projectKey,
          flagKey: flagKey,
        });
      },
      enabled:
        Boolean(workspaceKey) &&
        Boolean(projectKey) &&
        Boolean(flagKey) &&
        Boolean(instanceKey),
      refetchOnWindowFocus: false,
      cacheTime: 10 * 1000,
      staleTime: 15 * 1000,
    },
  );

  return query;
};

const Variations = () => {
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
};

export default Variations;
