import { UseCaseError } from '../../../../../../shared-kernel/application/usecases/useCaseError';

export class CannotListContentsError extends UseCaseError {
  constructor(resourceId: string, error: Error) {
    super(`Cannot list contents for resourceId ${resourceId}`, error);
  }
}
