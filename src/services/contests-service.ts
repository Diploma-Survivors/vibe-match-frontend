import clientApi from '@/lib/apis/axios-client';
import type { ApiResponse } from '@/types/api';
import {
  type Contest,
  type ContestListRequest,
  type ContestListResponse,
  ContestStatus,
} from '@/types/contests';
import type { AxiosResponse } from 'axios';
import qs from 'qs';

async function getContestList(
  getContestListRequest: ContestListRequest
): Promise<AxiosResponse<ApiResponse<ContestListResponse>>> {
  const queryString = qs.stringify(getContestListRequest, {
    allowDots: true,
    skipNulls: true,
  });

  const url = queryString ? `/contests?${queryString}` : '/contests';
  return await clientApi.get(url);
}

async function getContestById(id: string) {
  return await clientApi.get(`/contests/${id}`);
}

function getContestStatus(contest: Contest): ContestStatus {
  const now = new Date();
  const startTime = new Date(contest.startTime);
  const endTime = new Date(contest.endTime);

  if (now < startTime) {
    return ContestStatus.NOT_STARTED;
  }

  if (contest.participantStartTime && !contest.submittedTime) {
    return ContestStatus.IN_PROGRESS;
  }

  if (contest.submittedTime) {
    return ContestStatus.COMPLETED;
  }

  if (now > endTime) {
    return ContestStatus.FINISHED;
  }

  return ContestStatus.ONGOING;
}

export const ContestsService = {
  getContestList,
  getContestById,
  getContestStatus,
};
