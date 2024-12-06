import { ContentRepository } from '../../../../../../modules/ResourceContext/application/adapters/repositories/content.repository';
import { ResourceRepository } from '../../../../../../modules/ResourceContext/application/adapters/repositories/resource.repository';

import {
  BadResourceTypeError,
  CannotFindResourceError,
} from '../../../../../../modules/ResourceContext/application/shared/Resource/resource.error';
import { ContentStatusEnum } from '../../../../../../modules/ResourceContext/shared/types/Content';
import { ResourceTypeEnum } from '../../../../../../modules/ResourceContext/shared/types/Resource';
import { Result, ok, fail } from '../../../../../../shared-kernel/utils/Result';
import { Content } from '../../../../../../modules/ResourceContext/domain/Content/Content';
import {
  BadContentStatusForPublishError,
  CannotPublishContentError,
  CannotUpdateAuthTokenError,
} from './publishContent.error';
import {
  CannotFindContentError,
  GetLastPublishedContentError,
} from '../content.error';
import { PublishContentCommand } from './publishContent.command';
import { randomBytes } from 'crypto';

export class PublishContentCommandHandler {
  constructor(
    private readonly resourceRepository: ResourceRepository,
    private readonly contentRepository: ContentRepository,
  ) {}

  public async execute(
    resourceId: string,
    contentId: string,
    command: PublishContentCommand,
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

    if (
      content.state.status &&
      content.state.status !== ContentStatusEnum.Draft
    ) {
      return fail(
        new BadContentStatusForPublishError(contentId, content.state.status),
      );
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

    const lastPublishedContent = lastPublishedContentResult.ok;
    if (lastPublishedContent) {
      lastPublishedContent.makeObsolete(command.updatedBy);
      await this.contentRepository.save(lastPublishedContent);
    }

    // publish desired content
    content.publish(command.updatedBy, command.pngContent);

    const updateResult = await this.contentRepository.save(content);

    if (updateResult.fail) {
      return fail(new CannotPublishContentError(contentId, updateResult.fail));
    }

    // update resource authToken if not present
    if (resource && !resource.authToken) {
      resource.updateAuthToken(randomBytes(32).toString('hex'));

      const updateResourceResult = await this.resourceRepository.save(resource);

      if (updateResourceResult.fail) {
        return fail(
          new CannotUpdateAuthTokenError(
            resource.id.value,
            updateResourceResult.fail,
          ),
        );
      }
    }

    return ok(updateResult.ok);
  }
}
