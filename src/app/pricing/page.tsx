'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { PaymentService } from '@/services/payments-service';
import { SubscriptionPlan } from '@/types/payment';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { toastService } from '@/services/toasts-service';

export default function PricingPage() {
    const { t } = useTranslation('common'); // Assuming 'common' or fallback
    const router = useRouter();
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const data = await PaymentService.getSubscriptionPlans();
                setPlans(data);
            } catch (error) {
                console.error('Failed to load plans', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const handleSubscribe = async (planId: number) => {
        setProcessingId(planId);
        try {
            const redirectUrl = await PaymentService.createPayment(planId, 'NCB');
            router.push(redirectUrl);
        } catch (error) {
            console.error('Payment creation failed', error);
            toastService.error('Failed to initiate payment. Please try again.');
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                    {t('pricing_title', { defaultValue: 'Simple, Transparent Pricing' })}
                </h1>
                <p className="mt-4 text-xl text-muted-foreground">
                    {t('pricing_subtitle', {
                        defaultValue: 'Choose the plan that fits your needs.',
                    })}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan) => {
                    const isPremium = plan.priceUsd > 0;
                    // Highlight the Monthly Premium plan (id: 2) as popular usually, or Yearly (id: 3)
                    const isPopular = plan.id === 3;

                    return (
                        <Card
                            key={plan.id}
                            className={cn(
                                'flex flex-col border-border/40 shadow-sm transition-all duration-200 hover:shadow-lg',
                                isPopular ? 'border-accent shadow-accent/20 scale-105 z-10' : 'bg-card'
                            )}
                        >
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                        <CardDescription className="mt-2 text-sm text-muted-foreground">
                                            {plan.description}
                                        </CardDescription>
                                    </div>
                                    {isPopular && (
                                        <div className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent-foreground border border-accent/20">
                                            Best Value
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="mb-6 flex items-baseline">
                                    <span className="text-4xl font-bold tracking-tight text-foreground">
                                        ${plan.priceUsd}
                                    </span>
                                    <span className="ml-1 text-xl font-semibold text-muted-foreground">
                                        /{plan.durationMonths === 1 ? 'mo' : plan.durationMonths === 12 ? 'yr' : 'forever'}
                                    </span>
                                </div>

                                <ul className="space-y-4">
                                    {plan.features?.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <Check className="h-5 w-5 text-green-500" />
                                            </div>
                                            <p className="ml-3 text-sm text-foreground/80">{feature}</p>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className={cn(
                                        'w-full text-lg py-6',
                                        isPopular
                                            ? 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20'
                                            : '',
                                        !isPremium ? 'hidden' : '' // Hide subscribe button for Free plan if actively viewing? Or just disable.
                                    )}
                                    variant={isPopular ? 'default' : 'outline'}
                                    disabled={!!processingId || !isPremium}
                                    onClick={() => handleSubscribe(plan.id)}
                                >
                                    {processingId === plan.id ? (
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    ) : (
                                        <Zap className="mr-2 h-5 w-5" />
                                    )}
                                    {!isPremium
                                        ? t('current_plan', { defaultValue: 'Current Plan' })
                                        : t('subscribe_now', { defaultValue: 'Subscribe Now' })}
                                </Button>
                                {!isPremium && (
                                    <Button className="w-full text-lg py-6" variant="secondary" disabled>
                                        {t('included', { defaultValue: 'Included' })}
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
