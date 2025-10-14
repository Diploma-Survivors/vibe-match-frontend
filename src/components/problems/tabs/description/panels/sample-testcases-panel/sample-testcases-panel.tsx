import { getStatusMeta } from '@/lib/utils/testcase-status';
import type { SSEResult } from '@/services/sse-service';
import { CheckCircle, Clock, Code, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ResultTab } from './result-tab';
import { TestcaseTab } from './testcase-tab';

interface TestCase {
  id: string;
  input: string;
  output: string;
  isEditing: boolean;
}

interface SampleTestCasesPanelProps {
  height: number;
  testCases: TestCase[];
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

  const hasResults = (testResults?.results?.length ?? 0) > 0;

  return (
    <div
      className="flex flex-col overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
      style={{ height: `${height}%` }}
    >
      {/* Header Tabs */}
      <div className="px-6 pt-4">
        <div className="inline-flex items-center gap-2 rounded-xl p-1 bg-slate-100/70 dark:bg-slate-700/40">
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
        {/* Case Tabs with Add */}
        {!(activeTab === 'result' && !hasResults) && (
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
                      <span className={statusInfo.iconColor}>
                        {statusInfo.icon}
                      </span>
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

        {/* Bottom navigation removed as requested */}
      </div>
    </div>
  );
}
