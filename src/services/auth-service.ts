import clientApi from '@/lib/apis/axios-client';
import { ApiResponse } from '@/types/api';
import {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
} from '@/types/auth';
import { AxiosResponse } from 'axios';

async function changePassword(
  data: ChangePasswordRequest
): Promise<AxiosResponse<ApiResponse<void>>> {
  return await clientApi.post<ApiResponse<void>>('/auth/change-password', data);
}

async function resendVerificationEmail(
  email: string
): Promise<AxiosResponse<ApiResponse<void>>> {
  return await clientApi.post<ApiResponse<void>>('/auth/resend-verification', {
    email,
  });
}

async function verifyEmail(
  data: VerifyEmailRequest
): Promise<AxiosResponse<ApiResponse<void>>> {
  return await clientApi.post<ApiResponse<void>>('/auth/verify-email', data);
}

async function forgotPassword(
  data: ForgotPasswordRequest
): Promise<AxiosResponse<ApiResponse<void>>> {
  return await clientApi.post<ApiResponse<void>>('/auth/forgot-password', data);
}

async function resetPassword(
  data: ResetPasswordRequest
): Promise<AxiosResponse<ApiResponse<void>>> {
  return await clientApi.post<ApiResponse<void>>('/auth/reset-password', data);
}

export const AuthService = {
  changePassword,
  resendVerificationEmail,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
