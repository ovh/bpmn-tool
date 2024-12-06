import { redirect } from 'react-router-dom';

import { isValidResourceType } from '../../shared/helpers/resource';

export const loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const type = url.searchParams.get('type');

  // avoid accessing route without type
  if (!type || !isValidResourceType(type)) {
    return redirect('..');
  }

  return {
    type,
  };
};
