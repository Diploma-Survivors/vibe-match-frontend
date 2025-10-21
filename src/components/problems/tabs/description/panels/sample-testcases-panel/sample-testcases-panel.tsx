// import removed: getStatusMeta is handled inside child components now
import type { SSEResult } from '@/services/sse-service';
import type { UITestcaseSample } from '@/types/testcases';
import { CheckCircle, Code } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CaseTabs } from './case-tabs';
import { ResultTab } from './result-tab';
import { TestcaseTab } from './testcase-tab';

interface SampleTestCasesPanelProps {
  height: number;
  testCases: UITestcaseSample[];
  activeTestCase: number;
  testResults?: SSEResult | null;
  isRunning?: boolean;
  runError?: string | null;
  onTestCaseAdd: () => void;
  onTestCaseDelete: (id: string) => void;
  onTestCaseChange: (
    id: string,
    field: 'input' | 'output',
    value: string
  ) => void;
  onActiveTestCaseChange: (index: number) => void;
}

export function SampleTestCasesPanel({
  height,
  testCases,
  activeTestCase,
  testResults,
  isRunning = false,
  runError = null,
  onTestCaseAdd,
  onTestCaseDelete,
  onTestCaseChange,
  onActiveTestCaseChange,
}: SampleTestCasesPanelProps) {
  const [activeTab, setActiveTab] = useState<'testcase' | 'result'>('testcase');

  // Auto switch to Result tab when results arrive
  useEffect(() => {
    if (testResults?.results && testResults.results.length > 0) {
      setActiveTab('result');
    }
  }, [testResults]);

  // Auto switch to Result tab when starting to run
  useEffect(() => {
    if (isRunning) {
      setActiveTab('result');
    }
  }, [isRunning]);

  // True when there is at least one testcase result (used to control rendering)
  const hasResults = (testResults?.results?.length ?? 0) > 0;

  return (
    <div
      className="flex flex-col overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
      style={{ height: `${height}%` }}
    >
      {/* Header Tabs */}
      <div className="px-6 pt-4">
        <div className="inline-flex items-center gap-2 rounded-xl p-1 bg-slate-100/70 dark:bg-slate-700/40">
          {/* Tescase tab */}
          <button
            onClick={() => setActiveTab('testcase')}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
              activeTab === 'testcase'
                ? 'bg-white dark:bg-slate-800 shadow text-slate-900 dark:text-white'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            Testcase
          </button>

          {/* Result tab */}
          <button
            onClick={() => setActiveTab('result')}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
              activeTab === 'result'
                ? 'bg-white dark:bg-slate-800 shadow text-slate-900 dark:text-white'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Code className="w-4 h-4" />
            Test Result
          </button>
        </div>
      </div>

      <div className="p-6 pt-4 flex-1">
        {/* Show CaseTabs in all cases except when on the 'result' tab with no results yet */}
        {!(activeTab === 'result' && !hasResults) && (
          <CaseTabs
            activeTab={activeTab}
            hasResults={hasResults}
            testCases={testCases}
            activeTestCase={activeTestCase}
            testResults={testResults}
            onActiveTestCaseChange={onActiveTestCaseChange}
            onTestCaseDelete={onTestCaseDelete}
            onTestCaseAdd={onTestCaseAdd}
          />
        )}

        {/* Content */}
        {testCases[activeTestCase] && (
          <div className="space-y-6">
            {activeTab === 'result' ? (
              <ResultTab
                testCases={testCases}
                activeTestCase={activeTestCase}
                testResults={testResults}
                isRunning={isRunning}
                runError={runError}
              />
            ) : (
              <TestcaseTab
                testCases={testCases}
                activeTestCase={activeTestCase}
                onTestCaseChange={onTestCaseChange}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
