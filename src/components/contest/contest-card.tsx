'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  CONTEST_STATUS_COLORS,
  CONTEST_STATUS_LABELS,
  type Contest,
} from '@/types/contests';
import { motion } from 'framer-motion';
import { Calendar, Clock, Trophy, Users } from 'lucide-react';

interface ContestCardProps {
  contest: Contest;
  index: number;
}

export default function ContestCard({ contest, index }: ContestCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionButton = () => {
    switch (contest.status) {
      case 'upcoming':
        return contest.registrationOpen ? (
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Đăng ký
          </Button>
        ) : (
          <Button variant="outline" disabled className="w-full">
            Chưa mở đăng ký
          </Button>
        );
      case 'ongoing':
        return (
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
            Tham gia ngay
          </Button>
        );
      case 'finished':
        return (
          <Button variant="outline" className="w-full">
            Xem bảng xếp hạng
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Card className="h-full transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/25 border-border/50 hover:border-primary/50">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/30 rounded-lg flex items-center justify-center">
                  <Trophy size={16} className="text-primary" />
                </div>
                <Badge className={CONTEST_STATUS_COLORS[contest.status]}>
                  {CONTEST_STATUS_LABELS[contest.status]}
                </Badge>
                {contest.isVirtual && (
                  <Badge variant="outline" className="text-xs">
                    Virtual
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                {contest.name}
              </h3>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar size={14} />
              <span>{formatDate(contest.startTime)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock size={14} />
              <span>{formatTime(contest.startTime)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock size={14} />
            <span>Thời lượng: {contest.duration}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users size={14} />
            <span>
              {contest.participantCount.toLocaleString()} người tham gia
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Writers:</p>
            <div className="flex flex-wrap gap-1">
              {contest.writers.map((writer) => (
                <Badge
                  key={writer}
                  variant="secondary"
                  className="text-xs px-2 py-1"
                >
                  {writer}
                </Badge>
              ))}
            </div>
          </div>

          {contest.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {contest.description}
            </p>
          )}
        </CardContent>

        <CardFooter>{getActionButton()}</CardFooter>
      </Card>
    </motion.div>
  );
}
