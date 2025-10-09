import type { Tag } from './tags';
import type { TestcaseSample } from './testcases';
import type { Topic } from './topics';

export enum ProblemDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum SortBy {
  CREATED_AT = 'createdAt',
  TITLE = 'title',
  DIFFICULTY = 'difficulty',
  MAX_SCORE = 'maxScore',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum MatchMode {
  ANY = 'any',
  ALL = 'all',
}

export enum ProblemType {
  STANDALONE = 'standalone',
  CONTEST = 'contest',
  HYBRID = 'hybrid',
}

export interface CreateProblemRequest {
  title: string;
  description: string;
  inputDescription: string;
  outputDescription: string;
  maxScore: number;
  timeLimitMs: number;
  memoryLimitKb: number;
  difficulty: ProblemDifficulty;
  type: ProblemType;
  tagIds: string[];
  topicIds: string[];
  testcaseId: string;
  testcaseSamples: TestcaseSample[];
}

export interface ProblemDetail {
  id: string;
  title: string;
  description: string;
  inputDescription: string;
  outputDescription: string;
  maxScore: number;
  timeLimitMs: number;
  memoryLimitKb: number;
  difficulty: ProblemDifficulty;
  type?: string;
  createdAt?: string;
  updatedAt?: string;
  tags: string[];
  topic: string;
  testcase: string;
  testcaseSamples: TestcaseSample[];
  score?: number; // For use in contests or assignments
}

export interface ProblemFilters {
  difficulty?: ProblemDifficulty;
  type?: ProblemType;
  topic?: string;
  tags?: string[];
}

export interface GetProblemListRequest {
  keyword?: string;
  after?: string;
  before?: string;
  first?: number;
  last?: number;
  sortOrder?: SortOrder;
  matchMode?: MatchMode;
  sortBy?: SortBy;
  filters?: ProblemFilters;
}

export interface ProblemItemList {
  id: string;
  title: string;
  difficulty: ProblemDifficulty;
  createAt: string;
  tags: Tag[];
  topics: Topic[];
}

export interface ProblemEdge {
  node: ProblemItemList;
  cursor: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
}

export interface ProblemListResponse {
  edges: ProblemEdge[];
  pageInfos: PageInfo;
  totalCount: number;
}

export const DIFFICULTY_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'easy', label: 'Dễ' },
  { value: 'medium', label: 'Trung bình' },
  { value: 'hard', label: 'Khó' },
];

export const TAG_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'easy', label: 'Dễ' },
  { value: 'medium', label: 'Trung bình' },
  { value: 'hard', label: 'Khó' },
];

// Remove TOPIC_OPTIONS and TAG_OPTIONS as they will be fetched from backend
// Keep ACCESS_RANGE_OPTIONS for potential future use
export const ACCESS_RANGE_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
];

export enum ProblemEndpointType {
  SELECTABLE_FOR_CONTEST = 'selectable-for-contest',
  SELECTABLE_FOR_ASSIGNMENT = 'selectable-for-assignment',
  TRAINING = 'training',
}

export const DIFFICULTY_LABELS = new Map([
  [ProblemDifficulty.EASY, 'Dễ'],
  [ProblemDifficulty.MEDIUM, 'Trung bình'],
  [ProblemDifficulty.HARD, 'Khó'],
]);

export const DIFFICULTY_COLORS = new Map([
  [ProblemDifficulty.EASY, 'bg-green-100 text-green-800 hover:bg-green-200'],
  [
    ProblemDifficulty.MEDIUM,
    'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  ],
  [ProblemDifficulty.HARD, 'bg-red-100 text-red-800 hover:bg-red-200'],
]);

export const DEFAULT_DIFFICULTY_COLOR =
  'bg-gray-100 text-gray-800 hover:bg-gray-200';

export const getDifficultyColor = (difficulty: ProblemDifficulty): string => {
  return DIFFICULTY_COLORS.get(difficulty) || DEFAULT_DIFFICULTY_COLOR;
};

export const getDifficultyLabel = (difficulty: ProblemDifficulty): string => {
  return DIFFICULTY_LABELS.get(difficulty) || difficulty;
};
