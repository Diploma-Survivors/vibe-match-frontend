import clientApi from '@/lib/apis/axios-client';
import { type ApiResponse, HttpStatus } from '@/types/api';
import type {
  ContestListResponse,
  GetContestListRequest,
} from '@/types/contests';
import axios, { type AxiosResponse } from 'axios';

// Get contest list with pagination and filters
async function getContestList(
  getContestListRequest: GetContestListRequest
): Promise<AxiosResponse<ApiResponse<ContestListResponse>>> {
  const params = convertToQueryParams(getContestListRequest);
  const endpoint = '/contests';
  const queryString = params.toString();
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;

  console.log('Fetching contests from URL:', url);

  return await clientApi.get(url);
}

// Helper function to convert GetContestListRequest to URLSearchParams
function convertToQueryParams(request: GetContestListRequest): URLSearchParams {
  const params = new URLSearchParams();

  if (request.keyword) {
    params.append('keyword', request.keyword);
  }
  if (request.after) {
    params.append('after', request.after);
  }
  if (request.before) {
    params.append('before', request.before);
  }
  if (request.first) {
    params.append('first', request.first.toString());
  }
  if (request.last) {
    params.append('last', request.last.toString());
  }
  if (request.sortOrder) {
    params.append('sortOrder', request.sortOrder);
  }
  if (request.matchMode) {
    params.append('matchMode', request.matchMode);
  }
  if (request.sortBy) {
    params.append('sortBy', request.sortBy);
  }
  if (request.startTime) {
    params.append('startTime', request.startTime);
  }
  if (request.endTime) {
    params.append('endTime', request.endTime);
  }
  if (request.minDurationMinutes !== undefined) {
    params.append('minDurationMinutes', request.minDurationMinutes.toString());
  }
  if (request.maxDurationMinutes !== undefined) {
    params.append('maxDurationMinutes', request.maxDurationMinutes.toString());
  }

  return params;
}

export const ContestsService = {
  getContestList,
};
