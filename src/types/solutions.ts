import type { Tag } from './tags';
import type { UserProfile } from './user';

export interface Solution {
  id: string;
  title: string;
  authorId: number;
  author?: UserProfile;
  createdAt: string;
  updatedAt: string;
  myVote: 'up_vote' | 'down_vote' | null;
  upvoteCount: number;
  downvoteCount: number;
  commentCount: number;
  tags: Tag[];
  languageIds: number[];
  content: string;
}

export interface SolutionFilters {
  tagIds?: number[];
  languageIds?: number[];
}

export enum SolutionSortBy {
  RECENT = 'recent',
  MOST_VOTED = 'most_voted',
}

export interface SolutionListRequest {
  problemId: string;
  keyword?: string;
  filters?: SolutionFilters;
  sortBy?: SolutionSortBy;
  after?: string;
  first?: number;
}

export interface SolutionEdge {
  cursor: string;
  node: Solution;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string;
}

export interface SolutionListResponse {
  edges: SolutionEdge[];
  pageInfos: PageInfo;
  totalCount: number;
}
export interface SolutionComment {
  id: string;
  solutionId: string;
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

export enum SolutionCommentSortBy {
  RECENT = 'recent',
  MOST_VOTED = 'most_voted',
}

export interface CreateSolutionRequest {
  problemId: string;
  title: string;
  content: string;
  tagIds: number[];
  languageIds: number[];
}
