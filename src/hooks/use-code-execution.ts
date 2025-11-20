import { type SSEResult, sseService } from '@/services/sse-service';
import { SubmissionsService } from '@/services/submissions-service';
import { selectContest } from '@/store/slides/contest-slice';
import type { SubmissionRequest } from '@/types/submissions';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

export function useCodeExecution() {
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState<SSEResult | null>(null);
  const [submitResults, setSubmitResults] = useState<SSEResult | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const sseConnectedRef = useRef(false);

  const contest = useSelector(selectContest);

  // Cleanup SSE connection on unmount
  useEffect(() => {
    return () => {
      if (sseConnectedRef.current) {
        sseService.disconnect();
        sseConnectedRef.current = false;
      }
    };
  }, []);

  const handleRun = useCallback(
    async (
      sourceCode: string,
      languageId: number,
      problemId: string,
      testCases: Array<{ input: string; output: string }>
    ) => {
      setIsRunning(true);
      setTestResults(null);
      setRunError(null);

      try {
        const submissionRequest: SubmissionRequest = {
          languageId,
          sourceCode,
          problemId,
          testCases,
        };

        const response = await SubmissionsService.run(submissionRequest);

        const submissionId = response.data.data.submissionId;

        if (submissionId) {
          // Establish SSE connection
          sseService.connect(
            submissionId,
            (result: SSEResult) => {
              setTestResults(result);
              setIsRunning(false);
              // Disconnect SSE after receiving result
              sseService.disconnect();
              sseConnectedRef.current = false;
            },
            (error) => {
              console.error('SSE error:', error);
              setRunError('Đã có lỗi xảy ra, vui lòng thử lại sau');
              setIsRunning(false);
            }
          );
          sseConnectedRef.current = true;
        } else {
          setRunError('Đã có lỗi xảy ra, vui lòng thử lại sau');
          setIsRunning(false);
        }
      } catch (error) {
        console.error('Error running code:', error);
        setRunError('Đã có lỗi xảy ra, vui lòng thử lại sau');
        setIsRunning(false);
      }
    },
    []
  );

  const handleSubmit = useCallback(
    async (
      sourceCode: string,
      languageId: number,
      problemId: string,
      contestId?: number
    ) => {
      setIsSubmitting(true);
      setSubmitResults(null);

      try {
        const submissionRequest: SubmissionRequest = {
          languageId,
          sourceCode,
          problemId,
          contestId,
          contestParticipationId: contestId
            ? contest.participation?.participationId
            : undefined,
        };
        const response = await SubmissionsService.submit(submissionRequest);
        const submissionId =
          response?.data?.data?.submissionId ?? response?.data?.submissionId;

        if (submissionId) {
          // Establish SSE connection for submit flow
          sseService.connect(
            submissionId,
            (result: SSEResult) => {
              setSubmitResults(result);
              console.log('Submit result received via SSE:', result);
              setIsSubmitting(false);
              sseService.disconnect();
              sseConnectedRef.current = false;
            },
            (error) => {
              console.error('SSE error (submit):', error);
              setIsSubmitting(false);
            }
          );
          sseConnectedRef.current = true;
        } else {
          setIsSubmitting(false);
        }
      } catch (error) {
        console.error('Error submitting code:', error);
        let errorMessage = 'Error: Failed to submit code. Please try again.';

        if (error instanceof Error) {
          errorMessage = `Error: ${error.message}`;
        } else if (
          typeof error === 'object' &&
          error !== null &&
          'response' in error
        ) {
          const axiosError = error as any;
          if (axiosError.response?.data?.message) {
            errorMessage = `Error: ${axiosError.response.data.message}`;
          } else if (axiosError.response?.status) {
            errorMessage = `Error: HTTP ${axiosError.response.status} - ${axiosError.response.statusText}`;
          }
        }
        setIsSubmitting(false);
      }
    },
    [contest.participation?.participationId]
  );

  return {
    isRunning,
    isSubmitting,
    testResults,
    submitResults,
    runError,
    handleRun,
    handleSubmit,
    clearSubmitResults: () => setSubmitResults(null),
  };
}
