import clientApi from '@/lib/apis/axios-client';
import {
  type GetSubmissionListRequest,
  type SubmissionListItem,
  type SubmissionRequest,
  SubmissionStatus,
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

async function getAllSubmissions(): Promise<SubmissionListItem[]> {
  // Mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      const submissions: SubmissionListItem[] = Array.from({ length: 500 }).map(
        (_, i) => {
          const statuses = [
            SubmissionStatus.ACCEPTED,
            SubmissionStatus.WRONG_ANSWER,
            SubmissionStatus.RUNTIME_ERROR,
            SubmissionStatus.TIME_LIMIT_EXCEEDED,
            SubmissionStatus.COMPILATION_ERROR,
          ];
          // Weighted random status (more accepted and wrong answer)
          const statusWeights = [0.4, 0.3, 0.1, 0.1, 0.1];
          let status = SubmissionStatus.ACCEPTED;
          const random = Math.random();
          let sum = 0;
          for (let j = 0; j < statuses.length; j++) {
            sum += statusWeights[j];
            if (random < sum) {
              status = statuses[j];
              break;
            }
          }

          const daysAgo = Math.floor(Math.random() * 365);
          const createdAt = new Date(
            Date.now() - daysAgo * 24 * 60 * 60 * 1000
          ).toISOString();

          return {
            id: i + 1,
            language: { id: 1, name: 'Python' },
            memory: Math.floor(Math.random() * 10000),
            note: null,
            runtime: Math.floor(Math.random() * 1000),
            score: status === SubmissionStatus.ACCEPTED ? 100 : 0,
            status,
            createdAt,
            user: {
              id: 1,
              firstName: 'Nguyen Van',
              lastName: 'A',
              email: 'nguyenvana@example.com',
            },
            problemId: Math.floor(Math.random() * 100 + 1).toString(),
          };
        }
      );
      resolve(submissions);
    }, 500);
  });
}

export const SubmissionsService = {
  run,
  submit,
  getLanguageList,
  getSubmissionList,
  getSubmissionById,
  getAllSubmissions,
};
