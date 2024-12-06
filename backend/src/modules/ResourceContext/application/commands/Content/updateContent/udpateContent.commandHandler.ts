import { ContentRepository } from '../../../../../../modules/ResourceContext/application/adapters/repositories/content.repository';
import { ResourceRepository } from '../../../../../../modules/ResourceContext/application/adapters/repositories/resource.repository';
import { Content } from '../../../../../../modules/ResourceContext/domain/Content/Content';
import { Result, ok, fail } from '../../../../../../shared-kernel/utils/Result';
import {
  BadResourceTypeError,
  CannotFindResourceError,
} from '../../../../../../modules/ResourceContext/application/shared/Resource/resource.error';
import { ResourceTypeEnum } from '../../../../../../modules/ResourceContext/shared/types/Resource';
import { CannotSaveContentError } from './updateContent.error';
import { CannotFindContentError } from '../content.error';
import { UpdateContentCommand } from './updateContent.command';

export class UpdateContentCommandHandler {
  constructor(
    private readonly resourceRepository: ResourceRepository,
    private readonly contentRepository: ContentRepository,
  ) {}

  public async execute(
    resourceId: string,
    contentId: string,
    command: UpdateContentCommand,
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

    content.updateContent(command.content, command.updatedBy);

    const updateResult = await this.contentRepository.save(content);

    if (updateResult.fail) {
      return fail(new CannotSaveContentError(contentId, updateResult.fail));
    }

    return ok(updateResult.ok);
  }
}
