import clientApi from '@/lib/apis/axios-client';
import { type ApiResponse, HttpStatus } from '@/types/api';
import type { Contest, ContestDTO, ContestProblemDTO } from '@/types/contest';
import axios, { type AxiosResponse } from 'axios';

async function createContest(
  contestDTO: ContestDTO
): Promise<AxiosResponse<ApiResponse<ContestDTO>>> {
  return await clientApi.post<ApiResponse<ContestDTO>>('/contests', contestDTO);
}

function mapContestToDTO(contest: Contest): ContestDTO {
  return {
    ...contest,
    problems: contest.problems.map(
      (problem) =>
        ({
          problemId: problem.id,
          score: problem.score,
        }) as ContestProblemDTO
    ),
  };
}

export const ContestsService = {
  createContest,
  mapContestToDTO,
};
