import { UseCaseError } from '../../../../../../shared-kernel/application/usecases/useCaseError';

export class CannotListCommentsError extends UseCaseError {
  constructor(resourceId: string, error: Error) {
    super(`Cannot list comments for resourceId ${resourceId}: `, error);
  }
}
