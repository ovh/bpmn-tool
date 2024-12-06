import { Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NestEventEmitter } from './nestjs/nest-event-emitter';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: 'EventEmitter',
      useFactory: (eventEmitter: EventEmitter2) =>
        new NestEventEmitter(eventEmitter),
      inject: [EventEmitter2],
    },
  ],
  exports: ['EventEmitter'],
})
export class EventEmitterModule {}
