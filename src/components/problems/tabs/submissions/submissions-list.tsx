'use client';

import type {
  SubmissionFilters,
  SubmissionListItem,
} from '@/types/submissions';
import type { GetSubmissionListRequest } from '@/types/submissions';
import { Loader2, Search } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import SubmissionRow from './submission-row';
import SubmissionsFilter from './submissions-filter';

interface SubmissionEdge {
  node: SubmissionListItem;
  cursor: string;
}

interface SubmissionsListProps {
  submissions: SubmissionEdge[];
  selectedSubmissionId: number | null;
  onSelectSubmission: (submission: SubmissionListItem) => void;
  filters: SubmissionFilters;
  onFilterChange: (filters: SubmissionFilters) => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoading?: boolean;
  totalCount?: number;
}

export default function SubmissionsList({
  submissions,
  selectedSubmissionId,
  onSelectSubmission,
  filters,
  onFilterChange,
  hasMore = false,
  onLoadMore,
  isLoading = false,
  totalCount = 0,
}: SubmissionsListProps) {
  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden pl-2">
      {/* Search Filters */}
      <SubmissionsFilter onFilterChange={onFilterChange} filters={filters} />

      {/* Submissions Table */}
      <div
        className="flex-1 overflow-y-auto bg-gray-50"
        id="submissions-scroll-container"
      >
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
          <InfiniteScroll
            dataLength={submissions.length}
            next={onLoadMore || (() => {})}
            hasMore={hasMore}
            loader={
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="dots-loader mb-4" />
              </div>
            }
            scrollableTarget="submissions-scroll-container"
            className="overflow-x-auto"
          >
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
                  <SubmissionRow
                    key={submission.node.id}
                    submission={submission.node}
                    index={index}
                    isSelected={selectedSubmissionId === submission.node.id}
                    onSelect={onSelectSubmission}
                  />
                ))}
              </tbody>
            </table>
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}
