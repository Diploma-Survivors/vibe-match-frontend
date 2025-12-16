import MonacoEditor from '@/components/problems/tabs/description/panels/editor-panel/monaco-editor';
import { Button } from '@/components/ui/button';
import { ContestsService } from '@/services/contests-service';
import { selectContest } from '@/store/slides/contest-slice';
import { CONTEST_SUBMISSION_STRATEGY_DESCRIPTION } from '@/types/contests';
import { getDefaultCode } from '@/types/languages';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Play, Send } from 'lucide-react';
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

const MotionButton = motion.create(Button);

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
      className="flex flex-col overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
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
            <MotionButton
              layout
              onClick={handleRunClick}
              disabled={isRunning}
              variant="outline"
              size="sm"
              className="h-8 text-sm overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isRunning ? (
                  <motion.div
                    key="running"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center"
                  >
                    <div className="w-3 h-3 border-2 border-slate-400/20 border-t-slate-400 rounded-full animate-spin mr-1.5" />
                    Running...
                  </motion.div>
                ) : (
                  <motion.div
                    key="run"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-center"
                  >
                    <Play className="w-3.5 h-3.5 mr-1.5" />
                    Run
                  </motion.div>
                )}
              </AnimatePresence>
            </MotionButton>
            <MotionButton
              layout
              onClick={handleSubmitClick}
              disabled={isSubmitting || !isInProgress}
              className="h-8 text-sm bg-green-600 hover:bg-green-700 text-white overflow-hidden relative"
              size="sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isSubmitting ? (
                  <motion.div
                    key="submitting"
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: -20 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="flex items-center"
                  >
                    <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin mr-1.5" />
                    Submitting...
                  </motion.div>
                ) : (
                  <motion.div
                    key="submit"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50, transition: { duration: 0.2 } }}
                    className="flex items-center"
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    Submit
                  </motion.div>
                )}
              </AnimatePresence>
            </MotionButton>
          </div>
        </div>
      </div>
    </div>
  );
}
