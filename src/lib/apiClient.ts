/**
 * API Client
 * 
 * Provides a fetch-based HTTP client with interceptors for:
 * - Authentication headers
 * - Error handling
 * - Request/response transformation
 */

interface ApiClientConfig {
  baseURL: string;
  headers?: Record<string, string>;
}

interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

/**
 * Custom error class for API errors with status code and response data
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * API Client class with request/response interceptors
 */
class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...config.headers,
    };
  }

  /**
   * Get auth token from localStorage
   * In a real app, this would retrieve the JWT token
   */
  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    
    const storedUser = localStorage.getItem("leadflow_user");
    if (!storedUser) return null;

    try {
      const user = JSON.parse(storedUser);
      // In a real app, this would be a JWT token stored separately
      // For now, we'll use a simple scheme with user ID
      return `Bearer mock-token-${user.id}`;
    } catch {
      return null;
    }
  }

  /**
   * Request interceptor - adds auth headers and processes request
   */
  private async requestInterceptor(
    url: string,
    config: RequestConfig
  ): Promise<[string, RequestInit]> {
    const headers = new Headers({
      ...this.defaultHeaders,
      ...config.headers,
    });

    // Add auth token if available
    const token = this.getAuthToken();
    if (token) {
      headers.set("Authorization", token);
    }

    // Build URL with query params
    let finalUrl = `${this.baseURL}${url}`;
    if (config.params) {
      const searchParams = new URLSearchParams();
      Object.entries(config.params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });
      finalUrl += `?${searchParams.toString()}`;
    }

    return [
      finalUrl,
      {
        ...config,
        headers,
      },
    ];
  }

  /**
   * Response interceptor - handles errors and parses response
   */
  private async responseInterceptor<T>(response: Response): Promise<T> {
    // Handle non-2xx responses
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      throw new ApiError(
        errorData.message || `Request failed with status ${response.status}`,
        response.status,
        errorData
      );
    }

    // Parse successful response
    // Handle empty responses (204 No Content)
    if (response.status === 204) {
      return undefined as T;
    }

    try {
      return await response.json();
    } catch {
      throw new ApiError("Failed to parse response JSON", response.status);
    }
  }

  /**
   * Generic request method
   */
  private async request<T>(url: string, config: RequestConfig = {}): Promise<T> {
    const [finalUrl, finalConfig] = await this.requestInterceptor(url, config);

    try {
      const response = await fetch(finalUrl, finalConfig);
      return await this.responseInterceptor<T>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      // Network errors or other fetch failures
      throw new ApiError(
        error instanceof Error ? error.message : "Network request failed",
        0
      );
    }
  }

  /**
   * GET request
   */
  async get<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: "GET" });
  }

  /**
   * POST request
   */
  async post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: "DELETE" });
  }
}

/**
 * Create and export API client instance
 * Uses NEXT_PUBLIC_API_URL from environment or defaults to localhost
 */
const apiBaseURL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const apiClient = new ApiClient({
  baseURL: apiBaseURL,
});
