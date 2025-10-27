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
  return await clientApi.post('/submissions/submit', submissionRequest);
}

async function getLanguageList() {
  return await clientApi.get('/languages');
}

async function getSubmissionList(
  submissionListRequest: GetSubmissionListRequest,
  problemId: string
) {
  const queryString = qs.stringify(submissionListRequest, {
    allowDots: true,
    skipNulls: true,
  });

  const url = queryString
    ? `/submissions/problem/${problemId}?${queryString}`
    : `/submissions/problem/${problemId}`;
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
