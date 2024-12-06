import { CommentRepository } from '../../../../../../modules/ResourceContext/application/adapters/repositories/comment.repository';
import { Result, fail } from '../../../../../../shared-kernel/utils/Result';
import { Maybe } from '../../../../../../shared-kernel/utils/Maybe';
import { Comment } from '../../../../../../modules/ResourceContext/domain/Comment/Comment';
import {
  BadResourceTypeError,
  CannotFindResourceError,
} from '../../../../../../modules/ResourceContext/application/shared/Resource/resource.error';
import { ResourceTypeEnum } from '../../../../../../modules/ResourceContext/shared/types/Resource';
import { ResourceRepository } from '../../../../../../modules/ResourceContext/application/adapters/repositories/resource.repository';

export class GetCommentQueryHandler {
  constructor(
    private readonly resourceRepository: ResourceRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  public async execute(
    resourceId: string,
    commentId: string,
  ): Promise<Result<Maybe<Comment>, Error>> {
    // check for linked resource
    const resourceResult = await this.resourceRepository.findOne(resourceId);

    if (resourceResult.fail) {
      return fail(new CannotFindResourceError(resourceId, resourceResult.fail));
    }

    const resource = resourceResult.ok;

    if (resource?.type === ResourceTypeEnum.Folder) {
      return fail(new BadResourceTypeError(resourceId));
    }

    return this.commentRepository.findOne(commentId);
  }
}
