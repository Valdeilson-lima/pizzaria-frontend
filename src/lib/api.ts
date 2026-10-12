const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export function getApiUrl() {
  if (!API_URL) {
    throw new Error("API_URL is not defined");
  }
  return API_URL;
}

interface FetchOptions extends RequestInit {
  token?: string;
  cache?: "force-cache" | "no-store";
  next?: {
    revalidate?: false | 0 | number;
    tags?: string[];
  };
}

export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    ...(fetchOptions.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!(fetchOptions.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: "Error indefinido" + response.status,
    }));
    throw new Error(errorData.error || "Error indefinido " + response.status);
  }

  return response.json();
}
