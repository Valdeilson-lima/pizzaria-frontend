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
  try {
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

    const baseUrl = (API_URL || "").replace(/\/+$/, "");
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

    const response = await fetch(`${baseUrl}${cleanEndpoint}`, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage =
        errorData?.error ||
        errorData?.errors?.[0]?.message ||
        (typeof errorData?.message === "string"
          ? errorData.message
          : undefined) ||
        `Erro na requisição (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erro na requisição");
  }
}
