type QueryValue = string | number | boolean | null | undefined;

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');
const ensureLeadingSlash = (value: string) =>
  value.startsWith('/') ? value : `/${value}`;

const joinUrl = (base: string, path: string) =>
  `${trimTrailingSlash(base)}${ensureLeadingSlash(path)}`;

const envName = import.meta.env.VITE_ENV_NAME || '';
const apiHost = (import.meta.env.VITE_API_HOST || '').trim();
const apiBasePath = import.meta.env.VITE_API_BASE_PATH || '/api';
const useAbsoluteApiHost = envName === 'github-ci' && !!apiHost;

const apiBase = useAbsoluteApiHost
  ? joinUrl(apiHost, apiBasePath)
  : ensureLeadingSlash(apiBasePath);

export const apiV1Base = joinUrl(apiBase, '/v1');
export const apiV2Base = joinUrl(apiBase, '/v2');

const appendQuery = (url: string, query?: Record<string, QueryValue>) => {
  if (!query) return url;

  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  }

  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
};

export const apiV1Url = (
  path: string,
  query?: Record<string, QueryValue>
) => appendQuery(joinUrl(apiV1Base, path), query);

export const apiV2Url = (
  path: string,
  query?: Record<string, QueryValue>
) => appendQuery(joinUrl(apiV2Base, path), query);
