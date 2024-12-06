import { ApiQuery } from './types';

export const buildQuery = (query: ApiQuery = {}) => {
  const searchParams = new URLSearchParams();

  if (query?.sort?.by !== undefined) {
    searchParams.append(`sort.by`, query.sort.by);
  }
  if (query?.sort?.order !== undefined) {
    searchParams.append(`sort.order`, query.sort.order);
  }

  return searchParams.toString();
};
