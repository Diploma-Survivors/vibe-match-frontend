'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

function PaymentFailedContent() {
    const { t } = useTranslation('common');
    const searchParams = useSearchParams();
    const message = searchParams.get('message');

    return (
        <div className="container flex min-h-[80vh] items-center justify-center px-4">
            <Card className="w-full max-w-md border-red-500/20 shadow-xl shadow-red-500/10">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-500">
                        <AlertCircle className="h-10 w-10" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-red-600 dark:text-red-500">
                        {t('payment_failed', { defaultValue: 'Payment Failed' })}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="mb-4 text-muted-foreground">
                        {t('payment_failed_desc', {
                            defaultValue:
                                'We could not process your payment. Please try again or contact support if the issue persists.',
                        })}
                    </p>
                    {message && (
                        <div className="rounded-lg bg-red-50 dark:bg-red-900/10 p-4 border border-red-200 dark:border-red-800">
                            <p className="text-sm text-red-600 dark:text-red-400 font-mono break-all">{message}</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                    <Link href="/pricing" className="w-full">
                        <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                            {t('try_again', { defaultValue: 'Try Again' })}
                        </Button>
                    </Link>
                    <Link href="/settings" className="w-full">
                        <Button variant="outline" className="w-full">
                            {t('cancel_return', { defaultValue: 'Return to Settings' })}
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}

export default function PaymentFailedPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PaymentFailedContent />
        </Suspense>
    )
}
