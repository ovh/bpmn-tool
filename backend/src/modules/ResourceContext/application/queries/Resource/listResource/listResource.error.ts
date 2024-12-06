import { UseCaseError } from '../../../../../../shared-kernel/application/usecases/useCaseError';

export class CannotListResourcesError extends UseCaseError {
  constructor(error: Error) {
    super(`Cannot list resources: `, error);
  }
}
