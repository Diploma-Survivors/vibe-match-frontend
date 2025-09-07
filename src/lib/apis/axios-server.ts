// src/lib/serverApi.ts
import { getServerSession } from "next-auth";
import { authOptions } from "../auth"; // Adjust path to your authOptions file
import axios from "axios";

// 1. Create a base instance without interceptors for authentication
// This instance can be used for any general purpose or unauthenticated calls.
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.escuelajs.co/api/v1',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Create an internal helper to get session-specific headers
// This is the key part that runs for every authenticated request.
const getAuthenticatedHeaders = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    throw new Error("Not authenticated or access token is missing.");
  }
  return {
    Authorization: `Bearer ${session.accessToken}`,
  };
};

// 3. Create the wrapper object that you will import in Server Components
export const serverApi = {
  get: async <T>(endpoint: string, options = {}) => {
    const headers = await getAuthenticatedHeaders();
    const response = await axiosInstance.get<T>(endpoint, { ...options, headers });
    return response.data;
  },

  post: async <T>(endpoint: string, data: any, options = {}) => {
    const headers = await getAuthenticatedHeaders();
    const response = await axiosInstance.post<T>(endpoint, data, { ...options, headers });
    return response.data;
  },
  
  put: async <T>(endpoint: string, data: any, options = {}) => {
    const headers = await getAuthenticatedHeaders();
    const response = await axiosInstance.put<T>(endpoint, data, { ...options, headers });
    return response.data;
  },

  delete: async <T>(endpoint: string, options = {}) => {
    const headers = await getAuthenticatedHeaders();
    const response = await axiosInstance.delete<T>(endpoint, { ...options, headers });
    return response.data;
  },
};