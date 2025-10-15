import clientApi from '@/lib/apis/axios-client';
import type { SubmissionRequest } from '@/types/submissions';

async function run(submissionRequest: SubmissionRequest) {
  console.log('submissionRequest', submissionRequest);
  return await clientApi.post('/submissions/run', submissionRequest);
}

async function submit(submissionRequest: SubmissionRequest) {
  console.log('submissionRequest', submissionRequest);
  return await clientApi.post('/submissions/submit', submissionRequest);
}

export const SubmissionsService = {
  run,
  submit,
};
