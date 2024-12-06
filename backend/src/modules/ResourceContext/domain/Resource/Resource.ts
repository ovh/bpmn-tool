import { Uuid } from '../../../../shared-kernel/utils/Uuid';
import { Nullable } from '../../../../shared-kernel/utils/Nullable';
import { ResourceName } from './ResourceName';
import { ResourceTypeEnum } from '../../shared/types/Resource';

export type ResourceProps = {
  name: ResourceName;
  depth?: number;
  description: Nullable<string>;
  parentId?: Nullable<string>;
  type: ResourceTypeEnum;
  createdBy: string;
  authToken?: Nullable<string>;
};

export class Resource {
  protected readonly internalId: Uuid;

  constructor(
    private _stateProps: ResourceProps,
    id?: Uuid,
  ) {
    this.internalId = id || new Uuid();
  }

  get id(): Uuid {
    return this.internalId;
  }

  get name(): string {
    return this.state.name.value;
  }

  get description(): Nullable<string> {
    return this.state.description;
  }

  get depth(): number {
    return this.state.depth || 0;
  }

  get parentId(): Nullable<string> {
    return this.state.parentId || null;
  }

  get type(): ResourceTypeEnum {
    return this.state.type;
  }

  get createdBy(): string {
    return this.state.createdBy;
  }

  get authToken(): Nullable<string> {
    return this.state.authToken || null;
  }

  get state(): ResourceProps {
    return this._stateProps;
  }

  // Used as mapper when we will have ValueObjects
  public restore() {
    return this.state;
  }

  public move(parentDepth?: number) {
    this.state.depth = Resource.computeDepth(parentDepth);
  }

  public rename(name: string) {
    this.state.name.value = name;
  }

  public changeDescription(description: string) {
    this.state.description = description;
  }

  public updateAuthToken(authToken: string) {
    this.state.authToken = authToken;
  }

  static apply(props: ResourceProps, id?: Uuid): Resource {
    return new Resource(
      {
        name: props.name,
        description: props.description,
        parentId: props.parentId || null,
        depth: props.depth,
        type: props.type,
        createdBy: props.createdBy,
        authToken: props.authToken,
      },
      id,
    );
  }

  static computeDepth(parentDepth?: number) {
    return typeof parentDepth === 'number' ? parentDepth + 1 : 0;
  }
}
