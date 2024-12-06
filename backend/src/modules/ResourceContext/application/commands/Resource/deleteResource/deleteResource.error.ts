import { UseCaseError } from '../../../../../../shared-kernel/application/usecases/useCaseError';

export class CannotDeleteResourceError extends UseCaseError {
  constructor(error: Error) {
    super(`Cannot delete resource: `, error);
  }
}
