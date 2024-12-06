import { EventEmitter } from '../event-emitter';
import { DomainEvent } from '../../domain-event/domain-event';

export class StubEventEmitter implements EventEmitter {
  public events: DomainEvent[] = [];
  emit(event: DomainEvent) {
    this.events.push(event);
  }
}
