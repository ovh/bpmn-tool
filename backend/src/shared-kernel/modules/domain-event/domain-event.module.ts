import { Module } from '@nestjs/common';
import { StubDomainEventRepository } from './repository/stub/stub-domain-event-repository';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: 'DomainEventRepository',
      useFactory: () => new StubDomainEventRepository(),
    },
  ],
  exports: ['DomainEventRepository'],
})
export class DomainEventModule {}
