import clientApi from '@/lib/apis/axios-client';
import type { ApiResponse } from '@/types/api';
import {
  CONTEST_STATUS_COLORS,
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

async function getContestDetail(id: string) {
  return await clientApi.get(`/contests/${id}`);
}

async function getContestOverview(id: string) {
  return await clientApi.get(`/contests/${id}/overview`);
}

async function finishContest(id: string) {
  return await clientApi.post(`/contests/${id}/finish`);
}

async function participateContest(id: string) {
  return await clientApi.post(`/contests/${id}/participate`);
}

function getContestStatus(contest: Contest): ContestStatus {
  const now = new Date();
  const startTime = new Date(contest.startTime);
  const endTime = new Date(contest.endTime);

  if (now < startTime) {
    return ContestStatus.NOT_STARTED;
  }

  if (contest.participation?.startTime && !contest.participation?.finishedAt) {
    return ContestStatus.IN_PROGRESS;
  }

  if (contest.participation?.finishedAt) {
    return ContestStatus.COMPLETED;
  }

  if (
    (!contest.lateDeadline && now > endTime) ||
    (contest.lateDeadline && now > new Date(contest.lateDeadline))
  ) {
    return ContestStatus.FINISHED;
  }

  if (contest.lateDeadline && now <= new Date(contest.lateDeadline)) {
    return ContestStatus.LATE_SUBMISSION;
  }

  return ContestStatus.ONGOING;
}

function isInprogress(contest: Contest): boolean {
  return getContestStatus(contest) === ContestStatus.IN_PROGRESS;
}

function getContestStatusColor(status: ContestStatus): string {
  switch (status) {
    case ContestStatus.NOT_STARTED:
      return CONTEST_STATUS_COLORS.upcoming;
    case ContestStatus.ONGOING:
    case ContestStatus.IN_PROGRESS:
      return CONTEST_STATUS_COLORS.ongoing;
    case ContestStatus.COMPLETED:
    case ContestStatus.FINISHED:
      return CONTEST_STATUS_COLORS.finished;
    default:
      return CONTEST_STATUS_COLORS.finished;
  }
}

export const ContestsService = {
  getContestList,
  getContestDetail,
  getContestStatus,
  getContestStatusColor,
  getContestOverview,
  isInprogress,
  finishContest,
  participateContest,
};
