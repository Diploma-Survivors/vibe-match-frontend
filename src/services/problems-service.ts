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
  return await clientApi.get(url);
}

async function getProblemById(problemId: string): Promise<ProblemDescription> {
  const response = await clientApi.get<ApiResponse<ProblemDescription>>(
    `/problems/${problemId}`
  );

  return response.data.data;
}

async function getAllProblems(): Promise<ProblemListItem[]> {
  // Mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      const problems: ProblemListItem[] = Array.from({ length: 100 }).map(
        (_, i) => {
          const id = (i + 1).toString();
          const difficulties = [
            ProblemDifficulty.EASY,
            ProblemDifficulty.MEDIUM,
            ProblemDifficulty.HARD,
          ];
          const difficulty =
            difficulties[Math.floor(Math.random() * difficulties.length)];
          return {
            id,
            title: `Bài tập ${id}`,
            difficulty,
            tags: [],
            topics: [],
          };
        }
      );
      resolve(problems);
    }, 5000);
  });
}

async function getSolvedProblems(): Promise<ProblemListItem[]> {
  // Mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      const problems: ProblemListItem[] = Array.from({ length: 40 }).map(
        (_, i) => {
          const id = (i + 1).toString();
          const difficulties = [
            ProblemDifficulty.EASY,
            ProblemDifficulty.MEDIUM,
            ProblemDifficulty.HARD,
          ];
          const difficulty =
            difficulties[Math.floor(Math.random() * difficulties.length)];
          return {
            id,
            title: `Bài tập ${id}`,
            difficulty,
            tags: [],
            topics: [],
          };
        }
      );
      resolve(problems);
    }, 5000);
  });
}

export const ProblemsService = {
  getProblemListForTraining,
  getProblemById,
  getAllProblems,
  getSolvedProblems,
};
