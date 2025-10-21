import { ProblemDifficulty } from '@/types/problems';
import type { Tag } from '@/types/tags';
import Link from 'next/link';

interface ProblemTitleCellProps {
  id: string;
  title: string;
  difficulty: string;
  tags: Tag[];
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case ProblemDifficulty.EASY:
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case ProblemDifficulty.MEDIUM:
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    case ProblemDifficulty.HARD:
      return 'bg-red-100 text-red-800 hover:bg-red-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

export default function ProblemTitleCell({
  id,
  title,
  difficulty,
  tags,
}: ProblemTitleCellProps) {
  return (
    <div className="space-y-3">
      <Link href={`/problems/${id}/description`}>
        <button
          type="button"
          className="text-left group-hover:text-green-600 dark:group-hover:text-green-400 font-bold text-base text-slate-900 dark:text-slate-100 transition-colors duration-200 hover:underline block w-full"
        >
          {title}
        </button>
      </Link>
      <div className="flex items-center gap-3 flex-wrap">
        <div
          className={`${getDifficultyColor(difficulty)} font-medium px-3 py-1 rounded-lg border text-xs inline-block`}
        >
          {difficulty}
        </div>
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
