import { ContentRepository } from '../../../../../../modules/ResourceContext/application/adapters/repositories/content.repository';
import { ResourceRepository } from '../../../../../../modules/ResourceContext/application/adapters/repositories/resource.repository';
import { CannotFindResourceError } from '../../Resource/updateResource/updateResource.error';
import { BadResourceTypeError } from '../../../../../../modules/ResourceContext/application/shared/Resource/resource.error';
import { ResourceTypeEnum } from '../../../../../../modules/ResourceContext/shared/types/Resource';
import { ok, fail } from '../../../../../../shared-kernel/utils/Result';
import { CannotDeleteContentError } from './deleteContent.error';
import { DeleteContentCommandParams } from './deleteContent.command';
import { UseCaseResult } from '../../../../../../shared-kernel/application/usecases/useCase';

export class DeleteContentCommandHandler {
  constructor(
    private readonly resourceRepository: ResourceRepository,
    private readonly contentRepository: ContentRepository,
  ) {}

  public async execute(
    command: DeleteContentCommandParams,
  ): Promise<UseCaseResult<boolean>> {
    const { resourceId, contentId } = command;

    // check for linked resource
    const resourceResult = await this.resourceRepository.findOne(resourceId);

    if (resourceResult.fail) {
      return fail(new CannotFindResourceError(resourceId, resourceResult.fail));
    }

    const resource = resourceResult.ok;

    if (resource?.type === ResourceTypeEnum.Folder) {
      return fail(new BadResourceTypeError(resourceId));
    }

    const deleteResult = await this.contentRepository.delete(contentId);

    if (deleteResult.fail) {
      return fail(new CannotDeleteContentError(contentId, deleteResult.fail));
    }

    return ok(deleteResult.ok);
  }
}
