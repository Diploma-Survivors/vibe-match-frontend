import type { RootState } from '@/store';
import {
  updateCurrentSampleTestCases,
  updateSingleTestCase,
} from '@/store/slides/workspace-slice';
import type { ProblemDescription } from '@/types/problems';
import type { SampleTestcase } from '@/types/testcases';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

export function useTestCases(problem: ProblemDescription) {
  const dispatch = useDispatch();
  const [activeTestCase, setActiveTestCase] = useState(0);
  const savedTestCases = useSelector(
    (state: RootState) => state.workspace.currentSampleTestCases[problem.id]
  );
  const testCases: SampleTestcase[] =
    savedTestCases ?? problem.testcaseSamples ?? [];

  useEffect(() => {
    if (!savedTestCases && problem.testcaseSamples) {
      dispatch(
        updateCurrentSampleTestCases({
          problemId: problem.id,
          testCases: problem.testcaseSamples,
        })
      );
    }
  }, [dispatch, problem.id, problem.testcaseSamples, savedTestCases]);

  const handleTestCaseChange = useCallback(
    (id: string, field: 'input' | 'output', value: string) => {
      console.log('test case change', id, field, value);
      dispatch(
        updateSingleTestCase({
          problemId: problem.id,
          index: activeTestCase,
          field,
          value,
        })
      );
    },
    [dispatch, problem.id, activeTestCase]
  );

  const handleTestCaseAdd = useCallback(() => {
    const lastTestCase =
      testCases.length > 0 ? testCases[testCases.length - 1] : null;

    const newTestCase: SampleTestcase = {
      id: `testcase-${Date.now()}`,
      input: lastTestCase?.input ?? 'sample text',
      output: lastTestCase?.output ?? 'sample text',
    };

    const newSampleTestcases = [...testCases, newTestCase];

    dispatch(
      updateCurrentSampleTestCases({
        problemId: problem.id,
        testCases: newSampleTestcases,
      })
    );

    setActiveTestCase(newSampleTestcases.length - 1);
  }, [dispatch, problem.id, testCases]);

  const handleTestCaseDelete = useCallback(
    (id: string) => {
      const newSampleTestcases = testCases.filter(
        (testCase) => testCase.id !== id
      );
      dispatch(
        updateCurrentSampleTestCases({
          problemId: problem.id,
          testCases: newSampleTestcases,
        })
      );
      if (activeTestCase >= testCases.length - 1) {
        setActiveTestCase(Math.max(0, testCases.length - 2));
      }
    },
    [activeTestCase, testCases.length, dispatch, problem.id, testCases]
  );

  return {
    testCases,
    activeTestCase,
    setActiveTestCase,
    handleTestCaseChange,
    handleTestCaseAdd,
    handleTestCaseDelete,
  };
}
