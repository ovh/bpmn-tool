import { UseCaseError } from '../../../../../../shared-kernel/application/usecases/useCaseError';

export class CannotCreateCommentError extends UseCaseError {
  constructor(error: Error) {
    super(`Cannot create content: `, error);
  }
}
