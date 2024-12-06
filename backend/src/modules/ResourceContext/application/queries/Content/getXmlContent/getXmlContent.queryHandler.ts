import { ContentRepository } from '../../../../../../modules/ResourceContext/application/adapters/repositories/content.repository';
import { Result, ok, fail } from '../../../../../../shared-kernel/utils/Result';
import { Maybe } from '../../../../../../shared-kernel/utils/Maybe';
import {
  BadResourceTypeError,
  CannotFindResourceError,
} from '../../../../../../modules/ResourceContext/application/shared/Resource/resource.error';
import { ResourceTypeEnum } from '../../../../../../modules/ResourceContext/shared/types/Resource';
import { ResourceRepository } from '../../../../../../modules/ResourceContext/application/adapters/repositories/resource.repository';
import { CannotFindContentError } from './getXmlContent.error';

export class GetXmlContentQueryHandler {
  constructor(
    private readonly resourceRepository: ResourceRepository,
    private readonly contentRepository: ContentRepository,
  ) {}

  public async execute(
    resourceId: string,
    contentId: string,
  ): Promise<Result<Maybe<string>, Error>> {
    // check for linked resource
    const resourceResult = await this.resourceRepository.findOne(resourceId);

    if (resourceResult.fail) {
      return fail(new CannotFindResourceError(resourceId, resourceResult.fail));
    }

    const resource = resourceResult.ok;

    if (resource?.type === ResourceTypeEnum.Folder) {
      return fail(new BadResourceTypeError(resourceId));
    }

    const findContentResult = await this.contentRepository.findOne(contentId);

    if (findContentResult.fail) {
      return fail(
        new CannotFindContentError(contentId, findContentResult.fail),
      );
    }

    return ok(findContentResult.ok.state.content);
  }
}
