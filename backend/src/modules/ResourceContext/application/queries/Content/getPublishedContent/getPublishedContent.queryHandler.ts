import { ContentRepository } from '../../../../../../modules/ResourceContext/application/adapters/repositories/content.repository';
import { ResourceRepository } from '../../../../../../modules/ResourceContext/application/adapters/repositories/resource.repository';
import { Result, fail } from '../../../../../../shared-kernel/utils/Result';
import { Maybe } from '../../../../../../shared-kernel/utils/Maybe';
import {
  BadResourceTypeError,
  CannotFindResourceError,
} from '../../../../../../modules/ResourceContext/application/shared/Resource/resource.error';
import { ResourceTypeEnum } from '../../../../../../modules/ResourceContext/shared/types/Resource';
import { ContentStatusEnum } from '../../../../../../modules/ResourceContext/shared/types/Content';
import { Content } from '../../../../../../modules/ResourceContext/domain/Content/Content';

export class GetPublishedContentQueryHandler {
  constructor(
    private readonly resourceRepository: ResourceRepository,
    private readonly contentRepository: ContentRepository,
  ) {}

  public async execute(
    resourceId: string,
  ): Promise<Result<Maybe<Content>, Error>> {
    // check for linked resource
    const resourceResult = await this.resourceRepository.findOne(resourceId);

    if (resourceResult.fail) {
      return fail(new CannotFindResourceError(resourceId, resourceResult.fail));
    }

    const resource = resourceResult.ok;

    if (resource?.type === ResourceTypeEnum.Folder) {
      return fail(new BadResourceTypeError(resourceId));
    }

    return this.contentRepository.findOneBy({
      resourceId,
      status: ContentStatusEnum.Published,
    });
  }
}
