import { UuidGenerator } from '../uuid-generator';

export class StubUuidGenerator implements UuidGenerator {
  private uuid = 0;
  generate(): string {
    this.next();
    return this.uuid.toString();
  }

  next(): void {
    this.uuid++;
  }

  currentUuid(newUuid: number) {
    this.uuid = newUuid;
  }
}
