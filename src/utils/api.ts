export const apiBaseUrl = 'http://localhost/api';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown // ASP.NET Core ProblemDetails ends up here
  ) {
    super(message);
  }
}

type AuthHandlers = {
  getToken: () => string | undefined;
  /** Renews the token silently, falling back to a redirect. Resolves to the new token, or null if the user must sign in again. */
  renew: () => Promise<string | null>;
};

let authHandlers: AuthHandlers = {
  getToken: () => undefined,
  renew: async () => null
};

export const setAuthHandlers = (handlers: AuthHandlers) => {
  authHandlers = handlers;
};

const withToken = (request: Request, token: string | undefined) => {
  const headers = new Headers(request.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return new Request(request, { headers });
};

/** fetch with the current token; on a 401, renews the token silently and retries once. */
async function authedFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const request = new Request(input, init);
  // keep an unread copy around in case we need to retry with a fresh token
  const retry = request.clone();
  const res = await fetch(withToken(request, authHandlers.getToken()));
  if (res.status !== 401) return res;

  const token = await authHandlers.renew();
  return token ? fetch(withToken(retry, token)) : res;
}

export const createServiceConfig = (
  service: 'identity' | 'inventory' | 'shopping'
) => ({
  baseUrl: `${apiBaseUrl}/${service}`,
  fetch: authedFetch
});
