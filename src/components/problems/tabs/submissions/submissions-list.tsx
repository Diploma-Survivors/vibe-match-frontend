'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getStatusMeta } from '@/lib/utils/testcase-status';
import { SubmissionsService } from '@/services/submissions-service';
import { SubmissionStatus } from '@/types/submissions';
import type { Language } from '@/types/submissions';
import { Clock, Cpu, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

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

const formatRuntime = (runtime: number) => {
  if (runtime === 0) return 'CE';
  const runtimeInMs = runtime * 1000;
  return `${runtimeInMs.toFixed(0)} ms`;
};

const formatMemory = (memory: number) => {
  if (memory === 0) return 'CE';
  const memoryInMB = memory / 1024;
  return `${memoryInMB.toFixed(0)} MB`;
};

export default function SubmissionsList({
  submissions,
  selectedSubmissionId,
  onSelectSubmission,
  onFilterChange,
}: SubmissionsListProps) {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [languageFilter, setLanguageFilter] = useState('ALL');
  const [languageList, setLanguageList] = useState<Language[]>([]);

  // Get language list
  useEffect(() => {
    const fetchLanguageList = async () => {
      const response = await SubmissionsService.getLanguageList();
      setLanguageList(response.data.data);
    };

    fetchLanguageList();
  }, []);

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    onFilterChange({ status: value, language: languageFilter });
  };

  const handleLanguageChange = (value: string) => {
    setLanguageFilter(value);
    onFilterChange({ status: statusFilter, language: value });
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden pl-2">
      {/* Search Filters */}
      <div className="p-3 border-b bg-gray-50">
        <div className="flex gap-2">
          <div className="flex-1">
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="h-8 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                {(() => {
                  const items = [];
                  for (const [key, value] of Object.entries(SubmissionStatus)) {
                    items.push(
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    );
                  }
                  return items;
                })()}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Select value={languageFilter} onValueChange={handleLanguageChange}>
              <SelectTrigger className="h-8 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs">
                <SelectValue placeholder="Ngôn ngữ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Languages</SelectItem>
                {languageList.map((lang) => (
                  <SelectItem key={lang.id} value={lang.name}>
                    {lang.name}
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
              <thead className="bg-white border-b border-gray-200 sticky top-0 z-10 text-xs">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 tracking-wider">
                    Language
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 tracking-wider">
                    Runtime
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 tracking-wider">
                    Memory
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.map((submission, index) => (
                  <tr
                    key={submission.node.id}
                    className={`cursor-pointer transition-all duration-200 group ${
                      selectedSubmissionId === submission.node.id
                        ? 'bg-gray-200'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => onSelectSubmission(submission.node)}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: 'fadeInUp 0.25s ease-out forwards',
                    }}
                  >
                    {/* Status */}
                    <td className="px-4 py-3">
                      {(() => {
                        const statusInfo = getStatusMeta(
                          submission.node.status
                        );
                        return (
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-1.5 rounded-md transition-all duration-200 group-hover:scale-105 ${statusInfo.color}`}
                            >
                              <span className={statusInfo.iconColor}>
                                {statusInfo.icon}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span
                                className={`text-xs font-semibold text-gray-900 capitalize ${statusInfo.color}`}
                              >
                                {statusInfo.label}
                              </span>
                            </div>
                          </div>
                        );
                      })()}
                    </td>

                    {/* Language */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="text-xs flex items-baseline gap-1">
                          <span className="font-semibold text-gray-900">
                            {submission.node.language.name.split(' ')[0]}
                          </span>
                          <span className="text-gray-500 text-[11px]">
                            {submission.node.language.name
                              .split(' ')
                              .slice(1)
                              .join(' ')}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Runtime */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-xs font-medium text-gray-900">
                          {formatRuntime(submission.node.runtime)}
                        </span>
                      </div>
                    </td>

                    {/* Memory */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Cpu className="h-4 w-4 text-gray-400" />
                        <span className="text-xs font-medium text-gray-900">
                          {formatMemory(submission.node.memory)}
                        </span>
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
