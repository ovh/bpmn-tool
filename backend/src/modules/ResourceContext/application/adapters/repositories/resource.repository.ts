import { Result } from '../../../../../shared-kernel/utils/Result';
import { Resource } from '../../../../../modules/ResourceContext/domain/Resource/Resource';
import { Maybe } from '../../../../../shared-kernel/utils/Maybe';
import { ResourceTypeEnum } from '../../../../../modules/ResourceContext/shared/types/Resource';

export type ResourceFilters = {
  type?: ResourceTypeEnum;
  depth?: number;
  parentId?: string;
};

export interface ResourceRepository {
  // WRITE
  save(resource: Resource): Promise<Result<Resource, Error>>;
  delete(resourceId: string): Promise<Result<boolean, Error>>;

  // READ
  findOne(resourceId: string): Promise<Result<Maybe<Resource>, Error>>;
  find(filters?: ResourceFilters): Promise<Result<Resource[], Error | Error[]>>;
  findByDepth(
    depth: number,
  ): Promise<Result<Maybe<Resource[]>, Error | Error[]>>;
}
