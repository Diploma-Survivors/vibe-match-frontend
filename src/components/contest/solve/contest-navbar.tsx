'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Clock, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ContestNavbarProps {
    onMenuClick: () => void;
    onNextProblem: () => void;
    onPrevProblem: () => void;
    hasPrev: boolean;
    hasNext: boolean;
}

export default function ContestNavbar({
    onMenuClick,
    onNextProblem,
    onPrevProblem,
    hasPrev,
    hasNext,
}: ContestNavbarProps) {
    const { t } = useTranslation('contests');

    return (
        <div className="h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4 sticky top-0 z-40">
            {/* Left: Menu & Navigation */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onMenuClick}
                    title={t('open_sidebar')}
                >
                    <Menu className="w-5 h-5" />
                </Button>

                <div className="h-4 w-px bg-border mx-2" />

                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onPrevProblem}
                        disabled={!hasPrev}
                        title={t('previous')}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onNextProblem}
                        disabled={!hasNext}
                        title={t('next')}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Center: Timer (Centered) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-mono text-sm font-medium">
                        01:23:45
                    </span>
                </div>
            </div>

            {/* Right: Submit */}
            <div className="flex items-center gap-4">
                <Button
                    onClick={() => { }}
                    className="bg-green-600 hover:bg-green-700 text-white gap-2 font-medium shadow-md shadow-green-900/10"
                    size="sm"
                >
                    {t('submit')}
                </Button>
            </div>
        </div>
    );
}
