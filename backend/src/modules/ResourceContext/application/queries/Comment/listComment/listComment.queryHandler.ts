import { ResourceRepository } from '../../../../../../modules/ResourceContext/application/adapters/repositories/resource.repository';
import { ResourceTypeEnum } from '../../../../../../modules/ResourceContext/shared/types/Resource';
import { UseCaseResult } from '../../../../../../shared-kernel/application/usecases/useCase';
import { ok, fail } from '../../../../../../shared-kernel/utils/Result';

import {
  BadResourceTypeError,
  CannotFindResourceError,
} from '../../../../../../modules/ResourceContext/application/shared/Resource/resource.error';
import { CommentRepository } from '../../../../../../modules/ResourceContext/application/adapters/repositories/comment.repository';
import { CannotListCommentsError } from './listComment.error';
import { Comment } from '../../../../../../modules/ResourceContext/domain/Comment/Comment';

import type { ListCommentQuery } from './listComment.query';

export class ListCommentQueryHandler {
  constructor(
    private readonly resourceRepository: ResourceRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  public async execute(
    resourceId: string,
    query?: ListCommentQuery,
  ): Promise<UseCaseResult<Comment[]>> {
    // check for linked resource
    const resourceResult = await this.resourceRepository.findOne(resourceId);

    if (resourceResult.fail) {
      return fail(new CannotFindResourceError(resourceId, resourceResult.fail));
    }

    const resource = resourceResult.ok;

    if (resource?.type === ResourceTypeEnum.Folder) {
      return fail(new BadResourceTypeError(resourceId));
    }

    const queryResult = await this.commentRepository.find(
      resourceId,
      query?.sort,
    );

    if (queryResult.fail) {
      return fail(
        new CannotListCommentsError(resourceId, queryResult.fail as Error),
      );
    }

    return ok(queryResult.ok);
  }
}
