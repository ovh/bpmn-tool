type ErrorResponse = {
  error: string;
  message: string[] | string;
  statusCode: number;
};

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly errorResponse: ErrorResponse,
  ) {
    super(`Request failed with status code ${status} ${statusText}`);
  }

  static is404(error: Error) {
    return error instanceof HttpError && error.status === 404;
  }
}
