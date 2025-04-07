type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
};

type ApiResponse<T> = {
  data: T;
  status: number;
  ok: boolean;
};

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function api<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = "GET", headers = {}, body } = options;

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    return {
      data,
      status: response.status,
      ok: response.ok,
    };
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// Helper methods for common HTTP methods
export const apiClient = {
  get: <T>(endpoint: string, headers?: Record<string, string>) =>
    api<T>(endpoint, { method: "GET", headers }),

  post: <T>(endpoint: string, body: any, headers?: Record<string, string>) =>
    api<T>(endpoint, { method: "POST", headers, body }),

  put: <T>(endpoint: string, body: any, headers?: Record<string, string>) =>
    api<T>(endpoint, { method: "PUT", headers, body }),

  delete: <T>(endpoint: string, headers?: Record<string, string>) =>
    api<T>(endpoint, { method: "DELETE", headers }),

  patch: <T>(endpoint: string, body: any, headers?: Record<string, string>) =>
    api<T>(endpoint, { method: "PATCH", headers, body }),
};
