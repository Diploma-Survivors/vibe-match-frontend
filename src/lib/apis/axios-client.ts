'use client'

import axios from 'axios';
import {getSession} from "next-auth/react";

// Create a custom Axios instance
const clientApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/v1', // Replace with your API base URL
  timeout: 5000, // Request timeout in milliseconds
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
    // Handle global errors, e.g., redirect to login on 401 unauthorized
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors (e.g., redirect to login page)
      console.error('Unauthorized, redirecting to login...');
      // Example: router.push('/login'); (if you have access to router)
    }
    return Promise.reject(error);
  }
);

export default clientApi;