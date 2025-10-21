import { TestCase } from './testcases';

export enum SubmissionStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  ACCEPTED = 'ACCEPTED',
  WRONG_ANSWER = 'WRONG_ANSWER',
  TIME_LIMIT_EXCEEDED = 'TIME_LIMIT_EXCEEDED',
  SIGSEGV = 'SIGSEGV',
  SIGXFSZ = 'SIGXFSZ',
  SIGFPE = 'SIGFPE',
  SIGABRT = 'SIGABRT',
  NZEC = 'NZEC',
  RUNTIME_ERROR = 'RUNTIME_ERROR',
  COMPILATION_ERROR = 'COMPILATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
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
