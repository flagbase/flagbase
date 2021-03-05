import { createEntityContext } from '../lib/entity-store';

export type Instance = {
  id: string;
  key: string;
  connectionString: string;
  accessKey: string;
  accessToken: string;
};

const InstanceStore = createEntityContext<Instance>('instance', {}, {
  useLocalStorage: true
});

export const InstanceContext = InstanceStore.Context;

export const InstanceProvider = InstanceStore.Provider;
