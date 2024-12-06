import { ResourceRepository } from '../../../../../../modules/ResourceContext/application/adapters/repositories/resource.repository';
import { ResourceTypeEnum } from '../../../../../../modules/ResourceContext/shared/types/Resource';
import { UseCaseResult } from '../../../../../../shared-kernel/application/usecases/useCase';
import { ok, fail } from '../../../../../../shared-kernel/utils/Result';

import { ListContentQuery } from './listContent.query';
import {
  BadResourceTypeError,
  CannotFindResourceError,
} from '../../../../../../modules/ResourceContext/application/shared/Resource/resource.error';
import { ContentRepository } from '../../../../../../modules/ResourceContext/application/adapters/repositories/content.repository';
import { CannotListContentsError } from './listContent.error';
import { Content } from '../../../../../../modules/ResourceContext/domain/Content/Content';

export class ListContentQueryHandler {
  constructor(
    private readonly resourceRepository: ResourceRepository,
    private readonly contentRepository: ContentRepository,
  ) {}

  public async execute(
    resourceId: string,
    query: ListContentQuery,
  ): Promise<UseCaseResult<Content[]>> {
    // check for linked resource
    const resourceResult = await this.resourceRepository.findOne(resourceId);

    if (resourceResult.fail) {
      return fail(new CannotFindResourceError(resourceId, resourceResult.fail));
    }

    const resource = resourceResult.ok;

    if (resource?.type === ResourceTypeEnum.Folder) {
      return fail(new BadResourceTypeError(resourceId));
    }

    const queryResult = await this.contentRepository.find(
      resourceId,
      query.filters,
    );

    if (queryResult.fail) {
      return fail(
        new CannotListContentsError(resourceId, queryResult.fail as Error),
      );
    }

    return ok(queryResult.ok);
  }
}
