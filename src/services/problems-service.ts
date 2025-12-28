import clientApi from '@/lib/apis/axios-client';
import type { ApiResponse } from '@/types/api';
import {
  type GetProblemListRequest,
  type ProblemDescription,
  ProblemDifficulty,
  type ProblemListItem,
  type ProblemListResponse,
} from '@/types/problems';
import type { AxiosResponse } from 'axios';
import qs from 'qs';
import { MOCK_PROBLEMS } from '@/data/mock-problems';

async function getProblemListForTraining(
  getProblemListRequest: GetProblemListRequest
): Promise<AxiosResponse<ApiResponse<ProblemListResponse>>> {
  const queryString = qs.stringify(getProblemListRequest, {
    allowDots: true,
    skipNulls: true,
  });

  const url = queryString
    ? `/problems/training?${queryString}`
    : '/problems/training';
    
  try {
      return await clientApi.get(url);
  } catch (error) {
      console.warn('API failed, returning mock data', error);
      // Return mock data structure matching AxiosResponse<ApiResponse<ProblemListResponse>>
      return {
          data: {
              data: {
                  edges: MOCK_PROBLEMS.slice(0, getProblemListRequest.first || 20).map(node => ({ node, cursor: node.id })),
                  pageInfos: {
                      hasNextPage: false,
                      hasPreviousPage: false,
                      startCursor: '1',
                      endCursor: '20'
                  },
                  totalCount: MOCK_PROBLEMS.length
              },
              status: 'OK',
              apiVersion: '1.0.0',
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any
      };
  }
}

import { MOCK_PROBLEM_DETAIL } from '@/data/mock-problem-detail';

async function getProblemById(problemId: string): Promise<ProblemDescription> {
  // Use mock data for ID "1" or as fallback
  if (problemId === '1') {
    return MOCK_PROBLEM_DETAIL as unknown as ProblemDescription;
  }

  try {
    const response = await clientApi.get<ApiResponse<ProblemDescription>>(
      `/problems/${problemId}`
    );
    return response.data.data;
  } catch (error) {
    console.warn(`Failed to fetch problem ${problemId}, using mock data.`, error);
    return MOCK_PROBLEM_DETAIL as unknown as ProblemDescription;
  }
}

async function getAllProblems(): Promise<ProblemListItem[]> {
  // Mock data
  return new Promise((resolve) => {
    setTimeout(() => {
        resolve(MOCK_PROBLEMS);
    }, 1000);
  });
}

async function getSolvedProblems(userId?: number): Promise<ProblemListItem[]> {
  // Mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_PROBLEMS.filter(p => p.difficulty === ProblemDifficulty.EASY));
    }, 1000);
  });
}

export const ProblemsService = {
  getProblemListForTraining,
  getProblemById,
  getAllProblems,
  getSolvedProblems,
};
