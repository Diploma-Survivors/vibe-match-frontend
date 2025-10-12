import type { ProblemDetail } from '@/types/problems';
import { ProblemDifficulty } from '@/types/problems';
import { FileText, MemoryStick, Timer } from 'lucide-react';
import { SampleTestCase } from '../sample-test-case';

interface ProblemDescriptionPanelProps {
  problem: ProblemDetail;
  width: number;
}

export function ProblemDescriptionPanel({
  problem,
  width,
}: ProblemDescriptionPanelProps) {
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

  return (
    <div className="overflow-y-auto pb-4" style={{ width: `${width}%` }}>
      <div className="pr-3 rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl">
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl">
          <div
            className="p-8 space-y-8"
            style={{ borderWidth: 1, borderRadius: 'inherit' }}
          >
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

            {/* Constraints */}
            {problem.timeLimitMs && problem.memoryLimitKb && (
              <section>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                  Giới hạn
                </h2>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <p className="text-slate-700 dark:text-slate-300">
                    • Thời gian: {timeLimitSeconds}s
                  </p>
                  <p className="text-slate-700 dark:text-slate-300">
                    • Bộ nhớ: {memoryLimitMB}MB
                  </p>
                </div>
              </section>
            )}

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

            {/* Sample Cases */}
            {sampleCases.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                  Ví dụ
                </h2>
                {sampleCases.map((testCase, index) => (
                  <SampleTestCase
                    key={`testcase-${index}-${testCase.input?.slice(0, 10) || index}`}
                    testCase={testCase}
                    index={index}
                  />
                ))}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
