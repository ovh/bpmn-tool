import { UseCaseError } from '../../../../../../shared-kernel/application/usecases/useCaseError';

export class CannotDeleteCommentError extends UseCaseError {
  constructor(commentId: string, error: Error) {
    super(`Cannot delete comment with commentId '${commentId}'.`, error);
  }
}
