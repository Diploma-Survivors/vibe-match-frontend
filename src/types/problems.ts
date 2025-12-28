import type { Tag } from './tags';
import type { SampleTestcase } from './testcases';
import type { Topic } from './topics';
import type { UserProfile } from './user';

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

export enum ProblemStatus {
  UNSOLVED = 'unsolved',
  ATTEMPTED = 'attempted',
  UN_ATTEMPTED = 'un_attempted',
  SOLVED = 'solved',
}

export interface ProblemDescription {
  id: string;
  title: string;
  description: string;
  inputDescription: string;
  outputDescription: string;
  maxScore: number;
  timeLimitMs: number;
  memoryLimitKb: number;
  difficulty: ProblemDifficulty | string;
  type?: string;
  createdAt?: string;
  updatedAt?: string;
  testcaseSamples?: SampleTestcase[];
  score?: number; // For contest problems
  status?: ProblemStatus;
  tags?: Tag[];
  topics?: Topic[];
}

export const INITIAL_PROBLEM: ProblemDescription = {
  id: '',
  title: '',
  description: '',
  inputDescription: '',
  outputDescription: '',
  maxScore: 0,
  timeLimitMs: 0,
  memoryLimitKb: 0,
  difficulty: ProblemDifficulty.EASY,
  type: ProblemType.STANDALONE,
  createdAt: '',
  updatedAt: '',
  testcaseSamples: [],
  score: 0,
  status: ProblemStatus.UNSOLVED,
  tags: [],
  topics: [],
};

export interface ProblemFilters {
  difficulty?: ProblemDifficulty;
  type?: ProblemType;
  topicIds?: number[];
  tagIds?: number[];
  status?: ProblemStatus;
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

export interface ProblemListItem {
  id: string;
  title: string;
  difficulty: ProblemDifficulty;
  tags: Tag[];
  topics: Topic[];
  status?: ProblemStatus;
  acceptanceRate?: number;
}

export interface ProblemEdge {
  node: ProblemListItem;
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

// UI helpers removed in favor of component-level i18n and design system tokens
export const DIFFICULTY_COLORS = {
  [ProblemDifficulty.EASY]: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
  [ProblemDifficulty.MEDIUM]: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
  [ProblemDifficulty.HARD]: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800',
};

export const getDifficultyColor = (difficulty: ProblemDifficulty | string) => {
  const normalized = (difficulty || '').toLowerCase() as ProblemDifficulty;
  return DIFFICULTY_COLORS[normalized] || 'bg-slate-100 text-slate-700 border-slate-200';
};

export interface ProblemComment {
  id: string;
  problemId: string;
  authorId: number;
  author?: UserProfile;
  content: string;
  upvoteCount: number;
  downvoteCount: number;
  myVote: 'up_vote' | 'down_vote' | null;
  parentCommentId: string | null;
  replyCounts: number;
  createdAt: string;
  updatedAt: string;
}

export enum ProblemCommentSortBy {
  RECENT = 'recent',
  MOST_VOTED = 'most_voted',
}
