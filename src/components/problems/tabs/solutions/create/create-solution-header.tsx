import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RotateCcw, Send } from 'lucide-react';

import { useTranslation } from 'react-i18next';

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
  submitLabel,
}: CreateSolutionHeaderProps) {
  const { t } = useTranslation('problems');
  return (
    <div className="h-12 flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={t('enter_solution_title')}
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
          {t('reset_to_default')}
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          {t('cancel_action')}
        </Button>
        <Button
          onClick={onPost}
          className="gap-2 bg-green-600 hover:bg-green-700 text-white"
        >
          <Send className="w-4 h-4" />
          {submitLabel || t('post_solution')}
        </Button>
      </div>
    </div>
  );
}
