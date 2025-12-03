import MonacoEditor from '@/components/problems/tabs/description/panels/editor-panel/monaco-editor';
import { Button } from '@/components/ui/button';
import { ContestsService } from '@/services/contests-service';
import { selectContest } from '@/store/slides/contest-slice';
import { CONTEST_SUBMISSION_STRATEGY_DESCRIPTION } from '@/types/contests';
import { getDefaultCode } from '@/types/languages';
import { AlertCircle, CheckCircle, Play, Send } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useSelector } from 'react-redux';

interface EditorPanelProps {
  height: number;
  isRunning: boolean;
  isSubmitting: boolean;
  contestMode?: boolean;
  onRun: (sourceCode: string, languageId: number) => void;
  onSubmit: (
    sourceCode: string,
    languageId: number,
    contestId?: number
  ) => void;
}

export function EditorPanel({
  height,
  isRunning,
  isSubmitting,
  contestMode = false,
  onRun,
  onSubmit,
}: EditorPanelProps) {
  const pathname = usePathname();
  const segments = pathname.split('/');
  const contestId =
    segments[1] === 'contests' && segments[2]
      ? Number.parseInt(segments[2], 10)
      : undefined;
  const [currentCode, setCurrentCode] = useState(getDefaultCode(52));
  const [currentLanguageId, setCurrentLanguageId] = useState(52);

  const handleRunClick = () => {
    onRun(currentCode, currentLanguageId);
  };

  const handleSubmitClick = () => {
    onSubmit(currentCode, currentLanguageId, contestId);
  };

  const contest = useSelector(selectContest);

  const isInProgress = contestMode
    ? ContestsService.isInprogress(contest)
    : true;

  const onLanguageIdChange = (languageId: number) => {
    setCurrentLanguageId(languageId);
    const defaultCode = getDefaultCode(languageId);
    setCurrentCode(defaultCode);
  };

  return (
    <div
      className="flex flex-col overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
      style={{ height: `${height}%` }}
    >
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex-1 min-h-0">
          <MonacoEditor
            currentLanguageId={currentLanguageId}
            setCurrentLanguageId={onLanguageIdChange}
            currentCode={currentCode}
            setCurrentCode={setCurrentCode}
          />
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <AlertCircle className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-500" />
            <span className="text-yellow-600 dark:text-yellow-500">
              {
                CONTEST_SUBMISSION_STRATEGY_DESCRIPTION[
                  contest.submissionStrategy
                ]
              }
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleRunClick}
              disabled={isRunning}
              variant="outline"
              size="sm"
              className="h-8 text-sm"
            >
              {isRunning ? (
                <>
                  <div className="w-3 h-3 border-2 border-slate-400/20 border-t-slate-400 rounded-full animate-spin mr-1.5" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 mr-1.5" />
                  Run
                </>
              )}
            </Button>
            <Button
              onClick={handleSubmitClick}
              disabled={isSubmitting || !isInProgress}
              className="h-8 text-sm bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin mr-1.5" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  Submit
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
