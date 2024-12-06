import { Module } from '@nestjs/common';
import { RealUuidGenerator } from './implem/real-uuid-generator';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: 'UuidGenerator',
      useFactory: () => new RealUuidGenerator(),
    },
  ],
  exports: ['UuidGenerator'],
})
export class UuidGeneratorModule {}
