import { DomainEventRepository } from '../domain-event-repository';
import { ContentCreatedEvent } from '../../events/contentCreated.event';

type DomainEvents = ContentCreatedEvent;

type DomainEventMap = Record<string, DomainEvents>;
export class StubDomainEventRepository implements DomainEventRepository {
  public domainEvents: DomainEventMap = {};
  save(domainEvent: DomainEvents): void {
    this.domainEvents[domainEvent.id] = domainEvent;
    return;
  }
}
