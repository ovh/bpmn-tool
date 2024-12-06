import { Comment } from '../../../../modules/ResourceContext/domain/Comment/Comment';
import { CommentPresenter } from '../presenters/comment.presenter';
import { CommentTypeOrmEntity } from '../entities/comment.ormEntity';
import { Result, ok } from '../../../../shared-kernel/utils/Result';
import { Uuid } from '../../../../shared-kernel/utils/Uuid';

export class CommentMapper {
  static fromPersistence(source: CommentTypeOrmEntity): Result<Comment, Error> {
    return ok(
      Comment.apply(
        {
          resourceId: source.resourceId,
          comment: source.comment,
          createdBy: source.createdBy,
          createdAt: source.createdAt,
          updatedBy: source.updatedBy,
          updatedAt: source.updatedAt,
        },
        new Uuid(source.id),
      ),
    );
  }

  static toPersistence(source: Comment): CommentTypeOrmEntity {
    const commentEntity = new CommentTypeOrmEntity();

    commentEntity.id = source.id.value;
    commentEntity.resourceId = source.state.resourceId;
    commentEntity.comment = source.state.comment;
    commentEntity.createdBy = source.state.createdBy;

    if (source.state.createdAt) {
      commentEntity.createdAt = source.state.createdAt;
    }
    if (source.state.updatedBy) {
      commentEntity.updatedBy = source.state.updatedBy;
    }
    if (source.state.updatedAt) {
      commentEntity.updatedAt = source.state.updatedAt;
    }

    return commentEntity;
  }

  static toPresenter(source: Comment): CommentPresenter {
    const commentPresenter = new CommentPresenter();

    commentPresenter.id = source.id.value;
    commentPresenter.resourceId = source.state.resourceId;
    commentPresenter.comment = source.state.comment;
    commentPresenter.createdBy = source.state.createdBy;
    commentPresenter.updatedBy = source.state.updatedBy || null;

    if (source.state.createdAt instanceof Date) {
      commentPresenter.createdAt = source.state.createdAt.toISOString();
    }
    if (source.state.updatedAt instanceof Date) {
      commentPresenter.updatedAt = source.state.updatedAt.toISOString();
    }

    return commentPresenter;
  }
}
