import { Instance } from '../pages/instances/instances.functions';

export const getInstances = (): Instance[] =>
  JSON.parse(localStorage.getItem('instances') || '[]') as Instance[];
