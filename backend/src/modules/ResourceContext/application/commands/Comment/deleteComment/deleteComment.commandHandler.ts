import { CommentRepository } from '../../../../../../modules/ResourceContext/application/adapters/repositories/comment.repository';
import { ResourceRepository } from '../../../../../../modules/ResourceContext/application/adapters/repositories/resource.repository';
import { CannotFindResourceError } from '../../Resource/updateResource/updateResource.error';
import { BadResourceTypeError } from '../../../../../../modules/ResourceContext/application/shared/Resource/resource.error';
import { ResourceTypeEnum } from '../../../../../../modules/ResourceContext/shared/types/Resource';
import { ok, fail } from '../../../../../../shared-kernel/utils/Result';
import { CannotDeleteCommentError } from './deleteComment.error';
import { DeleteCommentCommandParams } from './deleteComment.command';
import { UseCaseResult } from '../../../../../../shared-kernel/application/usecases/useCase';

export class DeleteCommentCommandHandler {
  constructor(
    private readonly resourceRepository: ResourceRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  public async execute(
    command: DeleteCommentCommandParams,
  ): Promise<UseCaseResult<boolean>> {
    const { resourceId, commentId } = command;

    // check for linked resource
    const resourceResult = await this.resourceRepository.findOne(resourceId);

    if (resourceResult.fail) {
      return fail(new CannotFindResourceError(resourceId, resourceResult.fail));
    }

    const resource = resourceResult.ok;

    if (resource?.type === ResourceTypeEnum.Folder) {
      return fail(new BadResourceTypeError(resourceId));
    }

    const deleteResult = await this.commentRepository.delete(commentId);

    if (deleteResult.fail) {
      return fail(new CannotDeleteCommentError(commentId, deleteResult.fail));
    }

    return ok(deleteResult.ok);
  }
}
