import { Injectable } from '@nestjs/common';

import { ResourceRepository } from '../../../../../modules/ResourceContext/application/adapters/repositories/resource.repository';
import { Resource } from '../../../../../modules/ResourceContext/domain/Resource/Resource';
import { Maybe } from '../../../../../shared-kernel/utils/Maybe';
import { Result, ok, fail } from '../../../../../shared-kernel/utils/Result';

type ResourceMap = Record<string, Resource>;

@Injectable()
export class ResourceStubRepository implements ResourceRepository {
  public resources: ResourceMap = {};

  async save(resource: Resource): Promise<Result<Resource, Error>> {
    this.resources[resource.id.value] = resource;

    return ok(resource);
  }

  async delete(resourceId: string): Promise<Result<boolean, Error>> {
    if (!this.resources[resourceId]) {
      return fail(new Error(`Resource with id ${resourceId} doesn't exist.`));
    }

    delete this.resources[resourceId];
    return ok(true);
  }

  async findOne(resourceId: string): Promise<Result<Maybe<Resource>, Error>> {
    if (!this.resources[resourceId]) {
      return fail(new Error(`Resource with id ${resourceId} doesn't exist.`));
    }

    return ok(this.resources[resourceId]);
  }

  async find(): Promise<Result<Resource[], Error>> {
    return ok(Object.values(this.resources));
  }

  async findByDepth(): Promise<Result<Resource[], Error>> {
    // TODO !
    return ok(Object.values(this.resources));
  }
}
