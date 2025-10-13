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
  const [output, setOutput] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [testResults, setTestResults] = useState<SSEResult | null>(null);
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
      languageId: string,
      problemId: string,
      testCases: Array<{ input: string; output: string }>
    ) => {
      setIsRunning(true);
      setOutput('Running...');
      setTestResults(null);

      try {
        // Convert string languageId to number
        const submissionRequest: SubmissionRequest = {
          languageId: Number.parseInt(languageId, 10),
          sourceCode,
          problemId,
          testCases,
        };

        const response = await SubmissionsService.run(submissionRequest);

        const submissionId = response.data.data.submissionId;

        console.log('submissionId', submissionId);

        if (submissionId) {
          setOutput(
            `Submission created: ${response.data.submissionId}\nWaiting for results...`
          );

          // Establish SSE connection
          sseService.connect(
            submissionId,
            (result: SSEResult) => {
              console.log('SSE result received:', result);
              setTestResults(result);
              setOutput(
                `Test completed!\nStatus: ${result.status}\nScore: ${result.score}%\nPassed: ${result.passedTests}/${result.totalTests}`
              );
              setIsRunning(false);
              // Disconnect SSE after receiving result
              sseService.disconnect();
              sseConnectedRef.current = false;
            },
            (error) => {
              console.error('SSE error:', error);
              setOutput('Error: Failed to receive test results.');
              setIsRunning(false);
            }
          );
          sseConnectedRef.current = true;
        } else {
          setOutput('Error: Failed to create submission.');
          setIsRunning(false);
        }
      } catch (error) {
        console.error('Error running code:', error);
        let errorMessage = 'Error: Failed to run code. Please try again.';

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

        setOutput(errorMessage);
        setIsRunning(false);
      }
    },
    []
  );

  const handleSubmit = useCallback(
    async (
      sourceCode: string,
      languageId: string,
      problemId: string,
      testCases: Array<{ input: string; output: string }>
    ) => {
      setIsSubmitting(true);
      setOutput('Submitting...');

      try {
        const submissionRequest: SubmissionRequest = {
          languageId: Number.parseInt(languageId, 10),
          sourceCode,
          problemId,
          testCases,
        };

        const response = await SubmissionsService.run(submissionRequest);
        const submissionId = response.data.submissionId;

        if (submissionId) {
          setOutput(
            `Submission created: ${response.data.submissionId}\nWaiting for results...`
          );

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
          setOutput(
            `✅ Submission #${newSubmission.id} created!\n\nSubmission ID: ${response.data.submissionId}\nStatus: Pending`
          );
        } else {
          setOutput('Error: Failed to create submission.');
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

        setOutput(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [submissions]
  );

  return {
    isRunning,
    isSubmitting,
    output,
    submissions,
    testResults,
    handleRun,
    handleSubmit,
  };
}
