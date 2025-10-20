export interface SSEResult {
  status: string;
  totalTests: number;
  passedTests: number;
  score: number;
  runtime: string;
  memory: number;
  results?: Array<{
    stdout: string;
    stderr?: string;
    time: string;
    memory: number;
    token: string;
    status: string;
    expectedOutput?: string;
  }>;
  resultDescription?: {
    message: string;
    input: string;
    expectedOutput: string;
    actualOutput: string;
  };
}

export class SSEService {
  private eventSource: EventSource | null = null;
  private timeoutId: NodeJS.Timeout | null = null;

  connect(
    submissionId: string,
    onResult: (result: SSEResult) => void,
    onError?: (error: Event) => void
  ): void {
    // Close existing connection if any
    this.disconnect();

    const url = `http://localhost:3000/v1/submissions/${submissionId}/stream`;
    this.eventSource = new EventSource(url);

    this.eventSource.onopen = () => {
      console.log('SSE connection opened');
    };

    this.eventSource.addEventListener('result', (event) => {
      try {
        console.log('SSE result event received:', event.data);
        const result: SSEResult = JSON.parse(event.data);
        console.log('Parsed SSE result:', result);

        // Clear timeout since we got a result
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
          this.timeoutId = null;
        }

        onResult(result);
      } catch (error) {
        console.error('Error parsing SSE result:', error);
        onError?.(error as Event);
      }
    });

    this.eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      onError?.(error);
    };

    // Set a timeout to close the connection after 30 seconds
    this.timeoutId = setTimeout(() => {
      console.log('SSE timeout - closing connection');
      this.disconnect();
    }, 30000);
  }

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}

export const sseService = new SSEService();
