import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * ApiService class to handle API requests using axios
 */
export class ApiService {
  private api: AxiosInstance;
  private static instance: ApiService;

  /**
   * Constructor for ApiService
   * @param baseURL Base URL for API requests
   * @param timeout Timeout in milliseconds
   */
  private constructor(baseURL: string = '', timeout: number = 30000) {
    this.api = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    // Request interceptor for handling auth tokens, etc.
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for handling common responses
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle common errors (401, 403, 500, etc.)
        if (error.response) {
          switch (error.response.status) {
            case 401:
              // Handle unauthorized
              console.error('Unauthorized access');
              // Could trigger a logout action or redirect
              break;
            case 403:
              // Handle forbidden
              console.error('Access forbidden');
              break;
            case 404:
              // Handle not found
              console.error('Resource not found');
              break;
            case 500:
              // Handle server error
              console.error('Server error');
              break;
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Network error');
        } else {
          // Something happened in setting up the request
          console.error('Request configuration error', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get singleton instance of ApiService
   * @param baseURL Base URL for API requests
   * @param timeout Timeout in milliseconds
   * @returns ApiService instance
   */
  public static getInstance(
    baseURL: string = '',
    timeout: number = 30000
  ): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService(baseURL, timeout);
    }
    return ApiService.instance;
  }

  /**
   * Make a GET request
   * @param url The URL to request
   * @param params Query parameters
   * @param config Optional axios config
   * @returns Promise with the response data
   */
  public async get<T>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.get(url, {
        params,
        ...config,
      });
      return response.data;
    } catch (error) {
      console.error('GET request failed:', error);
      throw error;
    }
  }

  /**
   * Make a POST request
   * @param url The URL to request
   * @param data Request body data
   * @param config Optional axios config
   * @returns Promise with the response data
   */
  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.post(url, data, config);
      return response.data;
    } catch (error) {
      console.error('POST request failed:', error);
      throw error;
    }
  }

  /**
   * Make a PUT request
   * @param url The URL to request
   * @param data Request body data
   * @param config Optional axios config
   * @returns Promise with the response data
   */
  public async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.put(url, data, config);
      return response.data;
    } catch (error) {
      console.error('PUT request failed:', error);
      throw error;
    }
  }

  /**
   * Make a PATCH request
   * @param url The URL to request
   * @param data Request body data
   * @param config Optional axios config
   * @returns Promise with the response data
   */
  public async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.patch(
        url,
        data,
        config
      );
      return response.data;
    } catch (error) {
      console.error('PATCH request failed:', error);
      throw error;
    }
  }

  /**
   * Make a DELETE request
   * @param url The URL to request
   * @param config Optional axios config
   * @returns Promise with the response data
   */
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.delete(url, config);
      return response.data;
    } catch (error) {
      console.error('DELETE request failed:', error);
      throw error;
    }
  }

  /**
   * Set default headers for all requests
   * @param headers Headers to set
   */
  public setHeaders(headers: Record<string, string>): void {
    Object.keys(headers).forEach((key) => {
      this.api.defaults.headers.common[key] = headers[key];
    });
  }

  /**
   * Set authorization token
   * @param token The auth token
   * @param type Token type (default: Bearer)
   */
  public setAuthToken(token: string, type: string = 'Bearer'): void {
    this.api.defaults.headers.common['Authorization'] = `${type} ${token}`;
  }
}

// Export a default instance with default configuration
export default ApiService.getInstance();
