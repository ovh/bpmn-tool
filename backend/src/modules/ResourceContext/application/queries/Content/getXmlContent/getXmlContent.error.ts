import { UseCaseError } from '../../../../../../shared-kernel/application/usecases/useCaseError';

export class CannotFindContentError extends UseCaseError {
  constructor(contentId: string, error: Error) {
    super(`Cannot find content with contentId "${contentId}".`, error);
  }
}
