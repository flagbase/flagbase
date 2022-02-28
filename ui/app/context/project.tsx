import { createEntityContext } from '../lib/entity-store';

export type Project = {
  id: string;
  key: string;
  attributes: {
    name: string;
    description: string;
    key: string;
    tags: string[];
  }
};

const ProjectStore = createEntityContext<Project>('project', {
});

export const ProjectContext = ProjectStore.Context;

export const ProjectProvider = ProjectStore.Provider;
