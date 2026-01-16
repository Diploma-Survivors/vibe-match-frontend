'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { UserService } from '@/services/user-service';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export function BillingSettings() {
    const { t } = useTranslation('profile');
    const [loading, setLoading] = useState(true);
    const [isPremium, setIsPremium] = useState(false);
    const [expiryDate, setExpiryDate] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Fetch fresh profile data to get latest subscription status
                const response = await UserService.getMe();
                const user = response.data.data; // Assuming ApiResponse structure

                // Check if user object exists and has premium flag
                if (user) {
                    setIsPremium(!!user.isPremium); // Force boolean
                    if (user.premiumExpiresAt) {
                        setExpiryDate(formatDate(user.premiumExpiresAt.toString()));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch user profile", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
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
                    <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border">
                        <p>{t('billing_history_unavailable', { defaultValue: 'Detailed billing history is currently unavailable.' })}</p>
                        <p className="text-sm mt-2">{t('contact_support_billing', { defaultValue: 'Please contact support if you need an invoice.' })}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
