import { CheckCircle, FileText } from 'lucide-react';
import { JSX } from 'react';
import type { ProblemDifficulty } from './problems';

export enum SortBy {
  NAME = 'name',
  START_TIME = 'startTime',
  END_TIME = 'endTime',
  CREATED_AT = 'createdAt',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum MatchMode {
  ANY = 'any',
  ALL = 'all',
}

export enum ContestProblemStatus {
  UN_ATTEMPTED = 'UNATTEMPTED',
  UNSOLVED = 'UNSOLVED',
  SOLVED = 'SOLVED',
}

// Contest Detail types
export interface ContestProblem {
  id: string;
  title: string;
  maxScore: number;
  userScore?: number;
  status: ContestProblemStatus;
  difficulty: ProblemDifficulty;
  memoryLimitKb: number;
  timeLimitMs: number;
}

export enum ContestDeadlineEnforcement {
  STRICT = 'strict',
  FLEXIBLE = 'flexible',
}

export enum ContestSubmissionStrategy {
  SINGLE_SUBMISSION = 'SINGLE_SUBMISSION',
  BEST_SCORE = 'BEST_SCORE',
  LATEST_SCORE = 'LATEST_SCORE',
  AVERAGE_SCORE = 'AVERAGE_SCORE',
}

export interface ContestParticipation {
  participationId?: number;
  startTime?: string;
  endTime?: string;
  finishedAt?: string;
  finalScore?: number;
}

export interface Contest {
  id?: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  isHasDurationMinutes?: boolean;
  durationMinutes?: number;
  lateDeadline?: string;
  deadlineEnforcement: ContestDeadlineEnforcement;
  submissionStrategy: ContestSubmissionStrategy;
  problems: ContestProblem[];
  createdBy?: string;
  createdAt?: string;
  participation?: ContestParticipation;
}

export const INITIAL_CONTEST: Contest = {
  name: '',
  description: '',
  startTime: '',
  endTime: '',
  deadlineEnforcement: ContestDeadlineEnforcement.STRICT,
  submissionStrategy: ContestSubmissionStrategy.SINGLE_SUBMISSION,
  problems: [],
};

export interface ContestOverView {
  id?: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  durationMinutes?: number;
  lateDeadline?: string;
  deadlineEnforcement: ContestDeadlineEnforcement;
  submissionStrategy: ContestSubmissionStrategy;
  totalProblems: number;
  participationCount: number;
  hasParticipated: boolean;
  author?: User;
  createdBy?: string;
  createdAt?: string;
}

// Filter types
export interface ContestFilters {
  startTime?: string;
  endTime?: string;
  minDurationMinutes?: number;
  maxDurationMinutes?: number;
}

// Request types
export interface ContestListRequest {
  keyword?: string;
  after?: string;
  before?: string;
  first?: number;
  last?: number;
  sortOrder?: SortOrder;
  matchMode?: MatchMode;
  sortBy?: SortBy;
  filters?: ContestFilters;
}

// Response types
export interface ContestListItem {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  status: string;
}

export interface ContestEdge {
  cursor: string;
  node: ContestListItem;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
}

export interface ContestListResponse {
  edges: ContestEdge[];
  pageInfos: PageInfo;
  totalCount: number;
}

export enum ContestStatus {
  NOT_STARTED = 'not_started', // chưa bắt đầu
  ONGOING = 'ongoing', // đang diễn ra
  FINISHED = 'finished', // đã kết thúc
  IN_PROGRESS = 'in_progress', // đang làm
  COMPLETED = 'completed', // đã hoàn thành
  LATE_SUBMISSION = 'late_submission', // Trong thời gian gia hạn
}

export const ContestStatusLabels: Record<ContestStatus, string> = {
  [ContestStatus.NOT_STARTED]: 'Chưa bắt đầu',
  [ContestStatus.ONGOING]: 'Đang diễn ra',
  [ContestStatus.FINISHED]: 'Đã kết thúc',
  [ContestStatus.IN_PROGRESS]: 'Đang làm',
  [ContestStatus.COMPLETED]: 'Đã hoàn thành',
  [ContestStatus.LATE_SUBMISSION]: 'Trong thời gian gia hạn',
};

export const CONTEST_SUBMISSION_STRATEGY_LABELS: Record<
  ContestSubmissionStrategy,
  string
> = {
  [ContestSubmissionStrategy.SINGLE_SUBMISSION]: 'Nộp một lần',
  [ContestSubmissionStrategy.BEST_SCORE]: 'Điểm cao nhất',
  [ContestSubmissionStrategy.LATEST_SCORE]: 'Điểm lần nộp cuối',
  [ContestSubmissionStrategy.AVERAGE_SCORE]: 'Điểm trung bình',
};

export const CONTEST_SUBMISSION_STRATEGY_DESCRIPTION: Record<
  ContestSubmissionStrategy,
  string
> = {
  [ContestSubmissionStrategy.SINGLE_SUBMISSION]:
    'Chỉ cho phép nộp một lần cho mỗi problem',
  [ContestSubmissionStrategy.BEST_SCORE]:
    'Lấy điểm cao nhất trong tất cả các lần nộp',
  [ContestSubmissionStrategy.LATEST_SCORE]: 'Lấy điểm của lần nộp cuối cùng',
  [ContestSubmissionStrategy.AVERAGE_SCORE]:
    'Lấy điểm trung bình của tất cả các lần nộp',
};

export const CONTEST_STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'chưa bắt đầu', label: 'Chưa bắt đầu' },
  { value: 'đang diễn ra', label: 'Đang diễn ra' },
  { value: 'đã kết thúc', label: 'Đã kết thúc' },
];

export const CONTEST_ACCESS_RANGE_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'public', label: 'Công khai' },
  { value: 'private', label: 'Riêng tư' },
];

export interface ContestProblemDTO {
  problemId: string;
  score: number;
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  country: string;
  rating: number;
  attendedContests: number;
  rank: number;
}

export const CONTEST_STATUS_COLORS = {
  upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  ongoing: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  finished: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  public:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  private:
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
};

export const CONTEST_STATUS_LABELS = {
  upcoming: 'Sắp diễn ra',
  ongoing: 'Đang diễn ra',
  finished: 'Đã kết thúc',
  public: 'Công khai',
  private: 'Riêng tư',
} as const;

export const PARTICIPATION_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'yes', label: 'Đã tham gia' },
  { value: 'no', label: 'Chưa tham gia' },
];

export enum ContestNavTabs {
  DESCRIPTION = 'description',
  SUBMISSIONS = 'submissions',
}

export const CONTEST_NAV_TABS_DETAIL = [
  { id: ContestNavTabs.DESCRIPTION, label: 'Problem', icon: FileText },
  { id: ContestNavTabs.SUBMISSIONS, label: 'Submissions', icon: CheckCircle },
];
