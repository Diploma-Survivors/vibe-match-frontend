'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

function PaymentSuccessContent() {
    const { t } = useTranslation('common');
    const searchParams = useSearchParams();
    const planId = searchParams.get('planId');
    const amount = searchParams.get('amount');

    return (
        <div className="container flex min-h-[80vh] items-center justify-center px-4">
            <Card className="w-full max-w-md border-green-500/20 shadow-xl shadow-green-500/10">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-500">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-green-600 dark:text-green-500">
                        {t('payment_success', { defaultValue: 'Payment Successful!' })}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="mb-4 text-muted-foreground">
                        {t('payment_success_desc', {
                            defaultValue:
                                'Thank you for your subscription. Your account has been upgraded successfully.',
                        })}
                    </p>
                    {amount && (
                        <div className="rounded-lg bg-muted p-4">
                            <p className="text-sm font-medium text-muted-foreground">{t('amount_paid', { defaultValue: 'Amount Paid' })}</p>
                            <p className="text-2xl font-bold text-foreground">${amount}</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                    <Link href="/settings" className="w-full">
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                            {t('view_billing', { defaultValue: 'View Billing & History' })}
                        </Button>
                    </Link>
                    <Link href="/dashboard" className="w-full">
                        <Button variant="outline" className="w-full">
                            {t('go_home', { defaultValue: 'Go to Dashboard' })}
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PaymentSuccessContent />
        </Suspense>
    )
}
