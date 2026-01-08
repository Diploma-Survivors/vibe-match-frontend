interface ProblemStatusCellProps {
  isCompleted?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function ProblemStatusCell({
  isCompleted = false,
  onChange,
}: ProblemStatusCellProps) {
  return (
    <input
      type="checkbox"
      checked={isCompleted}
      onChange={(e) => onChange?.(e.target.checked)}
      className="w-4 h-4 rounded border-2 border-slate-300 accent-green-600 cursor-pointer transition-colors"
    />
  );
}
