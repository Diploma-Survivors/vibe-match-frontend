import { getStatusMeta } from '@/lib/utils/testcase-status';
import type { SSEResult } from '@/services/sse-service';
import type { SampleTestcase } from '@/types/testcases';
import { Plus, X } from 'lucide-react';

type ActiveTab = 'testcase' | 'result';

interface CaseTabsProps {
  activeTab: ActiveTab;
  hasResults: boolean;
  testCases: SampleTestcase[];
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
    <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
      {testCases.map((testCase, index) => {
        const testResult =
          testResults?.results && index < testResults.results.length
            ? testResults.results[index]
            : null;
        const statusInfo =
          activeTab === 'result' && testResult
            ? getStatusMeta(testResult.status)
            : null;

        const isActive = activeTestCase === index;

        return (
          <div key={testCase.id} className="relative group shrink-0">
            <button
              onClick={() => onActiveTestCaseChange(index)}
              className={`h-8 px-4 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2 border ${
                isActive
                  ? 'bg-primary/10 text-primary border-primary/20 shadow-sm shadow-primary/5'
                  : 'bg-background border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:border-border/80'
              }`}
            >
              {/* Show status icon for result tab */}
              {activeTab === 'result' && statusInfo ? (
                <span className={statusInfo.iconColor}>{statusInfo.icon}</span>
              ) : null}
              Case {index + 1}
            </button>

            {activeTab === 'testcase' && testCases.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTestCaseDelete(testCase.id ?? '');
                }}
                className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-background border border-border rounded-full p-0.5 shadow-sm hover:bg-destructive hover:border-destructive hover:text-destructive-foreground z-10"
                aria-label="Delete testcase"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        );
      })}

      {activeTab === 'testcase' && (
        <button
          onClick={onTestCaseAdd}
          className="h-8 px-3 rounded-full text-xs font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-200 flex items-center gap-1 border border-transparent hover:border-border shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      )}
    </div>
  );
}
