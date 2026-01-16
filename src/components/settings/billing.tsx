'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { UserService } from '@/services/user-service';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

import { PaymentService } from '@/services/payments-service';
import { PaymentTransaction, PaymentStatus } from '@/types/payment';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export function BillingSettings() {
    const { t } = useTranslation('profile');
    const [loading, setLoading] = useState(true);
    const [isPremium, setIsPremium] = useState(false);
    const [expiryDate, setExpiryDate] = useState<string | null>(null);
    const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch fresh profile data to get latest subscription status
                const [userResponse, historyData] = await Promise.all([
                    UserService.getMe(),
                    PaymentService.getPaymentHistory()
                ]);

                const user = userResponse.data.data; // Assuming ApiResponse structure

                // Check if user object exists and has premium flag
                if (user) {
                    setIsPremium(!!user.isPremium); // Force boolean
                    if (user.premiumExpiresAt) {
                        setExpiryDate(formatDate(user.premiumExpiresAt.toString()));
                    }
                }

                setTransactions(historyData);
            } catch (error) {
                console.error("Failed to fetch billing data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center p-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card className="border-border/40 shadow-sm">
                <CardHeader>
                    <CardTitle>{t('subscription_plan', { defaultValue: 'Subscription Plan' })}</CardTitle>
                    <CardDescription>{t('manage_subscription', { defaultValue: 'Manage your subscription details.' })}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div className="text-lg font-semibold text-foreground">
                            {isPremium ? t('premium_plan', { defaultValue: 'Premium Plan' }) : t('free_plan', { defaultValue: 'Free Plan' })}
                        </div>
                        {isPremium && expiryDate ? (
                            <p className="text-sm text-green-600 font-medium mt-1">
                                {t('premium_active_until', { defaultValue: 'Active until' })} {expiryDate}
                            </p>
                        ) : (
                            <p className="text-sm text-muted-foreground mt-1">{t('upgrade_to_unlock', { defaultValue: 'Upgrade to unlock premium features.' })}</p>
                        )}
                    </div>
                    {/* Always show upgrade button, or show "Extend" if already premium */}
                    <Link href="/pricing">
                        <Button className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm">
                            {isPremium ? t('extend_plan', { defaultValue: 'Extend Plan' }) : t('upgrade_plan', { defaultValue: 'Upgrade Plan' })}
                        </Button>
                    </Link>
                </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm">
                <CardHeader>
                    <CardTitle>{t('billing_info', { defaultValue: 'Billing Information' })}</CardTitle>
                    <CardDescription>{t('billing_info_desc', { defaultValue: 'View your billing status.' })}</CardDescription>
                </CardHeader>
                <CardContent>
                    {transactions.length > 0 ? (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('date', { defaultValue: 'Date' })}</TableHead>
                                        <TableHead>{t('description', { defaultValue: 'Description' })}</TableHead>
                                        <TableHead>{t('amount', { defaultValue: 'Amount' })}</TableHead>
                                        <TableHead>{t('status', { defaultValue: 'Status' })}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.map((transaction) => (
                                        <TableRow key={transaction.id}>
                                            <TableCell className="font-medium">
                                                {formatDate(transaction.paymentDate || transaction.createdAt)}
                                            </TableCell>
                                            <TableCell>{transaction.description || transaction.plan?.name}</TableCell>
                                            <TableCell>
                                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(transaction.amount)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={transaction.status === PaymentStatus.SUCCESS ? "default" : "destructive"}
                                                    className={transaction.status === PaymentStatus.SUCCESS ? "bg-green-100 text-green-700 hover:bg-green-100/80 border-green-200" : ""}
                                                >
                                                    {transaction.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border">
                            <p>{t('no_billing_history', { defaultValue: 'No billing history available.' })}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
