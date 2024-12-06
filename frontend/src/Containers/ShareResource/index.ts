import type { Resource } from '../../Types';

export type ShareResourceParams = {
  resourceId: string;
};

export type ShareResourceLoaderData = {
  resource: Promise<Resource>;
};

export * from './ShareResource.container';
export * from './ShareResource.loader';
