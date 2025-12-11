// API client configuration for future backend integration

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 500,
      };
    }
  }

  // Citizens endpoints
  async getCitizens() {
    return this.request('/citizens', { method: 'GET' });
  }

  async getCitizen(id: string) {
    return this.request(`/citizens/${id}`, { method: 'GET' });
  }

  async createCitizen(data: any) {
    return this.request('/citizens', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCitizen(id: string, data: any) {
    return this.request(`/citizens/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCitizen(id: string) {
    return this.request(`/citizens/${id}`, { method: 'DELETE' });
  }

  // Families endpoints
  async getFamilies() {
    return this.request('/families', { method: 'GET' });
  }

  async getFamily(id: string) {
    return this.request(`/families/${id}`, { method: 'GET' });
  }

  async createFamily(data: any) {
    return this.request('/families', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateFamily(id: string, data: any) {
    return this.request(`/families/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteFamily(id: string) {
    return this.request(`/families/${id}`, { method: 'DELETE' });
  }

  // Services endpoints
  async getServices() {
    return this.request('/services', { method: 'GET' });
  }

  async getService(id: string) {
    return this.request(`/services/${id}`, { method: 'GET' });
  }

  async createService(data: any) {
    return this.request('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateService(id: string, data: any) {
    return this.request(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteService(id: string) {
    return this.request(`/services/${id}`, { method: 'DELETE' });
  }

  // Reports endpoints
  async getAnalytics() {
    return this.request('/reports/analytics', { method: 'GET' });
  }

  async exportReport(params: any) {
    return this.request('/reports/export', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
