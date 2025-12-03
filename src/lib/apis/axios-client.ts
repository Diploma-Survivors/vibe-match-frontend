'use client';

import { toastService } from '@/services/toasts-service';
import axios from 'axios';
import { getSession } from 'next-auth/react';
// Create a custom Axios instance
const clientApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/v1', // Replace with your API base URL
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

clientApi.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add response interceptors
clientApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle global errors
    if (error.response) {
      const status = error.response.status;
      const message =
        error.response.data?.message || error.message || 'An error occurred';

      switch (status) {
        case 401: // Unauthorized
        case 403: // Forbidden
          window.location.href = '/unauthorized';
          break;
        case 404: // Not Found
          window.location.href = '/not-found';
          break;
        default:
          toastService.error(`Error ${status}: ${message}`);
          break;
      }
    } else {
      toastService.error(error.message || 'An unexpected error occurred');
    }

    return Promise.reject(error);
  }
);

export default clientApi;
