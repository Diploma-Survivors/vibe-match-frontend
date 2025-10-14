import { type SSEResult, sseService } from '@/services/sse-service';
import { SubmissionsService } from '@/services/submissions-service';
import type { SubmissionRequest } from '@/types/submissions';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Submission {
  id: number;
  timestamp: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error';
  runtime: string;
  memory: string;
  score: number;
}

export function useCodeExecution() {
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [testResults, setTestResults] = useState<SSEResult | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const sseConnectedRef = useRef(false);

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

        console.log('submissionId', submissionId);

        if (submissionId) {
          // Establish SSE connection
          sseService.connect(
            submissionId,
            (result: SSEResult) => {
              console.log('SSE result received:', result);
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
      testCases: Array<{ input: string; output: string }>
    ) => {
      setIsSubmitting(true);

      try {
        const submissionRequest: SubmissionRequest = {
          languageId,
          sourceCode,
          problemId,
          testCases,
        };

        const response = await SubmissionsService.run(submissionRequest);
        const submissionId = response.data.submissionId;

        if (submissionId) {
          // For submit, we might want to handle it differently than run
          // For now, just show the submission ID
          const newSubmission: Submission = {
            id: submissions.length + 1,
            timestamp: new Date().toLocaleString(),
            status: 'Accepted', // Default status
            runtime: '0.00s',
            memory: '0.0MB',
            score: 100,
          };

          setSubmissions([newSubmission, ...submissions]);
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
      } finally {
        setIsSubmitting(false);
      }
    },
    [submissions]
  );

  return {
    isRunning,
    isSubmitting,
    submissions,
    testResults,
    runError,
    handleRun,
    handleSubmit,
  };
}
