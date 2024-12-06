export abstract class UseCaseError extends Error {
  protected constructor(
    public readonly message: string,
    error?: Error,
  ) {
    super(`${message}${error ? ' - ' + error.message : ''}`);
  }
}
