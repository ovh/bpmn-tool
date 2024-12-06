import type { Resource } from '../../Types';

export type PublishResourceParams = {
  resourceId: string;
};

export type PublishResourceLoaderData = {
  resource: Promise<Resource>;
};

export * from './PublishResource.container';
export * from './PublishResource.loader';
export * from './PublishResource.action';
