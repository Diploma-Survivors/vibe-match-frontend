import ReadOnlyEditor from '@/components/lexical-editor/lexical-editor';
import { Button } from '@/components/ui/button';

import { toastService } from '@/services/toasts-service';
import type { ProblemDescription } from '@/types/problems';
import { ProblemDifficulty } from '@/types/problems';

import type { SampleTestcase } from '@/types/testcases';
import { FileText, MemoryStick, Timer } from 'lucide-react';
import { Copy } from 'lucide-react';
import { useContext, useState } from 'react';
import { ProblemDiscussion } from './problem-discussion';
import { ProblemTopicsTags } from './problem-topics-tags';
import { useTranslation } from 'react-i18next';

interface DescriptionPanelProps {
  problem: ProblemDescription;
  width: number;
}

export function DescriptionPanel({ problem, width }: DescriptionPanelProps) {
  const { t } = useTranslation('problems');
  const sampleCases: SampleTestcase[] = problem.testcaseSamples || [];
  const [activeSampleIndex, setActiveSampleIndex] = useState(0);

  // Format time and memory limit
  const timeLimitSeconds = (problem.timeLimitMs / 1000).toFixed(1);
  const memoryLimitMB = (problem.memoryLimitKb / 1024).toFixed(0);

  // Choose sample case
  const activeSample = sampleCases[activeSampleIndex];

  // helper function to copy to clipboard
  const copyToClipboard = (text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toastService.success('Đã sao chép vào clipboard!');
  };

  return (
    <div className="h-full pb-4 pr-1" style={{ width: `${width}%` }}>
      <div className="rounded-xl h-full flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {/* Problem Title Header */}
          <div className="pb-6 border-b border-border">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {problem.title}
            </h1>
            <div className="flex items-center gap-4 flex-wrap">
              <div
                className={`px-3 py-1 rounded-full text-sm font-semibold border ${problem.difficulty === 'easy'
                  ? 'bg-green-500/10 text-green-600 border-green-500/20'
                  : problem.difficulty === 'medium'
                    ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                    : 'bg-red-500/10 text-red-600 border-red-500/20'
                  }`}
              >
                {t(`difficulty_${problem.difficulty}`)}
              </div>
              <div className="flex items-center gap-1 text-sm text-foreground/80 font-semibold">
                <Timer className="w-4 h-4" />
                {timeLimitSeconds}s time limit
              </div>
              <div className="flex items-center gap-1 text-sm text-foreground/80 font-semibold">
                <MemoryStick className="w-4 h-4" />
                {memoryLimitMB}MB memory
              </div>
              <div className="flex items-center gap-1 text-sm text-foreground/80 font-semibold">
                <FileText className="w-4 h-4" />
                {problem.maxScore} {t('points')}
              </div>
            </div>
          </div>

          {/* Problem Description */}
          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Mô tả bài toán
            </h2>
            {/* Added text-color classes here so Lexical content inherits them */}
            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
              <ReadOnlyEditor value={problem.description} />
            </div>
          </section>

          {/* Input Format */}
          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Đầu vào
            </h2>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
              <ReadOnlyEditor value={problem.inputDescription} />
            </div>
          </section>

          {/* Output Format */}
          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Đầu ra
            </h2>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
              <ReadOnlyEditor value={problem.outputDescription} />
            </div>
          </section>

          {/* Constraints */}
          {problem.timeLimitMs && problem.memoryLimitKb && (
            <section>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                Giới hạn
              </h2>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <p className="text-slate-700 dark:text-slate-300 font-semibold">
                  <span className="font-semibold">Thời gian</span>:{' '}
                  {timeLimitSeconds} <span className="font-semibold">s</span>
                </p>
                <p className="text-slate-700 dark:text-slate-300 font-semibold">
                  <span className="font-semibold">Bộ nhớ</span>: {memoryLimitMB}{' '}
                  <span className="font-semibold">MB</span>
                </p>
              </div>
            </section>
          )}

          {/* Sample Cases - compact view */}
          {sampleCases.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                Ví dụ
              </h2>

              {/* Case selector tabs */}
              <div className="flex items-center gap-2 mb-4 overflow-x-auto">
                {sampleCases.map((sample, index) => (
                  <button
                    key={`sample-tab-${sample.id ?? sample.input?.slice(0, 20) ?? index}`}
                    onClick={() => setActiveSampleIndex(index)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${activeSampleIndex === index
                      ? 'bg-slate-300 dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                  >
                    Case {index + 1}
                  </button>
                ))}
              </div>

              {/* Active sample content */}
              {activeSample && (
                <div className="space-y-4">
                  {/* Input */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Input
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => copyToClipboard(activeSample.input)}
                      >
                        <Copy className="w-3 h-3 mr-1" /> Copy
                      </Button>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                      <pre className="text-slate-800 dark:text-slate-200 font-mono text-sm whitespace-pre-wrap">
                        {activeSample.input || ''}
                      </pre>
                    </div>
                  </div>

                  {/* Output */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Output
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => copyToClipboard(activeSample.output)}
                      >
                        <Copy className="w-3 h-3 mr-1" /> Copy
                      </Button>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                      <pre className="text-slate-800 dark:text-slate-200 font-mono text-sm whitespace-pre-wrap">
                        {activeSample.output || ''}
                      </pre>
                    </div>
                  </div>

                  {/* Explanation */}
                  {activeSample.explanation && (
                    <div className="text-sm text-slate-600 dark:text-slate-400 italic">
                      {activeSample.explanation}
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {/* Topics & Tags */}
          <ProblemTopicsTags topics={problem.topics} tags={problem.tags} />

          {/* Discussion */}
          <ProblemDiscussion problemId={problem.id} />
        </div>
      </div>
    </div>
  );
}
