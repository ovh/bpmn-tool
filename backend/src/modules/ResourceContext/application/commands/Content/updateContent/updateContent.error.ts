import { UseCaseError } from '../../../../../../shared-kernel/application/usecases/useCaseError';

export class CannotSaveContentError extends UseCaseError {
  constructor(contentId: string, error: Error) {
    super(`Cannot save content with contentId '${contentId}'.`, error);
  }
}
