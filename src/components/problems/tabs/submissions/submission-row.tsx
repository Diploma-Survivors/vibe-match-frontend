'use client';

import { getStatusMeta } from '@/lib/utils/testcase-status';
import type { SubmissionListItem } from '@/types/submissions';
import { Clock, Cpu } from 'lucide-react';

interface SubmissionRowProps {
  submission: SubmissionListItem;
  index: number;
  isSelected: boolean;
  onSelect: (submission: SubmissionListItem) => void;
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

export default function SubmissionRow({
  submission,
  index,
  isSelected,
  onSelect,
}: SubmissionRowProps) {
  return (
    <tr
      className={`cursor-pointer transition-all duration-200 group ${
        isSelected ? 'bg-gray-200' : 'hover:bg-gray-100'
      }`}
      onClick={() => onSelect(submission)}
      style={{
        animationDelay: `${index * 50}ms`,
        animation: 'fadeInUp 0.25s ease-out forwards',
      }}
    >
      {/* Status */}
      <td className="px-4 py-3">
        {(() => {
          const statusInfo = getStatusMeta(submission.status);
          return (
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-md transition-all duration-200 group-hover:scale-105">
                <span className={statusInfo.iconColor}>{statusInfo.icon}</span>
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
              {submission.language.name.split(' ')[0]}
            </span>
            <span className="text-gray-500 text-[11px]">
              {submission.language.name.split(' ').slice(1).join(' ')}
            </span>
          </div>
        </div>
      </td>

      {/* Runtime */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-xs font-medium text-gray-900">
            {formatRuntime(submission.runtime)}
          </span>
        </div>
      </td>

      {/* Memory */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <Cpu className="h-4 w-4 text-gray-400" />
          <span className="text-xs font-medium text-gray-900">
            {formatMemory(submission.memory)}
          </span>
        </div>
      </td>
    </tr>
  );
}
