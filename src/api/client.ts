import { create, isAxiosError } from 'axios';

import { config } from '@/api/config';
import { getSubId } from '@/api/sub-id';

declare module 'axios' {
  interface AxiosRequestConfig {
    // Opt a request out of sub_id scoping (votes are anonymous, see votes.ts).
    scopeToUser?: boolean;
  }
}

export const catApi = create({
  baseURL: config.catApiBaseUrl,
  headers: { 'x-api-key': config.catApiKey },
});

// Scope ownership requests (images, favourites) to this device's sub_id: reads
// are filtered by it, writes are tagged with it. See sub-id.ts for the rationale.
catApi.interceptors.request.use(async (request) => {
  if (request.scopeToUser === false) return request;

  const subId = await getSubId();
  const method = request.method?.toLowerCase();

  if (method === 'post' || method === 'put' || method === 'patch') {
    if (request.data instanceof FormData) {
      request.data.append('sub_id', subId);
    } else {
      request.data = { ...request.data, sub_id: subId };
    }
  } else {
    request.params = { ...request.params, sub_id: subId };
  }

  return request;
});

// TheCatApi reports errors as either a plain-string body or {message}.
export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data === 'string' && data.length > 0) return data;
    if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
      return data.message;
    }
  }
  if (error instanceof Error && error.message) return error.message;
  return 'Something went wrong.';
}
