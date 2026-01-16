export enum Currency {
    USD = 'USD',
    VND = 'VND',
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
}

export interface SubscriptionPlan {
    id: number;
    name: string;
    description: string;
    priceUsd: number;
    durationMonths: number;
    isActive: boolean;
    features: string[]; // JSON array of features
    type: string; // 'FREE', 'PREMIUM'
}

export interface PaymentTransaction {
    id: number;
    userId: number;
    planId: number;
    amount: number;
    amountVnd: number;
    currency: Currency;
    status: PaymentStatus;
    paymentDate?: string; // ISO Datev
    description?: string;
    plan?: SubscriptionPlan;
    createdAt: string;
}

export interface CreatePaymentResponse {
    url: string;
}
