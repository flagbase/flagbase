import React, { Suspense, useState } from 'react';

import { Button, EmptyState, Loader } from '@flagbase/ui';
import { PlusCircleIcon } from '@heroicons/react/20/solid';
import { Await, useLoaderData } from 'react-router-dom';

import { Flag } from './api';
import { flagConstants, flagsColumn } from './constants';
import { convertFlags, useFlags } from './flags.hooks';
import { CreateFlag } from './flags.modal';
import Table from '../../components/organisms/table';
import {
  useActiveEnvironment,
  useUpdateActiveEnvironment,
} from '../environments/environment-dropdown';
import { useEnvironments } from '../environments/environments';

const Flags: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const { flags: prefetchedFlags } = useLoaderData() as { flags: Flag[] };
  const { data: environmentKey } = useActiveEnvironment();
  const { mutate } = useUpdateActiveEnvironment();
  const { data: environments } = useEnvironments();

  if (!environmentKey && environments?.length) {
    mutate(environments[0].attributes.key);
  }

  const activeEnvironment = environments?.find(
    (env) => env.attributes.key === environmentKey,
  );

  const { data: flags } = useFlags();

  return (
    <Suspense fallback={<Loader />}>
      <Await resolve={prefetchedFlags}>
        {() => (
          <div className="mt-5">
            <CreateFlag visible={visible} setVisible={setVisible} />
            {flags && activeEnvironment && (
              <Table
                loading={false}
                data={convertFlags({
                  flags,
                  environment: activeEnvironment,
                })}
                columns={flagsColumn}
                emptyState={
                  <EmptyState
                    title="No Flags"
                    description={'Get started by creating a new flag.'}
                    cta={
                      <Button
                        className="py-2"
                        suffix={PlusCircleIcon}
                        onClick={() => setVisible(true)}
                      >
                        {flagConstants.FLAG_ADD_TEXT}
                      </Button>
                    }
                  />
                }
              />
            )}
          </div>
        )}
      </Await>
    </Suspense>
  );
};

export default Flags;
