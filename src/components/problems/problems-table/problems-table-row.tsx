import { TableCell } from '@/components/ui/table';
import type { ProblemListItem } from '@/types/problems';
import { motion } from 'framer-motion';
import ProblemAcceptanceCell from './cells/problem-acceptance-cell';
import ProblemIdCell from './cells/problem-id-cell';
import ProblemStatusCell from './cells/problem-status-cell';
import ProblemTitleCell from './cells/problem-title-cell';
import ProblemTopicCell from './cells/problem-topic-cell';

interface ProblemTableRowProps {
  problem: ProblemListItem;
  index: number;
}

export default function ProblemTableRow({
  problem,
  index,
}: ProblemTableRowProps) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 50,
        damping: 20,
        delay: index * 0.05,
      }}
      whileHover={{ scale: 1.01, backgroundColor: 'rgba(241, 245, 249, 0.8)' }} // slate-100/80
      whileTap={{ scale: 0.98 }}
      className="border-b border-slate-100/50 dark:border-slate-700/30 transition-colors duration-200 group dark:hover:bg-slate-700/30 cursor-pointer relative z-0 hover:z-10 hover:shadow-sm"
      style={{ transformOrigin: 'center' }}
    >
      <TableCell className="text-center px-4 py-4 hidden md:table-cell">
        <ProblemIdCell id={problem.id} />
      </TableCell>

      <TableCell className="px-4 py-4 w-full sm:w-auto">
        <ProblemTitleCell
          id={problem.id}
          title={problem.title}
          difficulty={problem.difficulty}
          tags={problem.tags}
        />
      </TableCell>

      <TableCell className="text-center px-4 py-4 hidden lg:table-cell">
        <ProblemTopicCell topics={problem.topics} />
      </TableCell>

      <TableCell className="text-center px-4 py-4 hidden xl:table-cell">
        <ProblemAcceptanceCell rate={99.9} />
      </TableCell>

      <TableCell className="text-center px-4 py-4 hidden sm:table-cell">
        <ProblemStatusCell />
      </TableCell>
    </motion.tr>
  );
}
