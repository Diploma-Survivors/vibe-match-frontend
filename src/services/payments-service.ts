import clientApi from '@/lib/apis/axios-client';
import { PaymentTransaction, SubscriptionPlan } from '@/types/payment';
import { ApiResponse } from '@/types/api';

export const PaymentService = {
    getSubscriptionPlans: async (): Promise<SubscriptionPlan[]> => {
        const response = await clientApi.get<ApiResponse<SubscriptionPlan[]>>('/subscription-plans');
        return response.data.data;
    },

    createPayment: async (planId: number): Promise<string> => {
        const response = await clientApi.post<ApiResponse<{ url: string }>>('/payments/create', { planId });
        return response.data.data.url;
    },
};
