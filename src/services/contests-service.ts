import clientApi from '@/lib/apis/axios-client';
import type { ApiResponse } from '@/types/api';
import type { ContestListRequest, ContestListResponse } from '@/types/contests';
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

export const ContestsService = {
  getContestList,
};
