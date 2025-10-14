import MonacoEditor from '@/components/editor/monaco-editor';
import { Button } from '@/components/ui/button';
import { CheckCircle, Play, Send } from 'lucide-react';
import { useState } from 'react';

interface EditorPanelProps {
  height: number;
  isRunning: boolean;
  isSubmitting: boolean;
  onRun: (sourceCode: string, languageId: number) => void;
  onSubmit: (sourceCode: string, languageId: number) => void;
}

export function EditorPanel({
  height,
  isRunning,
  isSubmitting,
  onRun,
  onSubmit,
}: EditorPanelProps) {
  const [currentCode, setCurrentCode] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('cpp');

  // Map language strings to languageId numbers
  const getLanguageId = (language: string): number => {
    const languageMap: Record<string, number> = {
      python: 71,
      cpp: 52,
      java: 62,
      javascript: 63,
    };
    return languageMap[language] || 52; // Default to C++ if not found
  };

  const handleCodeChange = (code: string, language: string) => {
    setCurrentCode(code);
    setCurrentLanguage(language);
  };

  const handleRunClick = () => {
    const languageId = getLanguageId(currentLanguage);
    onRun(currentCode, languageId);
  };

  const handleSubmitClick = () => {
    const languageId = getLanguageId(currentLanguage);
    onSubmit(currentCode, languageId);
  };

  return (
    <div
      className="flex flex-col overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
      style={{ height: `${height}%` }}
    >
      <div className="flex-1 min-h-0 flex flex-col">
        {/* Monaco Editor */}
        <div className="flex-1 min-h-0">
          <MonacoEditor onCodeChange={handleCodeChange} />
        </div>

        {/* Footer cố định chứa nút Run/Submit */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex-shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {/* Hiện tại không lấy được vị trí con trỏ, có thể bổ sung nếu cần */}
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
              disabled={isSubmitting}
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
