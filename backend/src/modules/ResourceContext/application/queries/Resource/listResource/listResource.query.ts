import { ResourceTypeEnum } from '../../../../../../modules/ResourceContext/shared/types/Resource';

export type ListResourceQuery = {
  filters: {
    type?: ResourceTypeEnum;
    depth?: number;
    parentId?: string;
  };
};
