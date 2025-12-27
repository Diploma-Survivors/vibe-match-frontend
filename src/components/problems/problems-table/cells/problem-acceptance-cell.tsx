interface ProblemAcceptanceCellProps {
  rate: number;
}

export default function ProblemAcceptanceCell({
  rate,
}: ProblemAcceptanceCellProps) {
  return (
    <div className="inline-flex items-center justify-center w-16 h-8 rounded-full text-xs font-bold bg-green-500/10 text-green-600 border border-green-500/20">
      {rate}%
    </div>
  );
}
