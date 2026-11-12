export const identityApiUrl = 'http://localhost:11385';
export const inventoryApiUrl = 'http://localhost:11386';
export const shoppingListApiUrl = 'http://localhost:11387';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown // ASP.NET Core ProblemDetails ends up here
  ) {
    super(message);
  }
}

export async function apiFetch<T>(
  path: string,
  token: string | undefined,
  init: RequestInit = {}
): Promise<T> {
  const res = await fetch(`http://localhost:5100/api${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  if (!res.ok) {
    const body = await res.json().catch(() => undefined);
    throw new ApiError(res.status, res.statusText, body);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
