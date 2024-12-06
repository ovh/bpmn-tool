import { ContentStatusEnum } from '../../../../../../modules/ResourceContext/shared/types/Content';
import { UseCaseError } from '../../../../../../shared-kernel/application/usecases/useCaseError';

export class BadContentStatusForPublishError extends UseCaseError {
  constructor(contentId: string, contentStatus: ContentStatusEnum) {
    super(
      `Content with contentId '${contentId}' can't be published as its status ('${contentStatus}') is not 'draft'.`,
    );
  }
}

export class CannotPublishContentError extends UseCaseError {
  constructor(contentId: string, error: Error) {
    super(
      `An error occured when publishing content with contentId '${contentId}'.`,
      error,
    );
  }
}

export class CannotUpdateAuthTokenError extends UseCaseError {
  constructor(resourceId: string, error: Error) {
    super(
      `An error occured while updating authToken of resource with id '${resourceId}'.`,
      error,
    );
  }
}
