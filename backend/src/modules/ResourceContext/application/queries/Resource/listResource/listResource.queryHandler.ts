import { ResourceRepository } from '../../../adapters/repositories/resource.repository';
import { Resource } from '../../../../domain/Resource/Resource';
import { ListResourceQuery } from './listResource.query';
import { UseCaseResult } from '../../../../../../shared-kernel/application/usecases/useCase';
import { ok, fail } from '../../../../../../shared-kernel/utils/Result';
import { CannotListResourcesError } from './listResource.error';

export class ListResourceQueryHandler {
  constructor(private readonly resourceRepository: ResourceRepository) {}

  public async execute(
    query: ListResourceQuery,
  ): Promise<UseCaseResult<Resource[]>> {
    const listResourcesResult = await this.resourceRepository.find(
      query.filters,
    );

    if (!listResourcesResult.ok) {
      const error = Array.isArray(listResourcesResult.fail)
        ? listResourcesResult.fail[0]
        : listResourcesResult.fail;
      return fail(new CannotListResourcesError(error as Error));
    }

    return ok(listResourcesResult.ok);
  }
}
