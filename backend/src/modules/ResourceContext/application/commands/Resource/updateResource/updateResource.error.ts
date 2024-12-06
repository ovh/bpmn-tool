import { UseCaseError } from '../../../../../../shared-kernel/application/usecases/useCaseError';

export class CannotFindResourceError extends UseCaseError {
  constructor(resourceId: string, error: Error) {
    super(
      `Cannot find resource to edit. '${resourceId}' does not exist: `,
      error,
    );
  }
}

export class CannotSaveResourceError extends UseCaseError {
  constructor(resourceId: string, error: Error) {
    super(`Cannot save resource with id '${resourceId}': `, error);
  }
}
