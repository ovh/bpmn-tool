import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ResourceContextModule } from './modules/ResourceContext/resourceContext.module';
import { EventEmitterModule } from './shared-kernel/modules/event-emitter/event-emitter.module';
import { EventEmitterModule as NestEventEmitterModule } from '@nestjs/event-emitter';
import { UuidGeneratorModule } from './shared-kernel/modules/uuid-generator/uuid-generator.module';
import { DomainEventModule } from './shared-kernel/modules/domain-event/domain-event.module';
import { getTypeormConfig } from './shared-kernel/modules/infrastructure/db/typeorm/typeormConfig';
import { loadConfigFromEnv } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [loadConfigFromEnv],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: getTypeormConfig,
      inject: [ConfigService],
    }),
    ResourceContextModule,
    EventEmitterModule,
    UuidGeneratorModule,
    DomainEventModule,
    NestEventEmitterModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class BpmnToolAppModule {}
