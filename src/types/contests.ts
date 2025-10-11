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

// -------- Mock Data & Constants, It will be deleted, replaced or edit in the future --------
export enum ContestStatus {
  PUBLIC = 'public',
  PRIVATE = 'private',
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  FINISHED = 'finished',
}

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
} as const;

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
