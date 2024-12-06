import { EventEmitter2 } from '@nestjs/event-emitter';
import { DomainEvent } from '../../domain-event/domain-event';
import { EventEmitter } from '../event-emitter';

export class NestEventEmitter implements EventEmitter {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  public emit(event: DomainEvent) {
    this.eventEmitter.emit(event.type, event);
  }
}
