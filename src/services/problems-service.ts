import clientApi from '@/lib/apis/axios-client';
import type { ApiResponse } from '@/types/api';
import {
  type GetProblemListRequest,
  Problem,
  ProblemDifficulty,
  type ProblemListItem,
  type ProblemListResponse,
} from '@/types/problems';
import type { AxiosResponse } from 'axios';
import qs from 'qs';
import { MOCK_PROBLEMS } from '@/data/mock-problems';

async function getProblemList(
  getProblemListRequest: GetProblemListRequest
): Promise<AxiosResponse<ApiResponse<ProblemListResponse>>> {
  const { filters, ...rest } = getProblemListRequest;
  const params = qs.stringify(
    { ...rest, ...filters },
    {
      allowDots: true,
      skipNulls: true,
    }
  );
  const endpoint = '/problems';
  const url = params ? `${endpoint}?${params}` : endpoint;
  return await clientApi.get<ApiResponse<ProblemListResponse>>(url);
}


import { MOCK_PROBLEM_DETAIL } from '@/data/mock-problem-detail';

async function getProblemById(
  problemId: number
): Promise<AxiosResponse<ApiResponse<Problem>>> {

  const [problemResponse, samplesResponse] = await Promise.all([
    clientApi.get<ApiResponse<Problem>>(`/problems/${problemId}`),
    clientApi.get<ApiResponse<SampleTestCase[]>>(`/problems/${problemId}/samples`).catch(() => null),
  ]);

  if (problemResponse.data?.data && samplesResponse?.data?.data) {
    problemResponse.data.data.sampleTestcases = samplesResponse.data.data;
  }
  if(problemResponse.data?.data){
    problemResponse.data.data.hasOfficialSolution = !!problemResponse.data.data.officialSolutionContent;
  }

  return problemResponse;
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
  getProblemList,
  getProblemById,
  getAllProblems,
  getSolvedProblems,
};
