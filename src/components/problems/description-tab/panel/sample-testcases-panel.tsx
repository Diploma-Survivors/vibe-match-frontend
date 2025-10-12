import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Code, Plus, X } from 'lucide-react';

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
  onTestCaseAdd,
  onTestCaseDelete,
  onTestCaseEdit,
  onTestCaseSave,
  onTestCaseChange,
  onActiveTestCaseChange,
}: SampleTestCasesPanelProps) {
  return (
    <div
      className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl overflow-hidden flex flex-col"
      style={{ height: `${height}%` }}
    >
      {/* Test Cases Content */}
      <div className="p-6 flex-1 overflow-y-auto">
        {/* Test Case Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto">
          {testCases.map((testCase, index) => (
            <button
              key={testCase.id}
              onClick={() => onActiveTestCaseChange(index)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeTestCase === index
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              Case {index + 1}
            </button>
          ))}
          <button
            onClick={onTestCaseAdd}
            className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-200 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add</span>
          </button>
        </div>

        {/* Active Test Case Content */}
        {testCases[activeTestCase] && (
          <div className="space-y-6">
            {/* Input Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <span className="text-blue-500">📥</span>
                  Input
                </h4>
                {testCases.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      onTestCaseDelete(testCases[activeTestCase].id)
                    }
                    className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
              {testCases[activeTestCase].isEditing ? (
                <div className="space-y-2">
                  <textarea
                    value={testCases[activeTestCase].input}
                    onChange={(e) =>
                      onTestCaseChange(
                        testCases[activeTestCase].id,
                        'input',
                        e.target.value
                      )
                    }
                    placeholder="Enter input values..."
                    className="w-full h-24 p-3 text-sm font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        onTestCaseSave(testCases[activeTestCase].id)
                      }
                      className="bg-green-600 hover:bg-green-700 text-white text-xs"
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onTestCaseEdit(testCases[activeTestCase].id)
                      }
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => onTestCaseEdit(testCases[activeTestCase].id)}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Click to edit
                    </span>
                    <Code className="w-3 h-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                  </div>
                  <pre className="text-sm font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                    {testCases[activeTestCase].input || 'Enter input...'}
                  </pre>
                </div>
              )}
            </div>

            {/* Output Section */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                <span className="text-green-500">📤</span>
                Expected Output
              </h4>
              {testCases[activeTestCase].isEditing ? (
                <textarea
                  value={testCases[activeTestCase].output}
                  onChange={(e) =>
                    onTestCaseChange(
                      testCases[activeTestCase].id,
                      'output',
                      e.target.value
                    )
                  }
                  placeholder="Enter expected output..."
                  className="w-full h-24 p-3 text-sm font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200"
                />
              ) : (
                <div
                  onClick={() => onTestCaseEdit(testCases[activeTestCase].id)}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Click to edit
                    </span>
                    <Code className="w-3 h-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                  </div>
                  <pre className="text-sm font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                    {testCases[activeTestCase].output ||
                      'Enter expected output...'}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Test Case Navigation */}
        {testCases.length > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onActiveTestCaseChange(Math.max(0, activeTestCase - 1))
              }
              disabled={activeTestCase === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {activeTestCase + 1} of {testCases.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onActiveTestCaseChange(
                  Math.min(testCases.length - 1, activeTestCase + 1)
                )
              }
              disabled={activeTestCase === testCases.length - 1}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
