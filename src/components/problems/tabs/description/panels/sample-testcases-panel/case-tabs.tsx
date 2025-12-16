import { getStatusMeta } from '@/lib/utils/testcase-status';
import type { SSEResult } from '@/services/sse-service';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';

type ActiveTab = 'testcase' | 'result';

interface CaseTabsProps {
  activeTab: ActiveTab;
  hasResults: boolean;
  testCases: Array<{ id: string }>;
  activeTestCase: number;
  testResults?: SSEResult | null;
  onActiveTestCaseChange: (index: number) => void;
  onTestCaseDelete: (id: string) => void;
  onTestCaseAdd: () => void;
}

export function CaseTabs({
  activeTab,
  hasResults,
  testCases,
  activeTestCase,
  testResults,
  onActiveTestCaseChange,
  onTestCaseDelete,
  onTestCaseAdd,
}: CaseTabsProps) {
  return (
    <div className="flex items-center gap-2 mb-6 overflow-x-auto p-1">
      <AnimatePresence initial={false} mode="popLayout">
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
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              key={testCase.id}
              className="relative group hover:bg-primary/10 border border-slate-400 dark:border-slate-600 rounded-lg"
            >
              <button
                onClick={() => onActiveTestCaseChange(index)}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-200 flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  activeTestCase === index
                    ? 'text-primary'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {activeTestCase === index ? (
                  <motion.div
                    layoutId="activeTestCaseTab"
                    className="absolute inset-0 bg-primary rounded-lg -z-10 shadow-sm"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-primary/10 rounded-lg -z-10" />
                )}

                {/* Show status icon for result tab */}
                {activeTab === 'result' && statusInfo ? (
                  <span className={statusInfo.iconColor}>
                    {statusInfo.icon}
                  </span>
                ) : null}
                <span className="relative z-10">Case {index + 1}</span>
              </button>

              {activeTab === 'testcase' && testCases.length > 1 && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTestCaseDelete(testCase.id);
                  }}
                  className="absolute -top-1.5 -right-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-full p-0.5 shadow-sm z-20"
                  aria-label="Delete testcase"
                >
                  <X className="w-3 h-3 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400" />
                </motion.button>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {activeTab === 'testcase' && (
        <motion.button
          layout
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onTestCaseAdd}
          className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200 flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Add</span>
        </motion.button>
      )}
    </div>
  );
}
