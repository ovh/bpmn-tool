import { ContentRepository } from '../../../../../../modules/ResourceContext/application/adapters/repositories/content.repository';
import { ResourceRepository } from '../../../../../../modules/ResourceContext/application/adapters/repositories/resource.repository';
import { Result, ok, fail } from '../../../../../../shared-kernel/utils/Result';
import { Content } from '../../../../../../modules/ResourceContext/domain/Content/Content';
import {
  BadResourceTypeError,
  CannotFindResourceError,
} from '../../../../../../modules/ResourceContext/application/shared/Resource/resource.error';
import { ResourceTypeEnum } from '../../../../../../modules/ResourceContext/shared/types/Resource';
import {
  CannotFindContentError,
  GetLastPublishedContentError,
} from '../content.error';
import { ContentStatusEnum } from '../../../../../../modules/ResourceContext/shared/types/Content';
import {
  BadContentStatusForCloningError,
  CannotCloneContentError,
  DraftContentExistsError,
} from './cloneContent.error';

import type { CloneContentCommand } from './cloneContent.command';

export class CloneContentCommandHandler {
  constructor(
    private readonly resourceRepository: ResourceRepository,
    private readonly contentRepository: ContentRepository,
  ) {}

  public async execute(
    resourceId: string,
    contentId: string,
    command: CloneContentCommand,
  ): Promise<Result<Content, Error>> {
    // check for linked resource
    const resourceResult = await this.resourceRepository.findOne(resourceId);

    if (resourceResult.fail) {
      return fail(new CannotFindResourceError(resourceId, resourceResult.fail));
    }

    const resource = resourceResult.ok;

    if (resource?.type === ResourceTypeEnum.Folder) {
      return fail(new BadResourceTypeError(resourceId));
    }

    const contentResult = await this.contentRepository.findOne(contentId);

    if (contentResult.fail) {
      return fail(new CannotFindContentError(contentId, contentResult.fail));
    }

    const content = contentResult.ok;

    if (content.state.status === ContentStatusEnum.Draft) {
      return fail(new BadContentStatusForCloningError(contentId));
    }

    // if an other draft version exist, disable clone
    const draftContentResult = await this.contentRepository.findOneBy({
      resourceId,
      status: ContentStatusEnum.Draft,
    });

    const draftContent = draftContentResult.ok;
    if (draftContent) {
      return fail(new DraftContentExistsError(contentId, resourceId));
    }

    // get last published content to determine the new version
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

    const clonedContent = Content.apply({
      resourceId,
      content: content.state.content,
      status: ContentStatusEnum.Draft,
      createdBy: command.clonedBy,
      version: Content.bumbVersion(
        lastPublishedContentResult.ok?.state.version,
      ),
    });

    const createResult = await this.contentRepository.save(clonedContent);

    if (createResult.fail) {
      return fail(new CannotCloneContentError(contentId, createResult.fail));
    }

    return ok(createResult.ok);
  }
}
