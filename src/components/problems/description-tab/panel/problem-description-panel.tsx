import { Button } from '@/components/ui/button';
import type { ProblemDetail } from '@/types/problems';
import { ProblemDifficulty } from '@/types/problems';
import { FileText, MemoryStick, Timer } from 'lucide-react';
import { Copy } from 'lucide-react';
import { useState } from 'react';

interface ProblemDescriptionPanelProps {
  problem: ProblemDetail;
  width: number;
}

export function ProblemDescriptionPanel({
  problem,
  width,
}: ProblemDescriptionPanelProps) {
  const [activeSampleIndex, setActiveSampleIndex] = useState(0);

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case ProblemDifficulty.EASY:
        return 'Dễ';
      case ProblemDifficulty.MEDIUM:
        return 'Trung bình';
      case ProblemDifficulty.HARD:
        return 'Khó';
      default:
        return difficulty;
    }
  };

  const timeLimitSeconds = (problem.timeLimitMs / 1000).toFixed(1);
  const memoryLimitMB = (problem.memoryLimitKb / 1024).toFixed(0);
  const sampleCases = problem.testcaseSamples || [];
  const activeSample = sampleCases[activeSampleIndex];

  const copyToClipboard = (text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="overflow-y-auto h-full pb-4" style={{ width: `${width}%` }}>
      <div className="pr-3">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="p-8 space-y-8">
            {/* Problem Title Header */}
            <div className="pb-6 border-b border-slate-200 dark:border-slate-700">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-4">
                {problem.title}
              </h1>
              <div className="flex items-center gap-4 flex-wrap">
                <div
                  className={`px-3 py-1 rounded-full text-sm font-semibold shadow-md ${
                    problem.difficulty === 'easy'
                      ? 'bg-gradient-to-r from-green-400 to-green-500 text-white'
                      : problem.difficulty === 'medium'
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                        : 'bg-gradient-to-r from-red-400 to-red-500 text-white'
                  }`}
                >
                  {getDifficultyLabel(problem.difficulty)}
                </div>
                <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                  <Timer className="w-4 h-4" />
                  {timeLimitSeconds}s time limit
                </div>
                <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                  <MemoryStick className="w-4 h-4" />
                  {memoryLimitMB}MB memory
                </div>
                <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                  <FileText className="w-4 h-4" />
                  {problem.maxScore} điểm
                </div>
              </div>
            </div>

            {/* Problem Description */}
            <section>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                Mô tả bài toán
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {problem.description}
                </p>
              </div>
            </section>

            {/* Input Format */}
            <section>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                Đầu vào
              </h2>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                  {problem.inputDescription}
                </p>
              </div>
            </section>

            {/* Output Format */}
            <section>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                Đầu ra
              </h2>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                  {problem.outputDescription}
                </p>
              </div>
            </section>

            {/* Constraints */}
            {problem.timeLimitMs && problem.memoryLimitKb && (
              <section>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                  Giới hạn
                </h2>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <p className="text-slate-700 dark:text-slate-300">
                    <span className="font-semibold">Thời gian</span>:{' '}
                    {timeLimitSeconds} <span className="font-semibold">s</span>
                  </p>
                  <p className="text-slate-700 dark:text-slate-300">
                    <span className="font-semibold">Bộ nhớ</span>:{' '}
                    {memoryLimitMB} <span className="font-semibold">MB</span>
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
                      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                        activeSampleIndex === index
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
          </div>
        </div>
      </div>
    </div>
  );
}
