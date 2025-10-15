import { getStatusMeta } from '@/lib/utils/testcase-status';
import type { SSEResult } from '@/services/sse-service';
import { Plus, X } from 'lucide-react';

type ActiveTab = 'testcase' | 'result';

interface CaseTabsProps {
  activeTab: ActiveTab;
  hasResults: boolean;
  testCases: Array<{ id: string }>;
  activeTestCase: number;
  testResults?: SSEResult | null;
  onActiveTestCaseChange: (index: number) => void;
  onTestCaseDelete: (id: string) => void;
  onTestCaseAdd: () => void;
}

export function CaseTabs({
  activeTab,
  hasResults,
  testCases,
  activeTestCase,
  testResults,
  onActiveTestCaseChange,
  onTestCaseDelete,
  onTestCaseAdd,
}: CaseTabsProps) {
  return (
    <div className="flex items-center gap-2 mb-6 overflow-x-auto">
      {testCases.map((testCase, index) => {
        const testResult =
          testResults?.results && index < testResults.results.length
            ? testResults.results[index]
            : null;
        const statusInfo =
          activeTab === 'result' && testResult
            ? getStatusMeta(testResult.status)
            : null;

        return (
          <div key={testCase.id} className="relative group">
            <button
              onClick={() => onActiveTestCaseChange(index)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                activeTestCase === index
                  ? 'bg-slate-300 dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {activeTab === 'result' && statusInfo ? (
                <span className={statusInfo.iconColor}>{statusInfo.icon}</span>
              ) : null}
              Case {index + 1}
            </button>

            {activeTab === 'testcase' && testCases.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTestCaseDelete(testCase.id);
                }}
                className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-full p-0.5 shadow"
                aria-label="Delete testcase"
              >
                <X className="w-3 h-3 text-black dark:text-white" />
              </button>
            )}
          </div>
        );
      })}

      {activeTab === 'testcase' && (
        <button
          onClick={onTestCaseAdd}
          className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-200 flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Add</span>
        </button>
      )}
    </div>
  );
}
