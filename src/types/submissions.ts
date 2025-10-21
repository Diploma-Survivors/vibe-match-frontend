import { TestCase } from './testcases';

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
