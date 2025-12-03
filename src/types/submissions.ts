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
  contestId?: number;
  contestParticipationId?: number;
  testCases?: TestCaseSubmission[];
}

export interface SubmissionFilters {
  status?: SubmissionStatus;
  languageId?: number;
}

export interface GetSubmissionListRequest {
  after?: string;
  before?: string;
  first?: number;
  last?: number;
  sortBy?: string;
  sortOrder?: string;
  matchMode?: string;
  filters?: SubmissionFilters;
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

export interface SubmissionEdge {
  node: SubmissionListItem;
  cursor: string;
}

export interface SubmissionListResponse {
  edges: SubmissionEdge[];
  pageInfos: PageInfo;
  totalCount: number;
}

export interface SubmissionDetailData {
  id: number;
  status: string;
  score: number;
  runtime: number;
  memory: number;
  sourceCode: string;
  createdAt: string;
  totalTests: number;
  passedTests: number;
  language: Language;
  resultDescription: {
    message: string;
  };
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

// Map language names to Highlight.js language keys
export const languageMap: Record<string, string> = {
  'C++': 'cpp',
  Python: 'python',
  Java: 'java',
  JavaScript: 'javascript',
  TypeScript: 'typescript',
  'C#': 'csharp',
  Go: 'go',
  Rust: 'rust',
};

type LanguageConfig = {
  monacoId: string;
  keywords: string[];
  exclude?: string[];
};

export const LANGUAGE_DEFINITIONS: LanguageConfig[] = [
  // --- Popular Web & Scripting ---
  {
    monacoId: 'python',
    keywords: ['python', 'py', 'pypy'],
  },
  {
    monacoId: 'javascript',
    keywords: ['javascript', 'js', 'node'],
  },
  {
    monacoId: 'typescript',
    keywords: ['typescript', 'ts'],
  },
  {
    monacoId: 'php',
    keywords: ['php'],
  },
  {
    monacoId: 'ruby',
    keywords: ['ruby'],
  },
  {
    monacoId: 'perl',
    keywords: ['perl'],
  },
  {
    monacoId: 'lua',
    keywords: ['lua'],
  },
  {
    monacoId: 'shell',
    keywords: ['bash', 'sh', 'shell'],
  },
  {
    monacoId: 'r',
    keywords: ['r ('], // Matches "R (4.0.0)"
    exclude: ['ruby', 'rust', 'perl'],
  },

  // --- C-Family & Systems ---
  {
    monacoId: 'cpp',
    keywords: ['c++', 'cpp', 'g++', 'clang'], // Matches "C++ (GCC...)"
  },
  {
    monacoId: 'c',
    keywords: ['c (', 'gcc', 'clang'], // Matches "C (GCC...)"
    // Critical: Exclude variants to prevent matching C++, C#, or Objective-C
    exclude: ['c++', 'cpp', 'c#', 'objective', 'g++'],
  },
  {
    monacoId: 'csharp',
    keywords: ['c#', 'mono', 'dotnet', '.net'],
  },
  {
    monacoId: 'objective-c',
    keywords: ['objective-c', 'objc'],
  },
  {
    monacoId: 'java',
    keywords: ['java', 'openjdk'],
    exclude: ['javascript'],
  },
  {
    monacoId: 'kotlin',
    keywords: ['kotlin'],
  },
  {
    monacoId: 'swift',
    keywords: ['swift'],
  },
  {
    monacoId: 'go',
    keywords: ['go', 'golang'],
  },
  {
    monacoId: 'rust',
    keywords: ['rust'],
  },

  // --- Functional & Enterprise ---
  {
    monacoId: 'scala',
    keywords: ['scala'],
  },
  {
    monacoId: 'clojure',
    keywords: ['clojure'],
  },
  {
    monacoId: 'fsharp',
    keywords: ['f#'],
  },
  {
    monacoId: 'sql',
    keywords: ['sql', 'sqlite'],
  },
  {
    monacoId: 'vb',
    keywords: ['visual basic', 'vb.net', 'basic (fbc'], // Covers "Basic (FBC...)" and "Visual Basic.Net"
  },
  {
    monacoId: 'pascal',
    keywords: ['pascal'],
  },

  // --- Mappings for languages not standard in Monaco (Fallbacks) ---
  // Using 'plaintext' for safety, or similar syntaxes where applicable
  {
    monacoId: 'plaintext',
    keywords: [
      'assembly',
      'executable',
      'plain text',
      'multi-file',
      'cobol',
      'fortran',
      'haskell',
      'ocaml',
      'prolog',
      'octave',
      'd (dmd',
      'erlang',
    ],
  },

  // Optional: Heuristic mappings (If you prefer partial highlighting over plain text)
  // { monacoId: 'java', keywords: ['groovy'] }, // Groovy looks like Java
  // { monacoId: 'elixir', keywords: ['elixir'] }, // Supported in newer Monaco versions
  {
    monacoId: 'plaintext',
    keywords: ['groovy', 'elixir', 'common lisp'],
  },
];
