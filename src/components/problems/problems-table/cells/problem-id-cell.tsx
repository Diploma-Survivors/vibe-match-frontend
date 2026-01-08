interface ProblemIdCellProps {
  id: string;
}

export default function ProblemIdCell({ id }: ProblemIdCellProps) {
  return (
    <div className="inline-flex px-3 py-2 bg-muted/50 rounded-lg border border-border">
      <code className="text-foreground font-mono font-bold text-sm">
        {id.toString().slice(0, 8)}
      </code>
    </div>
  );
}
