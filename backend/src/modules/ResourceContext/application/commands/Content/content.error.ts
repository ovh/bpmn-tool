import { UseCaseError } from '../../../../../shared-kernel/application/usecases/useCaseError';

export class CannotFindContentError extends UseCaseError {
  constructor(contentId: string, error: Error) {
    super(`Content with contentId '${contentId}' does not exists.`, error);
  }
}

export class GetLastPublishedContentError extends UseCaseError {
  constructor(resourceId: string, error: Error) {
    super(
      `An error occurs while getting last published content of resource with resourceId ${resourceId}.`,
      error,
    );
  }
}
