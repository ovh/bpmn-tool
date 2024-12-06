import { ResourceType } from './shared/types/BpmnResource';
import { Nullable } from './shared/types/Nullable';

export enum ContentStatusEnum {
  Obsolete = 'obsolete',
  Draft = 'draft',
  Published = 'published',
}

export type Resource = {
  id: string;
  name: string;
  depth: number;
  description: string;
  parentId?: string;
  type: ResourceType;
  authToken?: string;
};

export type Comment = {
  id: string;
  resourceId: string;
  comment: string;
  createdBy: string;
  createdAt: string;
};

export type Content = {
  id: string;
  resourceId: string;
  version: Nullable<number>;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  status: ContentStatusEnum;
};
