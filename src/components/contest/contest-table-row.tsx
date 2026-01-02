'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { ContestListItem } from '@/types/contests';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Clock, Timer, History, Calendar, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ContestTableRowProps {
  contest: ContestListItem;
}

export default function ContestTableRow({ contest }: ContestTableRowProps) {
  const router = useRouter();
  const { t, i18n } = useTranslation('contests');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'ongoing':
        return <Timer className="w-4 h-4 text-green-500" />;
      case 'ended':
        return <History className="w-4 h-4 text-muted-foreground" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: string) => {
    if (status === 'upcoming') return t('upcoming');
    if (status === 'ongoing') return t('ongoing');
    if (status === 'ended') return t('ended');
    return status;
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString(i18n.language, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const formatDuration = (minutes: number) => {
    if (!minutes) return '-';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  };

  return (
    <TableRow
      className="cursor-pointer hover:bg-muted/50 transition-colors group border-border/50 h-16"
      onClick={() => router.push(`/contests/${contest.id}/description`)}
    >
      {/* Status */}
      <TableCell className="text-center w-12 p-0">
        <div className="flex justify-center items-center">
            {getStatusIcon(contest.status)}
        </div>
      </TableCell>

      {/* Title */}
      <TableCell className="font-medium text-foreground text-base">
         <div className="flex flex-col">
            <span className="truncate max-w-[300px] lg:max-w-[400px]">
                {contest.name}
            </span>
            <span className="text-xs text-muted-foreground lg:hidden">
               {getStatusLabel(contest.status)}
            </span>
         </div>
      </TableCell>

      {/* Start Time */}
      <TableCell className="w-48 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 opacity-70" />
            {formatDateTime(contest.startTime)}
        </div>
      </TableCell>

      {/* Duration */}
      <TableCell className="w-32 text-sm text-muted-foreground">
         <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 opacity-70" />
            {formatDuration(contest.durationMinutes)}
         </div>
      </TableCell>

      {/* Participants (Mock for now if not in type) */}
      <TableCell className="w-32 text-center text-sm text-muted-foreground">
         {/* <div className="flex items-center justify-center gap-1">
             <User className="w-4 h-4 opacity-70" />
             <span>1,234</span>
         </div> */}
         {/* Assuming participant count isn't in ListItem yet, leaving blank or simple status text */}
         <Badge variant="outline" className={cn(
             "font-normal text-xs",
             contest.status === 'ongoing' ? "text-green-600 border-green-200 bg-green-50" : "text-muted-foreground"
         )}>
             {getStatusLabel(contest.status)}
         </Badge>
      </TableCell>
    </TableRow>
  );
}

