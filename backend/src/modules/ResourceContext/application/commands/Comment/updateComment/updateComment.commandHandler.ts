import { CommentRepository } from '../../../../../../modules/ResourceContext/application/adapters/repositories/comment.repository';
import { ResourceRepository } from '../../../../../../modules/ResourceContext/application/adapters/repositories/resource.repository';
import { Comment } from '../../../../../../modules/ResourceContext/domain/Comment/Comment';
import { Result, ok, fail } from '../../../../../../shared-kernel/utils/Result';
import {
  BadResourceTypeError,
  CannotFindResourceError,
} from '../../../../../../modules/ResourceContext/application/shared/Resource/resource.error';
import { ResourceTypeEnum } from '../../../../../../modules/ResourceContext/shared/types/Resource';
import {
  CannotFindCommentError,
  CannotSaveCommentError,
} from './updateComment.error';
import { UpdateCommentCommand } from './updateComment.command';

export class UpdateCommentCommandHandler {
  constructor(
    private readonly resourceRepository: ResourceRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  public async execute(
    resourceId: string,
    commentId: string,
    command: UpdateCommentCommand,
  ): Promise<Result<Comment, Error>> {
    // check for linked resource
    const resourceResult = await this.resourceRepository.findOne(resourceId);

    if (resourceResult.fail) {
      return fail(new CannotFindResourceError(resourceId, resourceResult.fail));
    }

    const resource = resourceResult.ok;

    if (resource?.type === ResourceTypeEnum.Folder) {
      return fail(new BadResourceTypeError(resourceId));
    }

    const commentResult = await this.commentRepository.findOne(commentId);

    if (commentResult.fail) {
      return fail(new CannotFindCommentError(commentId, commentResult.fail));
    }

    const comment = commentResult.ok;

    comment.updateComment(command.comment, command.updatedBy);

    const updateResult = await this.commentRepository.save(comment);

    if (updateResult.fail) {
      return fail(new CannotSaveCommentError(commentId, updateResult.fail));
    }

    return ok(updateResult.ok);
  }
}
