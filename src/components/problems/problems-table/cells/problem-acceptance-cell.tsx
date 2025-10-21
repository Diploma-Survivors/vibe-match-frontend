interface ProblemAcceptanceCellProps {
  rate: number;
}

export default function ProblemAcceptanceCell({
  rate,
}: ProblemAcceptanceCellProps) {
  return (
    <div className="inline-flex items-center justify-center w-16 h-8 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700">
      {rate}%
    </div>
  );
}
