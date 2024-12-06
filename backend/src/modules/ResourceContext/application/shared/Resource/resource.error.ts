import { UseCaseError } from '../../../../../shared-kernel/application/usecases/useCaseError';

export class CannotFindResourceError extends UseCaseError {
  constructor(resourceId: string, error: Error) {
    super(`Cannot find resource with id '${resourceId}'.`, error);
  }
}

export class BadResourceTypeError extends UseCaseError {
  constructor(resourceId: string) {
    super(
      `The type of the resource with id '${resourceId}' is incompatible with content. Content is only available for resource with process type.`,
    );
  }
}
