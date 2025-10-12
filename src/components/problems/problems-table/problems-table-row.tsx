import { TableCell, TableRow } from '@/components/ui/table';
import type { ProblemListItem } from '@/types/problems';
import ProblemAcceptanceCell from './cells/problem-acceptance-cell';
import ProblemIdCell from './cells/problem-id-cell';
import ProblemStatusCell from './cells/problem-status-cell';
import ProblemTitleCell from './cells/problem-title-cell';
import ProblemTopicCell from './cells/problem-topic-cell';

interface ProblemTableRowProps {
  problem: ProblemListItem;
}

export default function ProblemTableRow({ problem }: ProblemTableRowProps) {
  return (
    <TableRow className="border-b border-slate-100/50 dark:border-slate-700/30 hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-all duration-200 group">
      <TableCell className="text-center px-4 py-4">
        <ProblemIdCell id={problem.id} />
      </TableCell>

      <TableCell className="px-4 py-4">
        <ProblemTitleCell
          id={problem.id}
          title={problem.title}
          difficulty={problem.difficulty}
          tags={problem.tags}
        />
      </TableCell>

      <TableCell className="text-center px-4 py-4">
        <ProblemTopicCell topics={problem.topics} />
      </TableCell>

      <TableCell className="text-center px-4 py-4">
        <ProblemAcceptanceCell rate={99.9} />
      </TableCell>

      <TableCell className="text-center px-4 py-4">
        <ProblemStatusCell />
      </TableCell>
    </TableRow>
  );
}
