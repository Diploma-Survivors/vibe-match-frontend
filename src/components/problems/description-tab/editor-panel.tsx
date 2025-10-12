import MonacoSubmitEditor from '@/components/editor/monaco-submit-editor';
import { CheckCircle } from 'lucide-react';

interface EditorPanelProps {
  height: number;
  output: string;
  isRunning: boolean;
  isSubmitting: boolean;
  onRun: () => void;
  onSubmit: () => void;
}

export function EditorPanel({
  height,
  output,
  isRunning,
  isSubmitting,
  onRun,
  onSubmit,
}: EditorPanelProps) {
  return (
    <div
      className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl overflow-hidden"
      style={{ height: `${height}%` }}
    >
      <div className="h-full flex flex-col">
        <div className="flex-1 min-h-0">
          <MonacoSubmitEditor
            onRun={onRun}
            onSubmit={onSubmit}
            isRunning={isRunning}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Output Section */}
        {output && (
          <div className="border-t border-slate-200/50 dark:border-slate-700/50 p-4 bg-slate-50/50 dark:bg-slate-800/50 flex-shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Execution Result
              </h4>
            </div>
            <div className="bg-slate-900 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 shadow-inner max-h-32 overflow-y-auto">
              <pre className="text-green-400 dark:text-green-300 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                {output}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
