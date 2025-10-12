import { useCallback, useState } from 'react';

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

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setOutput('Running...');

    // Simulate API call
    setTimeout(() => {
      setOutput(
        'Sample Input: 5\nSample Output: 1 1 2 3 5\n\nExecution time: 0.12s\nMemory used: 2.4 MB\n\n✅ Test passed!'
      );
      setIsRunning(false);
    }, 2000);
  }, []);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setOutput('Submitting...');

    // Simulate API call
    setTimeout(() => {
      const statusOptions: Array<
        'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error'
      > = ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error'];
      const randomStatus =
        statusOptions[Math.floor(Math.random() * statusOptions.length)];

      const newSubmission: Submission = {
        id: submissions.length + 1,
        timestamp: new Date().toLocaleString(),
        status: Math.random() > 0.3 ? 'Accepted' : randomStatus,
        runtime: `${(Math.random() * 2).toFixed(2)}s`,
        memory: `${(Math.random() * 50 + 10).toFixed(1)}MB`,
        score: Math.random() > 0.3 ? 100 : Math.floor(Math.random() * 60 + 20),
      };

      setSubmissions([newSubmission, ...submissions]);
      setOutput(
        `✅ Submission #${newSubmission.id} completed!\n\nStatus: ${
          newSubmission.status
        }\nRuntime: ${newSubmission.runtime}\nMemory: ${
          newSubmission.memory
        }\nScore: ${
          newSubmission.score
        }/100\n\nTest case 1: Passed (0.08s)\nTest case 2: Passed (0.12s)\nTest case 3: ${
          newSubmission.status === 'Accepted' ? 'Passed' : 'Failed'
        } (0.15s)`
      );
      setIsSubmitting(false);
    }, 3000);
  }, [submissions]);

  return {
    isRunning,
    isSubmitting,
    output,
    submissions,
    handleRun,
    handleSubmit,
  };
}
