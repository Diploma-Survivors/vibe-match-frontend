import type { ProblemData } from './problems';

export interface Contest {
  id?: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  problems: ProblemData[];
  status?: ContestStatus;
  createdBy?: string;
  createdAt?: string;
}

export interface ContestDTO {
  id?: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  problems: ContestProblemDTO[];
  status?: ContestStatus;
  createdBy?: string;
  createdAt?: string;
}

export enum ContestStatus {
  PRIVATE = 'private',
  PUBLIC = 'public',
}

export interface ContestFilters {
  id?: string;
  name?: string;
  status?: string;
  accessRange?: string;
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

// export interface ContestStatus {
//   upcoming: Contest[];
//   ongoing: Contest[];
//   finished: Contest[];
// }

export const CONTEST_STATUS_COLORS = {
  upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  ongoing: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  finished: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
};

export const CONTEST_STATUS_LABELS = {
  upcoming: 'Sắp diễn ra',
  ongoing: 'Đang diễn ra',
  finished: 'Đã kết thúc',
};

// export interface ContestFilters {
//   id?: string;
//   name?: string;
//   status?: "upcoming" | "ongoing" | "finished" | "";
//   participated?: "yes" | "no" | "";
// }

// export const CONTEST_STATUS_OPTIONS = [
//   { value: "all", label: "Tất cả trạng thái" },
//   { value: "upcoming", label: "Sắp diễn ra" },
//   { value: "ongoing", label: "Đang diễn ra" },
//   { value: "finished", label: "Đã kết thúc" },
// ];

export const PARTICIPATION_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'yes', label: 'Đã tham gia' },
  { value: 'no', label: 'Chưa tham gia' },
];
