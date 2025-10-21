interface ProblemIdCellProps {
  id: string;
}

export default function ProblemIdCell({ id }: ProblemIdCellProps) {
  return (
    <div className="inline-flex px-3 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg border border-green-200 dark:border-green-700">
      <code className="text-green-700 dark:text-green-300 font-bold text-sm">
        {id.toString().slice(0, 8)}
      </code>
    </div>
  );
}
