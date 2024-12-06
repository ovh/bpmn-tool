import { UuidGenerator } from '../uuid-generator';
import { randomUUID } from 'node:crypto';

export class RealUuidGenerator implements UuidGenerator {
  generate(): string {
    return randomUUID();
  }
}
