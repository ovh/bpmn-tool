import { UseCaseResult } from '../../../../../../shared-kernel/application/usecases/useCase';
import { CreateCommentCommand } from './createComment.command';
import { ResourceRepository } from '../../../../../../modules/ResourceContext/application/adapters/repositories/resource.repository';
import { CommentRepository } from '../../../../../../modules/ResourceContext/application/adapters/repositories/comment.repository';
import {
  BadResourceTypeError,
  CannotFindResourceError,
} from '../../../../../../modules/ResourceContext/application/shared/Resource/resource.error';
import { ResourceTypeEnum } from '../../../../../../modules/ResourceContext/shared/types/Resource';
import { ok, fail } from '../../../../../../shared-kernel/utils/Result';
import { Comment } from '../../../../../../modules/ResourceContext/domain/Comment/Comment';
import { CannotCreateCommentError } from './createComment.error';

export class CreateCommentCommandHandler {
  constructor(
    private readonly resourceRepository: ResourceRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  public async execute(
    command: CreateCommentCommand,
  ): Promise<UseCaseResult<Comment>> {
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

    const comment = Comment.apply({
      ...command,
    });

    const createResult = await this.commentRepository.save(comment);

    if (createResult.fail) {
      return fail(new CannotCreateCommentError(createResult.fail));
    }

    return ok(createResult.ok);
  }
}
