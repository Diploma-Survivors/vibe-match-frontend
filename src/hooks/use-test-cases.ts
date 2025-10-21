import type { ProblemDescription } from '@/types/problems';
import { useCallback, useState } from 'react';

interface TestCase {
  id: string;
  input: string;
  output: string;
  isEditing: boolean;
}

export function useTestCases(problem: ProblemDescription) {
  const [activeTestCase, setActiveTestCase] = useState(0);

  // Initialize test cases from problem data
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

  return {
    testCases,
    activeTestCase,
    setActiveTestCase,
    handleTestCaseSave,
    handleTestCaseEdit,
    handleTestCaseChange,
    handleTestCaseAdd,
    handleTestCaseDelete,
  };
}
