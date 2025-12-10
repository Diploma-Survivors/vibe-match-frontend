import ReadOnlyEditor from '@/components/lexical-editor/lexical-editor';
import { Button } from '@/components/ui/button';
import { toastService } from '@/services/toasts-service';
import type { ProblemDescription } from '@/types/problems';
import { ProblemDifficulty } from '@/types/problems';
import type { TestcaseSample } from '@/types/testcases';
import { motion } from 'framer-motion';
import { Copy, FileText, MemoryStick, Timer } from 'lucide-react';
import { useState } from 'react';

interface DescriptionPanelProps {
  problem: ProblemDescription;
  width: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function DescriptionPanel({ problem, width }: DescriptionPanelProps) {
  const sampleCases: TestcaseSample[] = problem.testcaseSamples || [];
  const [activeSampleIndex, setActiveSampleIndex] = useState(0);

  const getDifficultyLabel = (difficulty: string): string => {
    switch (difficulty) {
      case ProblemDifficulty.EASY:
        return 'Easy';
      case ProblemDifficulty.MEDIUM:
        return 'Medium';
      case ProblemDifficulty.HARD:
        return 'Hard';
      default:
        return difficulty;
    }
  };

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
    <div className="h-full" style={{ width: `${width}%` }}>
      <div className="h-full rounded-lg border border-slate-200 dark:[border-slate-700] bg-gray-50 dark:bg-slate-800 overflow-hidden flex flex-col">
        <motion.div
          className="h-full overflow-y-auto p-5 space-y-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Problem Title Header */}
          <motion.div
            variants={itemVariants}
            className="pb-6 border-b border-slate-200 dark:border-slate-700"
          >
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {problem.title}
            </h1>
            <div className="flex items-center gap-4 flex-wrap">
              <div
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide border ${
                  problem.difficulty === 'easy'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                    : problem.difficulty === 'medium'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20'
                      : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20'
                }`}
              >
                {getDifficultyLabel(problem.difficulty)}
              </div>
              <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 font-semibold">
                <Timer className="w-4 h-4" />
                {timeLimitSeconds}s time limit
              </div>
              <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 font-semibold">
                <MemoryStick className="w-4 h-4" />
                {memoryLimitMB}MB memory
              </div>
              <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 font-semibold">
                <FileText className="w-4 h-4" />
                {problem.maxScore} điểm
              </div>
            </div>
          </motion.div>

          {/* Problem Description */}
          <motion.section variants={itemVariants}>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Mô tả bài toán
            </h2>
            {/* Added text-color classes here so Lexical content inherits them */}
            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
              <ReadOnlyEditor value={problem.description} />
            </div>
          </motion.section>

          {/* Input Format */}
          <motion.section variants={itemVariants}>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Đầu vào
            </h2>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
              <ReadOnlyEditor value={problem.inputDescription} />
            </div>
          </motion.section>

          {/* Output Format */}
          <motion.section variants={itemVariants}>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Đầu ra
            </h2>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
              <ReadOnlyEditor value={problem.outputDescription} />
            </div>
          </motion.section>

          {/* Constraints */}
          {problem.timeLimitMs && problem.memoryLimitKb && (
            <motion.section variants={itemVariants}>
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
            </motion.section>
          )}

          {/* Sample Cases - compact view */}
          {sampleCases.length > 0 && (
            <motion.section variants={itemVariants}>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                Ví dụ
              </h2>

              {/* Case selector tabs */}
              <div className="flex items-center gap-2 mb-4 overflow-x-auto">
                {sampleCases.map((sample, index) => (
                  <button
                    key={`sample-tab-${
                      sample.id ?? sample.input?.slice(0, 20) ?? index
                    }`}
                    onClick={() => setActiveSampleIndex(index)}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                      activeSampleIndex === index
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {activeSampleIndex === index ? (
                      <motion.div
                        layoutId="activeSampleTab"
                        className="absolute inset-0 bg-slate-200 dark:bg-slate-600 rounded-lg"
                        transition={{
                          type: 'spring',
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-slate-100 dark:bg-slate-700/50 rounded-lg -z-10" />
                    )}
                    <span className="relative z-10">Case {index + 1}</span>
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
            </motion.section>
          )}
        </motion.div>
      </div>
    </div>
  );
}
