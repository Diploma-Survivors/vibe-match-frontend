'use client';

import axios from 'axios';
import { getSession } from 'next-auth/react';

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
    // if (session?.accessToken) {
    //   config.headers.Authorization = `Bearer ${session.accessToken}`;
    // }

    // Hardcoded token for testing purposes
    config.headers.Authorization =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5MDMwZjYyZS01NjE0LTQxMTgtODkxNi0zYTU0YzRlYjQ3YTQiLCJjb3Vyc2VJZCI6IjdkZTBhZDQ2LTRhOTgtNGRkOS1hY2E3LWNhM2U2NGU1NGFkOSIsImVtYWlsIjoidnV0aGV2eTEyMDkyMDA0QGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6Ilbhu7kiLCJsYXN0TmFtZSI6IlbFqSBUaOG6vyIsInJvbGVzIjpbIklOU1RSVUNUT1IiXSwic3ViIjoiMiIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODg4OCIsImlhdCI6MTc1OTkzNjA2NCwiZXhwIjo1MzU5OTM2MDY0LCJhdWQiOiJsb2NhbGhvc3Q6MzAwMCJ9.1qqPQ21TZvfoy9cm3DPTccR5K1aTdt1wEuTT1ATewGE';

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
