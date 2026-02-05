
const BASE_URL = 'http://localhost:5000/api';

const defaultOptions: RequestInit = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
};

export const api = {
  get: async <T,>(endpoint: string): Promise<T> => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...defaultOptions,
      method: 'GET',
    });
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  },

  post: async <T,>(endpoint: string, body: any): Promise<T> => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...defaultOptions,
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  },

  put: async <T,>(endpoint: string, body: any): Promise<T> => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...defaultOptions,
      method: 'PUT',
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  },

  delete: async <T,>(endpoint: string): Promise<T> => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...defaultOptions,
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  },
};
