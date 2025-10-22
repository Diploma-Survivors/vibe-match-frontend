import { TestCase } from './testcases';

export enum SubmissionStatus {
  PENDING = 'Pending',
  RUNNING = 'Running',
  ACCEPTED = 'Accepted',
  WRONG_ANSWER = 'Wrong Answer',
  TIME_LIMIT_EXCEEDED = 'Time Limit Exceeded',
  SIGSEGV = 'SIGSEGV',
  SIGXFSZ = 'SIGXFSZ',
  SIGFPE = 'SIGFPE',
  SIGABRT = 'SIGABRT',
  NZEC = 'NZEC',
  RUNTIME_ERROR = 'Runtime Error',
  COMPILATION_ERROR = 'Compilation Error',
  UNKNOWN_ERROR = 'Unknown Error',
}

export interface Language {
  id: number;
  name: string;
}

export interface TestCaseSubmission {
  input: string;
  output: string;
}

export interface SubmissionRequest {
  languageId: number;
  sourceCode: string;
  problemId: string;
  testCases?: TestCaseSubmission[];
}
