import { UseCaseError } from '../../../../../../shared-kernel/application/usecases/useCaseError';

export class BadContentStatusForCloningError extends UseCaseError {
  constructor(contentId: string) {
    super(
      `Can't clone content with contentId ${contentId} as its status is draft`,
    );
  }
}

export class DraftContentExistsError extends UseCaseError {
  constructor(contentId: string, resourceId: string) {
    super(
      `Can't clone content with contentId ${contentId} as its resource ('${resourceId}') has a content in draft status.`,
    );
  }
}

export class CannotCloneContentError extends UseCaseError {
  constructor(contentId: string, error: Error) {
    super(`Can't clone content with contentId ${contentId}.`, error);
  }
}
