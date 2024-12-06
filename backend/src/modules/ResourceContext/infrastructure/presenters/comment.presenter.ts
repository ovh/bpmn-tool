import { Nullable } from '../../../../shared-kernel/utils/Nullable';

export class CommentPresenter {
  id: string;
  resourceId: string;
  comment: string;
  createdBy: string;
  createdAt: string;
  updatedBy: Nullable<string>;
  updatedAt: Nullable<string>;
}
