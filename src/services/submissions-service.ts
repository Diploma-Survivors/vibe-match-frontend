import clientApi from '@/lib/apis/axios-client';
import type { SubmissionRequest } from '@/types/submissions';

async function run(submissionRequest: SubmissionRequest) {
  console.log('submissionRequest', submissionRequest);
  return await clientApi.post('/submissions/run', submissionRequest);
}

export const SubmissionsService = {
  run,
};
