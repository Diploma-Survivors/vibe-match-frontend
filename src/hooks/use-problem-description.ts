import { SubmissionsService } from '@/services/submissions-service';
import type { ProblemDetail } from '@/types/problems';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { useCodeExecution } from './use-code-execution';

interface TestCase {
  id: string;
  input: string;
  output: string;
  isEditing: boolean;
}

interface UseProblemDescriptionOptions {
  problem: ProblemDetail;
  showContestInfo?: boolean;
  contestName?: string;
  contestTimeRemaining?: string;
}

export function useProblemDescription({
  problem,
  showContestInfo = false,
  contestName,
  contestTimeRemaining,
}: UseProblemDescriptionOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  // Resizable state
  const [leftWidth, setLeftWidth] = useState(50);
  const [editorHeight, setEditorHeight] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isVerticalDragging, setIsVerticalDragging] = useState(false);

  // Test cases state
  const [activeTestCase, setActiveTestCase] = useState(0);
  const [testCases, setTestCases] = useState<TestCase[]>(() => {
    if (problem.testcaseSamples && problem.testcaseSamples.length > 0) {
      return problem.testcaseSamples.map((tc, index) => ({
        id: tc.id || `testcase-${index}`,
        input: tc.input || '',
        output: tc.output || '',
        isEditing: false,
      }));
    }
    return [
      {
        id: 'default-1',
        input: '',
        output: '',
        isEditing: true,
      },
    ];
  });

  // Code execution hook
  const {
    isRunning,
    isSubmitting,
    output,
    testResults,
    handleRun: executeRun,
    handleSubmit: executeSubmit,
  } = useCodeExecution();

  // Refetch key for consumers to re-query DB-backed testcase results
  const [refreshKey, setRefreshKey] = useState(0);

  // Resizable handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleVerticalMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsVerticalDragging(true);
  }, []);

  const handleHorizontalMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const mouseX = e.clientX - containerRect.left;
      const newSize = (mouseX / containerWidth) * 100;
      const constrainedSize = Math.min(Math.max(newSize, 30), 80);
      setLeftWidth(constrainedSize);
    },
    [isDragging]
  );

  const handleVerticalMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isVerticalDragging || !rightPanelRef.current) return;

      const containerRect = rightPanelRef.current.getBoundingClientRect();
      const containerHeight = containerRect.height;
      const mouseY = e.clientY - containerRect.top;
      const newSize = (mouseY / containerHeight) * 100;
      const constrainedSize = Math.min(Math.max(newSize, 30), 80);
      setEditorHeight(constrainedSize);
    },
    [isVerticalDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsVerticalDragging(false);
  }, []);

  // Test case handlers
  const handleTestCaseSave = useCallback((id: string) => {
    setTestCases((prev) =>
      prev.map((testCase) =>
        testCase.id === id ? { ...testCase, isEditing: false } : testCase
      )
    );
  }, []);

  const handleTestCaseEdit = useCallback((id: string) => {
    setTestCases((prev) =>
      prev.map((testCase) =>
        testCase.id === id
          ? { ...testCase, isEditing: !testCase.isEditing }
          : testCase
      )
    );
  }, []);

  const handleTestCaseChange = useCallback(
    (id: string, field: 'input' | 'output', value: string) => {
      setTestCases((prev) =>
        prev.map((testCase) =>
          testCase.id === id ? { ...testCase, [field]: value } : testCase
        )
      );
    },
    []
  );

  const handleTestCaseAdd = useCallback(() => {
    const newTestCase: TestCase = {
      id: `testcase-${Date.now()}`,
      input: '',
      output: '',
      isEditing: true,
    };
    setTestCases((prev) => [...prev, newTestCase]);
    setActiveTestCase(testCases.length);
  }, [testCases.length]);

  const handleTestCaseDelete = useCallback(
    (id: string) => {
      setTestCases((prev) => prev.filter((testCase) => testCase.id !== id));
      if (activeTestCase >= testCases.length - 1) {
        setActiveTestCase(Math.max(0, testCases.length - 2));
      }
    },
    [activeTestCase, testCases.length]
  );

  // Run and Submit handlers that gather all required data
  const handleRun = useCallback(
    async (sourceCode: string, languageId: string) => {
      const testCasesForSubmission = testCases.map((tc) => ({
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
    [executeRun, testCases, problem.id]
  );

  const handleSubmit = useCallback(
    async (sourceCode: string, languageId: string) => {
      const testCasesForSubmission = testCases.map((tc) => ({
        input: tc.input,
        output: tc.output,
      }));

      await executeSubmit(
        sourceCode,
        languageId,
        problem.id,
        testCasesForSubmission
      );
      setRefreshKey((prev) => prev + 1);
    },
    [executeSubmit, testCases, problem.id]
  );

  // Add global mouse event listeners
  useEffect(() => {
    const handleMouseMoveHorizontal = (e: MouseEvent) => {
      handleHorizontalMouseMove(e);
    };

    const handleMouseMoveVertical = (e: MouseEvent) => {
      handleVerticalMouseMove(e);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMoveHorizontal);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    if (isVerticalDragging) {
      document.addEventListener('mousemove', handleMouseMoveVertical);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'row-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMoveHorizontal);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMoveVertical);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [
    isDragging,
    isVerticalDragging,
    handleHorizontalMouseMove,
    handleMouseUp,
    handleVerticalMouseMove,
  ]);

  return {
    // Refs
    containerRef,
    rightPanelRef,

    // Layout state
    leftWidth,
    editorHeight,
    isDragging,
    isVerticalDragging,

    // Test cases state
    testCases,
    activeTestCase,
    setActiveTestCase,

    // Code execution state
    isRunning,
    isSubmitting,
    output,
    testResults,
    refreshKey,

    // Handlers
    handleMouseDown,
    handleVerticalMouseDown,
    handleRun,
    handleSubmit,
    handleTestCaseSave,
    handleTestCaseEdit,
    handleTestCaseChange,
    handleTestCaseAdd,
    handleTestCaseDelete,

    // Props
    problem,
    showContestInfo,
    contestName,
    contestTimeRemaining,
  };
}
