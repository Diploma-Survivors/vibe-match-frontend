import clientApi from '@/lib/apis/axios-client';
import type { SubmissionRequest } from '@/types/submissions';

async function run(submissionRequest: SubmissionRequest) {
  return await clientApi.post('/submissions/run', submissionRequest);
}

async function submit(submissionRequest: SubmissionRequest) {
  return await clientApi.post('/submissions/submit', submissionRequest);
}

async function getLanguageList() {
  return await clientApi.get('/languages');
}

// async function getSubmissionList(submissionListRequest: SubmissionListRequest) {
//   return await clientApi.get('/submissions', submissionListRequest);
// }

export const SubmissionsService = {
  run,
  submit,
  getLanguageList,
};
