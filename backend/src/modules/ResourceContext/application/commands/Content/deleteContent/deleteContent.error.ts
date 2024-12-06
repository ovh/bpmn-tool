import { UseCaseError } from '../../../../../../shared-kernel/application/usecases/useCaseError';

export class CannotDeleteContentError extends UseCaseError {
  constructor(contentId: string, error: Error) {
    super(`Cannot delete content with contentId '${contentId}'.`, error);
  }
}
