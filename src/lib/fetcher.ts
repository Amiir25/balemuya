export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new ApiError(json.error ?? "Request failed", res.status);
  }
  return res.json();
}