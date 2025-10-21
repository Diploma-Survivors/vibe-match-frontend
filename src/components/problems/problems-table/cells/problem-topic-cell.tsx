import type { Topic } from '@/types/topics';

interface ProblemTopicCellProps {
  topics?: Topic[];
}

export default function ProblemTopicCell({ topics }: ProblemTopicCellProps) {
  return (
    <div className="space-y-2">
      <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm break-words">
        {topics?.at(0)?.name || 'N/A'}
      </div>
      {topics?.slice(1)?.map((topic) => (
        <div
          key={topic.id}
          className="text-xs text-slate-600 dark:text-slate-400 break-words"
        >
          {topic.name}
        </div>
      ))}
    </div>
  );
}
