import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import type { ReactNode } from 'react';

export interface StatusMeta {
  icon: ReactNode;
  color: string;
  iconColor: string;
  label: string;
}

export const getStatusMeta = (status: string): StatusMeta => {
  switch (status) {
    case 'ACCEPTED':
      return {
        icon: <CheckCircle className="w-4 h-4" />,
        color: 'text-green-600 bg-green-50 dark:bg-green-900/20',
        iconColor: 'text-green-600',
        label: 'Accepted',
      };
    case 'WRONG_ANSWER':
      return {
        icon: <XCircle className="w-4 h-4" />,
        color: 'text-red-600 bg-red-50 dark:bg-red-900/20',
        iconColor: 'text-red-600',
        label: 'Wrong Answer',
      };
    case 'TIME_LIMIT_EXCEEDED':
      return {
        icon: <Clock className="w-4 h-4" />,
        color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
        iconColor: 'text-orange-600',
        label: 'Time Limit Exceeded',
      };
    case 'RUNTIME_ERROR':
    case 'SIGSEGV':
    case 'SIGXFSZ':
    case 'SIGFPE':
    case 'SIGABRT':
    case 'NZEC':
      return {
        icon: <AlertTriangle className="w-4 h-4" />,
        color: 'text-red-600 bg-red-50 dark:bg-red-900/20',
        iconColor: 'text-red-600',
        label: 'Runtime Error',
      };
    default:
      return {
        icon: <AlertTriangle className="w-4 h-4" />,
        color: 'text-gray-600 bg-gray-50 dark:bg-gray-900/20',
        iconColor: 'text-gray-600',
        label: status,
      };
  }
};
