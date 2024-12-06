import { Nullable } from '../../utils/Nullable';
type Presenter = {
  id: string;
  consumedAt: Nullable<Date>;
};
export abstract class DomainEvent<TPayload = unknown> {
  constructor(
    public id: string,
    public payload: TPayload,
    public type: string,
  ) {}

  public state: 'NEW' | 'PENDING' | 'CONSUMED' = 'NEW';

  public createdAt: Date = new Date();
  public consumedAt: Nullable<Date> = null;

  public restore(): Presenter & TPayload {
    return {
      id: this.id,
      consumedAt: this.consumedAt,
      ...this.payload,
    };
  }

  public consume() {
    this.state = 'CONSUMED';
    this.consumedAt = new Date();
  }
}
