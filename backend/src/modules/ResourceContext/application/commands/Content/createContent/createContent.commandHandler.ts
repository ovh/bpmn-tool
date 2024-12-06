import { UseCaseResult } from '../../../../../../shared-kernel/application/usecases/useCase';
import { CreateContentCommand } from './createContent.command';
import { ResourceRepository } from '../../../../../../modules/ResourceContext/application/adapters/repositories/resource.repository';
import { ContentRepository } from '../../../../../../modules/ResourceContext/application/adapters/repositories/content.repository';
import {
  BadResourceTypeError,
  CannotFindResourceError,
} from '../../../../../../modules/ResourceContext/application/shared/Resource/resource.error';
import { ResourceTypeEnum } from '../../../../../../modules/ResourceContext/shared/types/Resource';
import { ok, fail } from '../../../../../../shared-kernel/utils/Result';
import { Content } from '../../../../../../modules/ResourceContext/domain/Content/Content';
import { CannotCreateContentError } from './createContent.error';
import { ContentStatusEnum } from '../../../../../../modules/ResourceContext/shared/types/Content';
import { GetLastPublishedContentError } from '../content.error';

export class CreateContentCommandHandler {
  constructor(
    private readonly resourceRepository: ResourceRepository,
    private readonly contentRepository: ContentRepository,
  ) {}

  public async execute(
    command: CreateContentCommand,
  ): Promise<UseCaseResult<Content>> {
    const { resourceId } = command;
    // check for linked resource
    const resourceResult = await this.resourceRepository.findOne(resourceId);

    if (resourceResult.fail) {
      return fail(new CannotFindResourceError(resourceId, resourceResult.fail));
    }

    const resource = resourceResult.ok;

    if (resource?.type === ResourceTypeEnum.Folder) {
      return fail(new BadResourceTypeError(resourceId));
    }

    // if an other published version exist, deprecate it
    const lastPublishedContentResult = await this.contentRepository.findOneBy({
      resourceId,
      status: ContentStatusEnum.Published,
    });

    if (lastPublishedContentResult.fail) {
      return fail(
        new GetLastPublishedContentError(
          resourceId,
          lastPublishedContentResult.fail,
        ),
      );
    }

    const content = Content.apply({
      ...command,
      version: Content.bumbVersion(
        lastPublishedContentResult.ok?.state.version,
      ),
    });

    const createResult = await this.contentRepository.save(content);

    if (createResult.fail) {
      return fail(new CannotCreateContentError(createResult.fail));
    }

    return ok(createResult.ok);
  }
}
