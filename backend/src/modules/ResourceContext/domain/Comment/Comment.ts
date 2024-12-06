import { Nullable } from '../../../../shared-kernel/utils/Nullable';
import { Uuid } from '../../../../shared-kernel/utils/Uuid';

export type CommentProps = {
  resourceId: string;
  comment: string;
  createdBy: string;
  createdAt?: Nullable<Date>;
  updatedBy?: Nullable<string>;
  updatedAt?: Nullable<Date>;
};

export class Comment {
  protected readonly internalId: Uuid;

  constructor(
    private _stateProps: CommentProps,
    id?: Uuid,
  ) {
    this.internalId = id || new Uuid();
  }

  get id(): Uuid {
    return this.internalId;
  }

  get state(): CommentProps {
    return this._stateProps;
  }

  // Used as mapper when we will have ValueObjects
  public restore() {
    return this.state;
  }

  public updateComment(comment: string, updateBy: string) {
    this.state.comment = comment;
    this.state.updatedBy = updateBy;
  }

  static apply(props: CommentProps, id?: Uuid): Comment {
    return new Comment(
      {
        ...props,
        createdAt: props.createdAt === undefined ? null : props.createdAt,
        updatedAt: props.updatedAt === undefined ? null : props.updatedAt,
        updatedBy: props.updatedBy || props.createdBy,
      },
      id,
    );
  }
}
