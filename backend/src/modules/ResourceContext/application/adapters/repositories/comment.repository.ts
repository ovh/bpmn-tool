import { Result } from '../../../../../shared-kernel/utils/Result';
import { Comment } from '../../../../../modules/ResourceContext/domain/Comment/Comment';
import { SortCommand } from '../../../../../shared-kernel/utils/SortCommand';

export interface CommentRepository {
  save(comment: Comment): Promise<Result<Comment, Error>>;
  delete(commentId: string): Promise<Result<boolean, Error>>;

  findOne(commentId: string): Promise<Result<Comment, Error>>;
  find(
    commentId: string,
    sort?: SortCommand,
  ): Promise<Result<Comment[], Error | Error[]>>;
}
