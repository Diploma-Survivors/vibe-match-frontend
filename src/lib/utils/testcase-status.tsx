import { SubmissionStatus } from '@/types/submissions';
import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import type { ReactNode } from 'react';

export interface StatusMeta {
  icon: ReactNode;
  color: string;
  iconColor: string;
  label: string;
}

export const getStatusMeta = (
  status: SubmissionStatus | string
): StatusMeta => {
  switch (status) {
    case SubmissionStatus.ACCEPTED:
    case 'ACCEPTED':
      return {
        icon: <CheckCircle className="w-4 h-4" />,
        color: 'text-green-600',
        iconColor: 'text-green-600',
        label: 'Accepted',
      };
    case SubmissionStatus.WRONG_ANSWER:
    case 'WRONG_ANSWER':
      return {
        icon: <XCircle className="w-4 h-4" />,
        color: 'text-red-600',
        iconColor: 'text-red-600',
        label: 'Wrong Answer',
      };
    case SubmissionStatus.TIME_LIMIT_EXCEEDED:
    case 'TIME_LIMIT_EXCEEDED':
      return {
        icon: <Clock className="w-4 h-4" />,
        color: 'text-orange-600',
        iconColor: 'text-orange-600',
        label: 'Time Limit Exceeded',
      };
    case SubmissionStatus.COMPILATION_ERROR:
    case 'COMPILATION_ERROR':
      return {
        icon: <AlertTriangle className="w-4 h-4" />,
        color: 'text-red-600',
        iconColor: 'text-red-600',
        label: 'Compilation Error',
      };
    case SubmissionStatus.RUNTIME_ERROR:
    case SubmissionStatus.SIGSEGV:
    case SubmissionStatus.SIGXFSZ:
    case SubmissionStatus.SIGFPE:
    case SubmissionStatus.SIGABRT:
    case SubmissionStatus.NZEC:
    case 'RUNTIME_ERROR':
    case 'SIGSEGV':
    case 'SIGXFSZ':
    case 'SIGFPE':
    case 'SIGABRT':
    case 'NZEC':
      return {
        icon: <AlertTriangle className="w-4 h-4" />,
        color: 'text-red-600',
        iconColor: 'text-red-600',
        label: 'Runtime Error',
      };
    default:
      return {
        icon: <AlertTriangle className="w-4 h-4" />,
        color: 'text-gray-600',
        iconColor: 'text-gray-600',
        label: status,
      };
  }
};
