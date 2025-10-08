import clientApi from '@/lib/apis/axios-client';
import type { ApiResponse } from '@/types/api';
import {
  type CreateProblemRequest,
  type GetProblemListRequest,
  ProblemData,
  type ProblemEndpointType,
  type ProblemListResponse,
} from '@/types/problems';
import { Tag } from '@/types/tags';
import { TestcaseSample } from '@/types/testcases';
import { Topic } from '@/types/topics';
import type { AxiosResponse } from 'axios';
import { TagsService } from './tags-service';
import { TestcasesService } from './testcases-service';
import { TopicsService } from './topics-service';

async function getProblemList(
  getProblemListRequest: GetProblemListRequest,
  endpointType: ProblemEndpointType
): Promise<AxiosResponse<ApiResponse<ProblemListResponse>>> {
  const params = convertToQueryParams(getProblemListRequest);
  const endpoint = `/problems/${endpointType}`;
  const queryString = params.toString();
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;
  return await clientApi.get(url);
}

// Complete problem creation workflow
async function createProblemComplete(
  problemRequest: CreateProblemRequest,
  testcaseFile?: File
): Promise<any> {
  try {
    let testcaseId: string;

    // If testcaseFile is provided, upload it first
    if (testcaseFile) {
      testcaseId = await TestcasesService.createTestcaseComplete(testcaseFile);
    } else if (problemRequest.testcaseId) {
      // Use existing testcase ID if provided
      testcaseId = problemRequest.testcaseId;
    } else {
      throw new Error('Either testcase file or testcase ID must be provided');
    }

    // Create the request with testcase ID
    const request: CreateProblemRequest = {
      ...problemRequest,
      testcaseId: testcaseId,
      // Ensure arrays are properly formatted
      tagIds: Array.isArray(problemRequest.tagIds) ? problemRequest.tagIds : [],
      topicIds: Array.isArray(problemRequest.topicIds)
        ? problemRequest.topicIds
        : [],
    };

    console.log('Final request payload:', JSON.stringify(request, null, 2));

    const response = await clientApi.post('/problems', request, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    console.error('Error in complete problem creation:', error);
    throw error;
  }
}

function convertToQueryParams(request: GetProblemListRequest): URLSearchParams {
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
  if (request.sortBy) {
    params.append('sortBy', request.sortBy);
  }

  // Handle filters
  if (request.filters) {
    if (request.filters.difficulty) {
      params.append('difficulty', request.filters.difficulty);
    }
    if (request.filters.topic) {
      params.append('topic', request.filters.topic);
    }
    if (request.filters.tags && request.filters.tags.length > 0) {
      for (const tag of request.filters.tags) {
        params.append('tags', tag);
      }
    }
  }

  return params;
}

export const ProblemsService = {
  getProblemList,
  createProblemComplete,
};
