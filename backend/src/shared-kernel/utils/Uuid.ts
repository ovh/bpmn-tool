import { Nullable } from './Nullable';
import { Identifier } from '../domain/Identifier';
import { randomUUID } from 'node:crypto';

export class Uuid extends Identifier<string> {
  constructor(id?: Nullable<string>) {
    super(id || randomUUID());
  }
}
