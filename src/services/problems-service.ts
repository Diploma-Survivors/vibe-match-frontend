import clientApi from '@/lib/apis/axios-client';
import type { ApiResponse } from '@/types/api';
import type {
  GetProblemListRequest,
  ProblemDetail,
  ProblemListResponse,
} from '@/types/problems';
import type { AxiosResponse } from 'axios';
import qs from 'qs';

async function getProblemList(
  getProblemListRequest: GetProblemListRequest
): Promise<AxiosResponse<ApiResponse<ProblemListResponse>>> {
  const queryString = qs.stringify(getProblemListRequest, {
    allowDots: true,
    skipNulls: true,
  });

  const url = queryString ? `/problems?${queryString}` : '/problems';
  return await clientApi.get(url);
}

async function getProblemById(problemId: string): Promise<ProblemDetail> {
  const response = await clientApi.get<ApiResponse<ProblemDetail>>(
    `/problems/${problemId}`
  );

  const problem = response.data.data;
  return problem;
}

export const ProblemsService = {
  getProblemList,
  getProblemById,
};
