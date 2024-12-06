import { ResourceRepository } from '../../../adapters/repositories/resource.repository';
import { Resource } from '../../../../domain/Resource/Resource';
import { GetResourceQuery } from './getResource.query';

import type { Maybe } from '../../../../../../shared-kernel/utils/Maybe';
import { Result } from '../../../../../../shared-kernel/utils/Result';

export class GetResourceQueryHandler {
  constructor(private readonly resourceRepository: ResourceRepository) {}

  public async execute(
    query: GetResourceQuery,
  ): Promise<Result<Maybe<Resource>, Error>> {
    return this.resourceRepository.findOne(query.resourceId);
  }
}
