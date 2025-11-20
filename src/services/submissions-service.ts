import clientApi from '@/lib/apis/axios-client';
import type {
  GetSubmissionListRequest,
  SubmissionRequest,
} from '@/types/submissions';
import qs from 'qs';

async function run(submissionRequest: SubmissionRequest) {
  return await clientApi.post('/submissions/run', submissionRequest);
}

async function submit(submissionRequest: SubmissionRequest) {
  const { contestId, ...payload } = submissionRequest;
  let path = '/submissions/submit';
  if (contestId) {
    path = `/contests/${contestId}/submit`;
  }
  return await clientApi.post(path, payload);
}

async function getLanguageList() {
  return await clientApi.get('/languages');
}

async function getSubmissionList(
  submissionListRequest: GetSubmissionListRequest,
  problemId: string,
  contestParticipationId?: number
) {
  const queryString = qs.stringify(submissionListRequest, {
    allowDots: true,
    skipNulls: true,
  });
  let url = '';
  if (contestParticipationId) {
    url = queryString
      ? `/submissions/contest-participation/${contestParticipationId}/problem/${problemId}?${queryString}`
      : `/submissions/contest-participation/${contestParticipationId}/problem/${problemId}`;
  } else {
    url = queryString
      ? `/submissions/problem/${problemId}?${queryString}`
      : `/submissions/problem/${problemId}`;
  }
  return await clientApi.get(url);
}

async function getSubmissionById(submissionId: string) {
  return await clientApi.get(`/submissions/${submissionId}`);
}

export const SubmissionsService = {
  run,
  submit,
  getLanguageList,
  getSubmissionList,
  getSubmissionById,
};
