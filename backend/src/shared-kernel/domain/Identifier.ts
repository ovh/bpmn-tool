export class Identifier<T> {
  get value(): T {
    return this.internalValue;
  }

  constructor(private readonly internalValue: T) {}

  equals(id?: Identifier<T>): boolean {
    if (!id) {
      return false;
    }

    if (!(id instanceof this.constructor)) {
      return false;
    }

    return id.value === this.value;
  }

  toString() {
    return String(this.value);
  }
}
