import type { Topic } from '@/types/topics';

interface ProblemTopicCellProps {
  topics?: Topic[];
}

export default function ProblemTopicCell({ topics }: ProblemTopicCellProps) {
  return (
    <div className="space-y-2">
      <div className="font-semibold text-foreground text-sm break-words">
        {topics?.at(0)?.name || '---'}
      </div>
      {topics?.slice(1)?.map((topic) => (
        <div
          key={topic.id}
          className="text-xs text-muted-foreground break-words"
        >
          {topic.name}
        </div>
      ))}
    </div>
  );
}
