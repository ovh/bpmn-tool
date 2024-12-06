import type { HttpError } from '../api/httpError';

export type ActionResponse = {
  error?: HttpError;
  formAction?: string;
};
