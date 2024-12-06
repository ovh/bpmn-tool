import { ContentStatusEnum } from '../../../../modules/ResourceContext/shared/types/Content';
import { Nullable } from '../../../../shared-kernel/utils/Nullable';
import { Uuid } from '../../../../shared-kernel/utils/Uuid';

// type ContentStatus = 'published' | 'draft' | 'obsolete';

export type ContentProps = {
  resourceId: string;
  content: string;
  pngContent?: Nullable<Uint8Array>;
  status?: ContentStatusEnum;
  version?: number;
  createdBy: string;
  createdAt?: Nullable<Date>;
  updatedBy?: Nullable<string>;
  updatedAt?: Nullable<Date>;
};

export class Content {
  protected readonly internalId: Uuid;

  constructor(
    private _stateProps: ContentProps,
    id?: Uuid,
  ) {
    this.internalId = id || new Uuid();
  }

  get id(): Uuid {
    return this.internalId;
  }

  get state(): ContentProps {
    return this._stateProps;
  }

  // Used as mapper when we will have ValueObjects
  public restore() {
    return this.state;
  }

  public updateContent(content: string, updatedBy: string) {
    this.state.content = content;
    this.state.updatedBy = updatedBy;
  }

  public makeObsolete(updatedBy: string) {
    this.state.status = ContentStatusEnum.Obsolete;
    this.state.updatedBy = updatedBy;
    this.state.pngContent = null;
  }

  public publish(updatedBy: string, pngContent: string) {
    this.state.status = ContentStatusEnum.Published;
    this.state.updatedBy = updatedBy;
    this.state.pngContent = Buffer.from(
      pngContent.replace(/^data:image\/png;base64,/, ''),
      'base64',
    );
  }

  static bumbVersion(version?: number) {
    return version ? version + 1 : 1;
  }

  static apply(props: ContentProps, id?: Uuid): Content {
    return new Content(
      {
        ...props,
        version: props.version,
        status: props.status || ContentStatusEnum.Draft,
        createdAt: props.createdAt === undefined ? null : props.createdAt,
        updatedAt: props.updatedAt === undefined ? null : props.updatedAt,
        updatedBy: props.updatedBy || props.createdBy,
      },
      id,
    );
  }
}
