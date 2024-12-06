import { DomainEvent } from '../domain-event/domain-event';

export interface EventEmitter {
  emit(event: DomainEvent): void;
}
