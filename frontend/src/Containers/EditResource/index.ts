import { ResourceType } from '../../shared/types/BpmnResource';

import type { Resource } from '../../Types';
import type { ActionResponse } from '../../shared/types/ActionResponse';

export type EditResourceParams = {
  resourceId: string;
};

export type EditResourceLoaderData = {
  resource: Promise<Resource>;
};

export type EditResourceActionResponse = ActionResponse & {
  editedResourceType: ResourceType;
};

export * from './EditResource.container';
export * from './EditResource.loader';
export * from './EditResource.action';
