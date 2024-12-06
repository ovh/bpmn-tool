import { ActionResponse } from '../../shared/types/ActionResponse';
import { ResourceType } from '../../shared/types/BpmnResource';

import type { Resource } from '../../Types';

export type DeleteResourceParams = {
  resourceId: string;
};

export type DeleteResourceLoaderData = {
  resource: Promise<Resource>;
};

export type DeleteResourceSubmitData = {
  resourceType: ResourceType;
};

export type DeleteResourceActionResponse = ActionResponse & {
  deletedResourceType: ResourceType;
};

export * from './DeleteResource.container';
export * from './DeleteResource.loader';
export * from './DeleteResource.action';
