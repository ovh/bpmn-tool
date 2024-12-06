import { DomainEvent } from '../domain-event';

export interface DomainEventRepository {
  save(domainEvent: DomainEvent): void;
}
