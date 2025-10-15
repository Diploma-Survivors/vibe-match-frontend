import { getStatusMeta } from '@/lib/utils/testcase-status';
import type { SSEResult } from '@/services/sse-service';
import { X } from 'lucide-react';
import { useState } from 'react';

interface SubmitResultTabProps {
  width: number;
  result: SSEResult | null;
  onClose: () => void;
}

export function SubmitResultTab({
  width,
  result,
  onClose,
}: SubmitResultTabProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const statusInfo = result ? getStatusMeta(result.status) : null;
  const total = result?.totalTests ?? 0;
  const passed = result?.passedTests ?? 0;
  const percent = total > 0 ? Math.round((passed / total) * 100) : 0;

  return (
    <div className="overflow-y-auto h-full pb-4" style={{ width: `${width}%` }}>
      <div className="pr-3">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                Kết Quả Chấm Bài
              </h2>
              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Verdict */}
            {statusInfo && (
              <div className={`p-4 rounded-lg border ${statusInfo.color}`}>
                <div className="flex items-center gap-3 text-base font-semibold">
                  {statusInfo.icon}
                  <span>{statusInfo.label}</span>
                </div>
                {result?.results?.length ? (
                  <div className="text-slate-600 dark:text-slate-400 mt-1">
                    {result.passedTests}/{result.totalTests} test cases passed
                  </div>
                ) : null}
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                <div className="text-xs text-slate-500">SCORE</div>
                <div className="text-lg font-semibold">
                  {result?.score ?? 0} / 100
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                <div className="text-xs text-slate-500">RUNTIME</div>
                <div className="text-lg font-semibold">
                  {result?.runtime ?? 0} ms
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                <div className="text-xs text-slate-500">MEMORY</div>
                <div className="text-lg font-semibold">
                  {result?.memory ?? 0} KB
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-1">
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Test Cases Passed: {passed}/{total}
              </div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2">
              {result?.results?.map((r, idx) => {
                const meta = getStatusMeta(r.status);
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={r.token}
                    className="rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between px-4 py-2 text-left"
                    >
                      <div className="flex items-center gap-2 font-semibold">
                        {meta.icon}
                        <span>Test Case {idx + 1}</span>
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-4">
                        <span>🕒 {r.time} ms</span>
                        <span>🧠 {r.memory} KB</span>
                      </div>
                    </button>
                    {isOpen && (
                      <div className="border-t border-slate-200 dark:border-slate-700 p-4 space-y-3">
                        <div>
                          <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Input
                          </div>
                          <pre className="bg-slate-50 dark:bg-slate-900 rounded p-3 text-sm whitespace-pre-wrap" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Your Output (stdout)
                          </div>
                          <pre className="bg-slate-200 dark:bg-slate-600 rounded p-3 text-sm whitespace-pre-wrap">
                            {r.stdout || '(no output)'}
                          </pre>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Expected Output
                          </div>
                          <pre className="bg-slate-50 dark:bg-slate-800 rounded p-3 text-sm whitespace-pre-wrap">
                            {r.expectedOutput ?? ''}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubmitResultTab;
