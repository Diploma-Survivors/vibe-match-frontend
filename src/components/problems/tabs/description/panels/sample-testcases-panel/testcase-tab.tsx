import type { UITestcaseSample } from '@/types/testcases';
import { useCallback, useEffect } from 'react';

interface TestcaseTabProps {
  testCases: UITestcaseSample[];
  activeTestCase: number;
  onTestCaseChange: (
    id: string,
    field: 'input' | 'output',
    value: string
  ) => void;
}

export function TestcaseTab({
  testCases,
  activeTestCase,
  onTestCaseChange,
}: TestcaseTabProps) {
  const autoResize = useCallback((el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = '0px';
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  useEffect(() => {
    const currentCaseId = testCases[activeTestCase]?.id;
    if (!currentCaseId) return;
    const inputEl = document.getElementById(
      `tc-input-${currentCaseId}`
    ) as HTMLTextAreaElement | null;
    const outputEl = document.getElementById(
      `tc-output-${currentCaseId}`
    ) as HTMLTextAreaElement | null;
    autoResize(inputEl);
    autoResize(outputEl);
  }, [activeTestCase, testCases, autoResize]);

  if (!testCases[activeTestCase]) return null;

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Input
          </h4>
        </div>
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
      </div>

      <div>
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
          Expected Output
        </h4>
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
      </div>
    </>
  );
}

export default TestcaseTab;
