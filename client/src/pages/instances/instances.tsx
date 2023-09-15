import React, { Suspense, useState } from 'react';

import {
  Button,
  Loader,
  EmptyState,
  StackedEntityListProps,
  ListItem,
} from '@flagbase/ui';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { Await, Link, useLoaderData } from 'react-router-dom';

import { Instance } from './instances.functions';
import { useInstances } from './instances.hooks';
import { AddNewInstanceModal } from './instances.modal';
import WelcomeModal from '../welcome/welcome.modal';

const Instances: React.FC = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(
    JSON.parse(
      localStorage.getItem('show-welcome-message') || 'true',
    ) as boolean,
  );

  const [visible, setVisible] = useState(false);

  const { instances: initialInstances } = useLoaderData() as {
    instances: Instance[];
  };

  const { data: instances } = useInstances();
  const transformInstancesToList = (
    instanceList: Instance[],
  ): StackedEntityListProps['entities'] => {
    const instances = instanceList;
    if (!instances) {
      return [];
    }

    return instances.map((instance) => {
      return {
        id: instance.key,
        href: `/${instance.key}/workspaces`,
        status: 'Active',
        title: instance.name,
        location: instance.connectionString,
      };
    });
  };

  return (
    <Suspense fallback={<Loader />}>
      <Await resolve={initialInstances} errorElement={<div>Error</div>}>
        {(initialInstances: Instance[]) => (
          <div className="mt-5">
            <AddNewInstanceModal visible={visible} setVisible={setVisible} />
            {instances && instances.length === 0 && (
              <WelcomeModal
                isOpen={showWelcomeModal}
                onClose={() => {
                  setShowWelcomeModal(false);
                }}
              />
            )}
            {initialInstances && (
              <ul role="list" className="divide-y divide-gray-200">
                {instances?.map((instance) => (
                  <Link key={instance.key} to={`/${instance.key}/workspaces`}>
                    <ListItem
                      title={instance.name}
                      description={instance.connectionString}
                    />
                  </Link>
                ))}
              </ul>
            )}
            {instances && instances.length === 0 && (
              <EmptyState
                title="You haven't joined an instance yet"
                description="Join an instance now"
                cta={
                  <Button
                    className="w-fit py-2"
                    onClick={() => setVisible(true)}
                    type="button"
                    suffix={PlusCircleIcon}
                  >
                    Join instance
                  </Button>
                }
              />
            )}
          </div>
        )}
      </Await>
    </Suspense>
  );
};

export default Instances;
