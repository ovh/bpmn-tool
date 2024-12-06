import { UseCaseError } from '../../../../../../shared-kernel/application/usecases/useCaseError';

export class CannotCreateContentError extends UseCaseError {
  constructor(error: Error) {
    super(`Cannot create content: `, error);
  }
}
