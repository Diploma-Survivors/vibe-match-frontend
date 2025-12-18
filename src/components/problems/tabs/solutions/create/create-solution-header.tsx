import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RotateCcw, Send } from 'lucide-react';

interface CreateSolutionHeaderProps {
  title: string;
  setTitle: (title: string) => void;
  onPost: () => void;
  onCancel: () => void;
  onReset: () => void;
  submitLabel?: string;
}

export default function CreateSolutionHeader({
  title,
  setTitle,
  onPost,
  onCancel,
  onReset,
  submitLabel = 'Đăng solution',
}: CreateSolutionHeaderProps) {
  return (
    <div className="h-12 flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nhập tiêu đề cho solution"
        className="text-lg font-medium border-none shadow-none focus-visible:ring-0 px-0 h-full"
      />
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-slate-500 hover:text-slate-700"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset về mặc định
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          Hủy bỏ
        </Button>
        <Button
          onClick={onPost}
          className="gap-2 bg-green-600 hover:bg-green-700 text-white"
        >
          <Send className="w-4 h-4" />
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
