import { HttpError } from './httpError';

export type CreateApiClientOptions = {
  baseUrl: string;
};

export type ApiClient = {
  call: (url: string | URL, options?: RequestInit) => Promise<any>;
  get: (url: string | URL, options?: RequestInit) => Promise<any>;
  post: (url: string | URL, data: any, options?: RequestInit) => Promise<any>;
  put: (url: string | URL, data: any, options?: RequestInit) => Promise<any>;
  remove: (url: string | URL, options?: RequestInit) => Promise<any>;
};

export const createApiClient = ({
  baseUrl,
}: CreateApiClientOptions): ApiClient => {
  const addUrlPrefix = (url: string) => {
    return `${baseUrl.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`;
  };

  const call = async (url: string | URL, options: RequestInit = {}) => {
    const response = await fetch(
      url instanceof URL ? url.toString() : addUrlPrefix(url),
      {
        ...options,
        headers:
          'body' in options
            ? {
                ...options.headers,
                'content-type': 'application/json',
              }
            : { ...options.headers },
      },
    );
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new HttpError(response.status, response.statusText, errorResponse);
    }

    const contentLength = response.headers.get('Content-length');

    if (contentLength && parseInt(contentLength, 10) > 0) {
      const responseBody = await response.text();
      try {
        return JSON.parse(responseBody);
      } catch (error) {
        return responseBody;
      }
    }

    return {};
  };

  const get = async (url: string | URL, options: RequestInit = {}) => {
    return await call(url, options);
  };

  const post = async (
    url: string | URL,
    data: any,
    options: RequestInit = {},
  ) => {
    return await call(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  const put = async (
    url: string | URL,
    data: any,
    options: RequestInit = {},
  ) => {
    return await call(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  };

  const remove = async (url: string | URL, options: RequestInit = {}) => {
    return await call(url, {
      ...options,
      method: 'DELETE',
    });
  };

  return {
    call,
    get,
    post,
    put,
    remove,
  };
};
