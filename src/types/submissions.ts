import { TestCase } from './testcases';

/**
 * {
  "languageId": 71,
  "sourceCode": "console.log(\"Hello World\");",
  "problemId": "123e4567-e89b-12d3-a456-426614174000",
  "testCases": [
    {
      "input": "1 2",
      "output": "3"
    }
  ]
}
 */
export interface TestCaseSubmission {
  input: string;
  output: string;
}

export interface SubmissionRequest {
  languageId: number;
  sourceCode: string;
  problemId: string;
  testCases: TestCaseSubmission[];
}
