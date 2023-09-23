import React, { Suspense, useState } from 'react';

import {
  Button,
  EmptyState,
  Loader,
  Notification,
  // Table,
  Tag,
} from '@flagbase/ui';
import {
  DocumentDuplicateIcon,
  PlusCircleIcon,
} from '@heroicons/react/20/solid';
import { useQuery } from 'react-query';
import { Await, Link, useLoaderData } from 'react-router-dom';

import { fetchSdkList, SDK } from './api';
import { CreateSDKModal } from './sdks.modal';
import { configureAxios } from '../../lib/axios';
import { useFlagbaseParams } from '../../lib/use-flagbase-params';
import { getSdkKey } from '../../router/loaders';
import { useInstances } from '../instances/instances.hooks';

export const sdkColumns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Client Key',
    dataIndex: 'clientKey',
    key: 'clientKey',
  },
  {
    title: 'Server Key',
    dataIndex: 'serverKey',
    key: 'serverKey',
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
  {
    title: 'Actions',
    dataIndex: 'action',
    key: 'action',
  },
];

export const useSDKs = () => {
  const { instanceKey, workspaceKey, projectKey, environmentKey } =
    useFlagbaseParams();
  const { data: instances } = useInstances({
    select: (instances) =>
      instances.filter((instance) => instance.key === instanceKey),
  });
  const queryKey = getSdkKey({
    instanceKey,
    workspaceKey,
    projectKey,
    environmentKey,
  });

  const query = useQuery<SDK[]>(queryKey, {
    queryFn: async () => {
      if (!instanceKey || !workspaceKey || !projectKey || !environmentKey) {
        return [];
      }
      await configureAxios(instanceKey);

      return fetchSdkList({
        workspaceKey,
        projectKey,
        environmentKey,
      });
    },
    enabled:
      !!instanceKey &&
      !!workspaceKey &&
      !!projectKey &&
      !!environmentKey &&
      instances &&
      instances.length > 0,
  });

  return query;
};

export const Sdks = () => {
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { sdks: prefetchedSdks } = useLoaderData() as { sdks: SDK[] };
  const { data: sdks } = useSDKs();
  const { instanceKey, workspaceKey, projectKey, environmentKey } =
    useFlagbaseParams();

  const convertSdksToList = (sdks: SDK[]) => {
    return sdks.map((sdk) => {
      return {
        clientKey: (
          <div className="flex">
            <div>{sdk.attributes.clientKey}</div>
            <DocumentDuplicateIcon
              className="h-5 w-5 cursor-pointer text-indigo-600"
              onClick={() => {
                navigator.clipboard.writeText(sdk.attributes.clientKey);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 3000);
              }}
            />
          </div>
        ),
        serverKey: (
          <div className="flex">
            <div>{sdk.attributes.serverKey}</div>
            <DocumentDuplicateIcon
              className="h-5 w-5 cursor-pointer text-indigo-600"
              onClick={() => {
                navigator.clipboard.writeText(sdk.attributes.serverKey);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 3000);
              }}
            />
          </div>
        ),
        name: sdk.attributes.name,
        description: sdk.attributes.description,
        tags: (
          <div className="flex gap-3">
            {sdk.attributes.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
            {sdk.attributes.enabled && <Tag color="green">Enabled</Tag>}
            {!sdk.attributes.enabled && <Tag color="gray">Disabled</Tag>}
          </div>
        ),
        action: (
          <Link
            to={`/${instanceKey}/workspaces/${workspaceKey}/projects/${projectKey}/environments/${environmentKey}/sdk-keys/${sdk.id}`}
          >
            <Button variant="secondary" className="py-2">
              Edit
            </Button>
          </Link>
        ),
      };
    });
  };

  return (
    <Suspense fallback={<Loader />}>
      <Await resolve={prefetchedSdks}>
        {() => (
          <div className="mt-5">
            <CreateSDKModal visible={showModal} setVisible={setShowModal} />
            <Notification
              type="success"
              title="Copied!"
              content="Copied to clipboard"
              show={copied}
              setShow={setCopied}
            />

            TODO: redo the table for SDKs
            {/* <Table
              loading={false}
              dataSource={convertSdksToList(sdks)}
              columns={sdkColumns}
              emptyState={
                <EmptyState
                  title="No SDKs found"
                  description="This environment does not have any SDKs yet."
                  cta={
                    <Button
                      onClick={() => setShowModal(true)}
                      className="py-2"
                      suffix={PlusCircleIcon}
                    >
                      Create Sdk
                    </Button>
                  }
                />
              }
            /> */}
          </div>
        )}
      </Await>
    </Suspense>
  );
};
