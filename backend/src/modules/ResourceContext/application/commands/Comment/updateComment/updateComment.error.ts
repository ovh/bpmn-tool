import { UseCaseError } from '../../../../../../shared-kernel/application/usecases/useCaseError';

export class CannotFindCommentError extends UseCaseError {
  constructor(commentId: string, error: Error) {
    super(`Comment with commentId '${commentId}' does not exists.`, error);
  }
}

export class CannotSaveCommentError extends UseCaseError {
  constructor(commentId: string, error: Error) {
    super(`Cannot save comment with commentId '${commentId}'.`, error);
  }
}
