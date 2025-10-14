import { Button } from '@/components/ui/button';
import type { SSEResult } from '@/services/sse-service';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Code,
  Plus,
  X,
  XCircle,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

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
  onTestCaseEdit: (id: string) => void;
  onTestCaseSave: (id: string) => void;
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
  onTestCaseEdit,
  onTestCaseSave,
  onTestCaseChange,
  onActiveTestCaseChange,
}: SampleTestCasesPanelProps) {
  const [activeTab, setActiveTab] = useState<'testcase' | 'result'>('testcase');

  const autoResize = useCallback((el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = '0px';
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  // Helper function to get test result for a specific test case
  const getTestResult = (testCaseIndex: number) => {
    if (
      !testResults ||
      !testResults.results ||
      testCaseIndex >= testResults.results.length
    ) {
      return null;
    }
    return testResults.results[testCaseIndex];
  };

  // Helper function to get status styling
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          color: 'text-green-600 bg-green-50 dark:bg-green-900/20',
          label: 'Accepted',
        };
      case 'WRONG_ANSWER':
        return {
          icon: <XCircle className="w-4 h-4" />,
          color: 'text-red-600 bg-red-50 dark:bg-red-900/20',
          label: 'Wrong Answer',
        };
      case 'TIME_LIMIT_EXCEEDED':
        return {
          icon: <Clock className="w-4 h-4" />,
          color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
          label: 'Time Limit Exceeded',
        };
      case 'RUNTIME_ERROR':
        return {
          icon: <AlertTriangle className="w-4 h-4" />,
          color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
          label: 'Runtime Error',
        };
      default:
        return {
          icon: <AlertTriangle className="w-4 h-4" />,
          color: 'text-gray-600 bg-gray-50 dark:bg-gray-900/20',
          label: status,
        };
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'ACCEPTED':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'WRONG_ANSWER':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'TIME_LIMIT_EXCEEDED':
        return <Clock className="w-4 h-4 text-orange-600" />;
      case 'RUNTIME_ERROR':
        return <AlertTriangle className="w-4 h-4 text-purple-600" />;
      default:
        return null;
    }
  };

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

  // Ensure textarea height matches content when switching cases/tabs or changing content
  useEffect(() => {
    if (activeTab !== 'testcase') return;
    const currentCaseId = testCases[activeTestCase]?.id;
    const inputEl = document.getElementById(
      `tc-input-${currentCaseId}`
    ) as HTMLTextAreaElement | null;
    const outputEl = document.getElementById(
      `tc-output-${currentCaseId}`
    ) as HTMLTextAreaElement | null;
    autoResize(inputEl);
    autoResize(outputEl);
  }, [activeTab, activeTestCase, testCases[activeTestCase]?.id, autoResize]);

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
              const testResult = getTestResult(index);
              const statusInfo =
                activeTab === 'result' && testResult
                  ? getStatusInfo(testResult.status)
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
                    {activeTab === 'result' && testResult
                      ? getStatusIcon(testResult.status)
                      : null}
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
            {activeTab === 'result' && !hasResults ? (
              <div
                className={`w-full py-20 text-center font-semibold flex items-center justify-center gap-3 ${runError ? 'text-red-600' : 'text-slate-700 dark:text-slate-300'}`}
              >
                {isRunning && (
                  <div className="w-4 h-4 border-2 border-slate-400/30 border-t-slate-500 rounded-full animate-spin" />
                )}
                <span>
                  {isRunning
                    ? 'Đang chạy sample testcases...'
                    : runError ||
                      'Bạn phải bấm run để xem kết quả testcase sample'}
                </span>
              </div>
            ) : (
              <>
                {/* Status only in result tab */}
                {activeTab === 'result' &&
                  (() => {
                    const testResult = getTestResult(activeTestCase);
                    const statusInfo = testResult
                      ? getStatusInfo(testResult.status)
                      : null;

                    if (statusInfo) {
                      return (
                        <div
                          className={`p-4 rounded-lg border ${statusInfo.color}`}
                        >
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2 font-semibold">
                              {statusInfo?.icon}
                              <span>{statusInfo.label}</span>
                            </div>
                            {testResult && (
                              <>
                                <span className="text-slate-700 dark:text-slate-200 font-semibold">
                                  Runtime: {testResult.time} ms
                                </span>
                                <span className="text-slate-700 dark:text-slate-200 font-semibold">
                                  Memory: {testResult.memory} KB
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                {/* Input Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Input
                    </h4>
                  </div>
                  {activeTab === 'testcase' ? (
                    <textarea
                      id={`tc-input-${testCases[activeTestCase].id}`}
                      rows={1}
                      value={testCases[activeTestCase].input}
                      onInput={(e) => autoResize(e.currentTarget)}
                      onChange={(e) =>
                        onTestCaseChange(
                          testCases[activeTestCase].id,
                          'input',
                          e.target.value
                        )
                      }
                      placeholder="Enter input values..."
                      className="w-full min-h-10 p-3 text-sm font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                    />
                  ) : (
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                      <pre className="text-sm font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                        {testCases[activeTestCase].input || '(no input)'}
                      </pre>
                    </div>
                  )}
                </div>

                {/* Expected Output Section */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Expected Output
                  </h4>
                  {activeTab === 'testcase' ? (
                    <textarea
                      id={`tc-output-${testCases[activeTestCase].id}`}
                      rows={1}
                      value={testCases[activeTestCase].output}
                      onInput={(e) => autoResize(e.currentTarget)}
                      onChange={(e) =>
                        onTestCaseChange(
                          testCases[activeTestCase].id,
                          'output',
                          e.target.value
                        )
                      }
                      placeholder="Enter expected output..."
                      className="w-full min-h-10 p-3 text-sm font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                    />
                  ) : (
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                      <pre className="text-slate-800 dark:text-slate-200 font-mono text-sm whitespace-pre-wrap">
                        {getTestResult(activeTestCase)?.expectedOutput ??
                          (testCases[activeTestCase].output ||
                            'No expected output')}
                      </pre>
                    </div>
                  )}
                </div>

                {/* Your Output - only in result tab when available */}
                {activeTab === 'result' &&
                  (() => {
                    const testResult = getTestResult(activeTestCase);
                    if (!testResult) return null;
                    return (
                      <div>
                        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                          Your Output
                        </h4>
                        <div className="bg-slate-200 dark:bg-slate-600 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                          <pre className="text-black dark:text-black font-mono text-sm whitespace-pre-wrap">
                            {testResult.stdout || '(no output)'}
                          </pre>
                          {testResult.stderr && (
                            <pre className="text-black dark:text-black font-mono text-sm whitespace-pre-wrap mt-2">
                              {testResult.stderr}
                            </pre>
                          )}
                        </div>
                      </div>
                    );
                  })()}
              </>
            )}
          </div>
        )}

        {/* Bottom navigation removed as requested */}
      </div>
    </div>
  );
}
