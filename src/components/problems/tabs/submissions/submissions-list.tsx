'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertCircle,
  Check,
  Clock,
  Filter,
  RefreshCw,
  Search,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface SubmissionNode {
  id: number;
  status: string;
  language: {
    id: number;
    name: string;
  };
  runtime: number;
  memory: number;
  score: number | null;
  note: string | null;
  createdAt?: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface SubmissionEdge {
  node: SubmissionNode;
  cursor: string;
}

interface SubmissionsListProps {
  submissions: SubmissionEdge[];
  selectedSubmissionId: number | null;
  onSelectSubmission: (submission: SubmissionNode) => void;
  onFilterChange: (filters: { status: string; language: string }) => void;
}

const statusOptions = [
  { value: 'ALL', label: 'All Status' },
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'WRONG_ANSWER', label: 'Wrong Answer' },
  { value: 'TIME_LIMIT_EXCEEDED', label: 'Time Limit Exceeded' },
  { value: 'RUNTIME_ERROR', label: 'Runtime Error' },
  { value: 'COMPILATION_ERROR', label: 'Compilation Error' },
  { value: 'NZEC', label: 'NZEC' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'RUNNING', label: 'Running' },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'ACCEPTED':
      return <Check className="h-4 w-4 text-emerald-600" />;
    case 'WRONG_ANSWER':
      return <X className="h-4 w-4 text-red-500" />;
    case 'TIME_LIMIT_EXCEEDED':
      return <Clock className="h-4 w-4 text-amber-500" />;
    case 'RUNTIME_ERROR':
    case 'COMPILATION_ERROR':
    case 'NZEC':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'PENDING':
    case 'RUNNING':
      return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusBgColor = (status: string) => {
  switch (status) {
    case 'ACCEPTED':
      return 'bg-emerald-50 border-emerald-200';
    case 'WRONG_ANSWER':
      return 'bg-red-50 border-red-200';
    case 'TIME_LIMIT_EXCEEDED':
      return 'bg-amber-50 border-amber-200';
    case 'RUNTIME_ERROR':
    case 'COMPILATION_ERROR':
    case 'NZEC':
      return 'bg-red-50 border-red-200';
    case 'PENDING':
    case 'RUNNING':
      return 'bg-blue-50 border-blue-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
};

const formatRuntime = (runtime: number) => {
  if (runtime === 0) return '0s';
  return `${runtime.toFixed(3)}s`;
};

const formatMemory = (memory: number) => {
  if (memory === 0) return '0 KB';
  return `${memory} KB`;
};

const formatTime = (createdAt: string) => {
  const date = new Date(createdAt);
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export default function SubmissionsList({
  submissions,
  selectedSubmissionId,
  onSelectSubmission,
  onFilterChange,
}: SubmissionsListProps) {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [languageFilter, setLanguageFilter] = useState('ALL');

  // Get unique languages from submissions
  const languages = Array.from(
    new Set(submissions.map((sub) => sub.node.language.name))
  ).map((name) => ({ value: name, label: name }));

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    onFilterChange({ status: value, language: languageFilter });
  };

  const handleLanguageChange = (value: string) => {
    setLanguageFilter(value);
    onFilterChange({ status: statusFilter, language: value });
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mr-3">
      {/* Search Filters */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex gap-3">
          <div className="flex-1">
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="h-9 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Select value={languageFilter} onValueChange={handleLanguageChange}>
              <SelectTrigger className="h-9 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm">
                <SelectValue placeholder="Ngôn ngữ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả ngôn ngữ</SelectItem>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy submission nào
            </h3>
            <p className="text-gray-500 text-center max-w-sm">
              Hãy thử thay đổi bộ lọc hoặc tạo submission mới để xem kết quả.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Ngôn ngữ
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Runtime
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Memory
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Điểm
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.map((submission, index) => (
                  <tr
                    key={submission.node.id}
                    className={`cursor-pointer transition-all duration-300 hover:bg-blue-50 hover:shadow-sm group ${
                      selectedSubmissionId === submission.node.id
                        ? 'bg-blue-50 border-l-4 border-blue-500 shadow-sm'
                        : 'border-l-4 border-transparent hover:border-blue-300'
                    }`}
                    onClick={() => onSelectSubmission(submission.node)}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: 'fadeInUp 0.3s ease-out forwards',
                    }}
                  >
                    {/* Status */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg border ${getStatusBgColor(submission.node.status)} transition-all duration-200 group-hover:scale-105`}
                        >
                          {getStatusIcon(submission.node.status)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900 capitalize">
                            {submission.node.status
                              .replace(/_/g, ' ')
                              .toLowerCase()}
                          </span>
                          {submission.node.note && (
                            <span className="text-xs text-gray-500 truncate max-w-32">
                              {submission.node.note}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Language */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <div className="text-sm">
                          <div className="font-semibold text-gray-900">
                            {submission.node.language.name.split(' ')[0]}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {submission.node.language.name
                              .split(' ')
                              .slice(1)
                              .join(' ')}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Runtime */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {formatRuntime(submission.node.runtime)}
                        </span>
                      </div>
                    </td>

                    {/* Memory */}
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        {formatMemory(submission.node.memory)}
                      </span>
                    </td>

                    {/* Score */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        {submission.node.score !== null ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {submission.node.score.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Add CSS animations
const styles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Inject styles if not already present
if (
  typeof document !== 'undefined' &&
  !document.getElementById('submissions-animations')
) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'submissions-animations';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
