import type { Resource } from '../../Types';

export type BpmnLayoutRouteParams = {
  resourceId: string;
};

export type BpmnLayoutLoaderData = {
  resource: Promise<Resource>;
};

export * from './BpmnLayout.container';
export * from './BpmnLayout.loader';
export * from './BpmnLayout.action';
export * from './BpmnLayout.error';
