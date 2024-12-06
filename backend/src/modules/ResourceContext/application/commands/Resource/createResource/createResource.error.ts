import { UseCaseError } from '../../../../../../shared-kernel/application/usecases/useCaseError';

export class CannotFindParentResourceError extends UseCaseError {
  constructor(error: Error) {
    super(`Cannot find parent resource: `, error);
  }
}

export class CannotCreateResourceError extends UseCaseError {
  constructor(error: Error) {
    super(`Cannot create resource: `, error);
  }
}
