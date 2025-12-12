import type { ProblemDescription } from '@/types/problems';
import { useCallback, useState } from 'react';
import { useCodeExecution } from './use-code-execution';
import { useResizable } from './use-resizable';
import { useTestCases } from './use-test-cases';

interface UseProblemDescriptionOptions {
  problem: ProblemDescription;
}

export function useProblemDescription({
  problem,
}: UseProblemDescriptionOptions) {
  // Use separate hooks for different concerns
  const resizable = useResizable();
  const testCases = useTestCases(problem);

  // Code execution hook
  const {
    isRunning,
    isSubmitting,
    testResults,
    submitResults,
    runError,
    handleRun: executeRun,
    handleSubmit: executeSubmit,
    clearSubmitResults,
  } = useCodeExecution();

  // Refetch key for consumers to re-query DB-backed testcase results
  const [refreshKey, setRefreshKey] = useState(0);

  // Run and Submit handlers that gather all required data
  const handleRun = useCallback(
    async (sourceCode: string, languageId: number) => {
      const testCasesForSubmission = testCases.testCases.map((tc) => ({
        input: tc.input,
        output: tc.output,
      }));

      await executeRun(
        sourceCode,
        languageId,
        problem.id,
        testCasesForSubmission
      );
      // trigger refetch consumers (e.g., testcase panel) after completion
      setRefreshKey((prev) => prev + 1);
    },
    [executeRun, testCases.testCases, problem.id]
  );

  const handleSubmit = useCallback(
    async (sourceCode: string, languageId: number, contestId?: number) => {
      const testCasesForSubmission = testCases.testCases.map((tc) => ({
        input: tc.input,
        output: tc.output,
      }));

      await executeSubmit(sourceCode, languageId, problem.id, contestId);
      setRefreshKey((prev) => prev + 1);
    },
    [executeSubmit, testCases.testCases, problem.id]
  );

  return {
    // Refs from resizable hook
    containerRef: resizable.containerRef,
    rightPanelRef: resizable.rightPanelRef,

    // Layout state from resizable hook
    leftWidth: resizable.leftWidth,
    editorHeight: resizable.editorHeight,
    isHorizontalDragging: resizable.isHorizontalDragging,
    isVerticalDragging: resizable.isVerticalDragging,

    // Test cases state from test cases hook
    testCases: testCases.testCases,
    activeTestCase: testCases.activeTestCase,
    setActiveTestCase: testCases.setActiveTestCase,

    // Code execution state
    isRunning,
    isSubmitting,
    testResults,
    submitResults,
    runError,
    refreshKey,

    // Handlers
    handleHorizontalMouseDown: resizable.handleHorizontalMouseDown,
    handleVerticalMouseDown: resizable.handleVerticalMouseDown,
    handleRun,
    handleSubmit,
    handleTestCaseChange: testCases.handleTestCaseChange,
    handleTestCaseAdd: testCases.handleTestCaseAdd,
    handleTestCaseDelete: testCases.handleTestCaseDelete,

    // Props
    problem,
    clearSubmitResults,
  };
}
