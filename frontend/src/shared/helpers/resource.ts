import { Resource } from '../../Types';
import { ResourceType } from '../types/BpmnResource';

export const isRoot = (resourceId: string) => {
  return resourceId === 'root';
};

export const getRootResource = () => {
  return {
    id: 'root',
    name: 'Explorer',
    description: 'Explore your processes!',
    type: ResourceType.Folder,
    depth: 0,
  } as Resource;
};

export const isFolder = (resourceOrType: Resource | ResourceType) => {
  const type =
    typeof resourceOrType !== 'string' ? resourceOrType.type : resourceOrType;
  return type === ResourceType.Folder;
};

export const isProcess = (resourceOrType: Resource | ResourceType) => {
  const type =
    typeof resourceOrType !== 'string' ? resourceOrType.type : resourceOrType;
  return type === ResourceType.Process;
};

export const getResourceIcon = (resourceOrType: Resource | ResourceType) => {
  return isFolder(resourceOrType) ? '📁' : '⚙️';
};

export const isValidResourceType = (type: string) => {
  return [ResourceType.Folder, ResourceType.Process].includes(
    type as ResourceType,
  );
};
