import { getToken } from "./token";

const BASE_URL = import.meta.env.VITE_API_URL;

export type FieldError = { field: string; message: string };

// Shape of the JSON body the server sends on errors:
// 400 -> { errors: [...] } or { message }, other errors -> { message }.
export type ApiErrorBody = { message?: string; errors?: FieldError[] };

// Thrown for every non-2xx response, so callers can check `status`
// (e.g. 401 vs 404) and read validation errors from `body.errors`.
export class ApiError extends Error {
  status: number;
  body: ApiErrorBody;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message ?? body.errors?.[0]?.message ?? `Request failed (${status})`);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

// AuthProvider registers a callback here, so a 401 from ANY request logs the user out.
let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

type RequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;
  const token = getToken();
  const isFormData = body instanceof FormData;

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...rest,
      headers: {
        // FormData sets its own multipart Content-Type (with boundary), so only set JSON otherwise.
        ...(body !== undefined && !isFormData ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
    });
  } catch {
    // fetch only rejects on network failure (server down, offline, CORS).
    throw new ApiError(0, { message: "Can't reach the server. Check your connection and try again." });
  }

  // 204 No Content (DELETE) has no body to parse.
  if (response.status === 204) return undefined as T;

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Only an expired/invalid token should log out. A 401 without a token
    // (e.g. wrong password on login) is just a normal error for the form.
    if (response.status === 401 && token) onUnauthorized?.();
    throw new ApiError(response.status, data);
  }

  return data as T;
}
