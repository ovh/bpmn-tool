import { Nullable } from '../../../../shared-kernel/utils/Nullable';
import { ResourceTypeEnum } from '../../../../modules/ResourceContext/shared/types/Resource';

export class ResourcePresenter {
  id: string;
  name: string;
  description: Nullable<string>;
  depth: number;
  parentId: Nullable<string>;
  type: ResourceTypeEnum;
  createdBy: string;
  authToken: Nullable<string>;
}
