import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useState } from 'react';

interface SampleTestCaseProps {
  testCase: {
    input?: string;
    output?: string;
    explanation?: string;
  };
  index: number;
}

export function SampleTestCase({ testCase, index }: SampleTestCaseProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, copyIndex: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(copyIndex);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="mb-6 last:mb-0">
      <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-3">
        Test case {index + 1}
      </h3>

      {/* Input */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
            Input
          </h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(testCase.input || '', index * 2)}
            className="h-6 px-2 text-xs"
          >
            <Copy className="w-3 h-3 mr-1" />
            {copiedIndex === index * 2 ? 'Copied!' : 'Copy'}
          </Button>
        </div>
        <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <code className="text-slate-800 dark:text-slate-200 font-mono text-sm whitespace-pre-wrap">
            {testCase.input}
          </code>
        </div>
      </div>

      {/* Output */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
            Output
          </h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              copyToClipboard(testCase.output || '', index * 2 + 1)
            }
            className="h-6 px-2 text-xs"
          >
            <Copy className="w-3 h-3 mr-1" />
            {copiedIndex === index * 2 + 1 ? 'Copied!' : 'Copy'}
          </Button>
        </div>
        <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <code className="text-slate-800 dark:text-slate-200 font-mono text-sm whitespace-pre-wrap">
            {testCase.output}
          </code>
        </div>
      </div>

      {/* Explanation */}
      {testCase.explanation && (
        <div className="text-sm text-slate-600 dark:text-slate-400 italic">
          {testCase.explanation}
        </div>
      )}
    </div>
  );
}
