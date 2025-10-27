import clientApi from '@/lib/apis/axios-client';
import type { ApiResponse } from '@/types/api';
import type {
  GetProblemListRequest,
  ProblemDescription,
  ProblemListResponse,
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

  const problem = response.data.data;
  return problem;
}

export const ProblemsService = {
  getProblemListForTraining,
  getProblemById,
};
