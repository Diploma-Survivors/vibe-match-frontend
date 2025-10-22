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

export interface GetSubmissionListRequest {
  after?: string;
  before?: string;
  first?: number;
  last?: number;
  sortBy?: string;
  sortOrder?: string;
  matchMode?: string;
  filters?: {
    status?: SubmissionStatus;
    languageId?: number;
  };
}

export interface SubmissionListItem {
  id: number;
  language: Language;
  memory: number;
  note: string | null;
  runtime: number;
  score: number | null;
  status: SubmissionStatus;
  createdAt?: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
}

export interface SubmissionListResponse {
  edges: Array<{
    node: SubmissionListItem;
    cursor: string;
  }>;
  pageInfos: PageInfo;
  totalCount: number;
}
