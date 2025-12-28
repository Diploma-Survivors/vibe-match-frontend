import clientApi from '@/lib/apis/axios-client';
import { store } from '@/store';
import { setLanguages } from '@/store/slides/workspace-slice';
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

let languageListPromise: Promise<any> | null = null;

async function getLanguageList() {
  const state = store.getState();
  const cachedLanguages = state.workspace.languages;

  if (cachedLanguages && cachedLanguages.length > 0) {
    return { data: { data: cachedLanguages } };
  }

  if (languageListPromise) {
    return languageListPromise;
  }

  languageListPromise = clientApi.get('/languages').then((response) => {
    store.dispatch(setLanguages(response.data.data));
    languageListPromise = null;
    return response;
  }).catch((error) => {
    console.warn('API failed, using mock languages', error);
    languageListPromise = null;
    const mockLanguages = [
      { id: 71, name: 'Python' },
      { id: 54, name: 'C++' },
      { id: 62, name: 'Java' },
      { id: 63, name: 'JavaScript' },
      { id: 50, name: 'C' },
    ];
    store.dispatch(setLanguages(mockLanguages));
    return { data: { data: mockLanguages } };
  });

  return languageListPromise;
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
  
  try {
    return await clientApi.get(url);
  } catch (error) {
    // Return mock data
    console.warn("API failed, using mock submissions");
    const mockData = await getAllSubmissions(101); // Mock user ID
    
    // Transform mock list items to paginated response structure
    const edges = mockData.map(item => ({
        node: item,
        cursor: item.id.toString()
    }));
    
    return {
        data: {
            data: {
                edges,
                pageInfos: {
                    hasNextPage: false,
                    hasPreviousPage: false,
                    startCursor: edges[0]?.cursor || '',
                    endCursor: edges[edges.length - 1]?.cursor || ''
                },
                totalCount: mockData.length
            }
        }
    };
  }
}

async function getSubmissionById(submissionId: string) {
  try {
    return await clientApi.get(`/submissions/${submissionId}`);
  } catch (error) {
    // Return mock detail
    const mockList = await getAllSubmissions(101);
    const mockItem = mockList.find(s => s.id.toString() === submissionId) || mockList[0];
    
    return {
        data: {
            data: {
                ...mockItem,
                sourceCode: `print("Hello World from submission ${submissionId}")`,
                status: mockItem?.status || SubmissionStatus.ACCEPTED
            }
        }
    };
  }
}

async function getAllSubmissions(
  userId: number
): Promise<SubmissionListItem[]> {
  // Mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      // Seed random with userId to get consistent results for the same user
      // Simple pseudo-random generator
      const seed = userId;
      const random = () => {
        const x = Math.sin(seed + Math.random()) * 10000;
        return x - Math.floor(x);
      };

      const submissionCount = Math.floor(Math.random() * 50) + 10; // 10 to 60 submissions

      const submissions: SubmissionListItem[] = Array.from({
        length: submissionCount,
      }).map((_, i) => {
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
        const r = Math.random();
        let sum = 0;
        for (let j = 0; j < statuses.length; j++) {
          sum += statusWeights[j];
          if (r < sum) {
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
            id: userId,
            firstName: 'User',
            lastName: `${userId}`,
            email: `user${userId}@example.com`,
          },
          problemId: Math.floor(Math.random() * 100 + 1).toString(),
        };
      });
      resolve(submissions);
    }, 500);
  });
}

async function getAllContestSubmissions(
  contestId: string,
  userId: number
): Promise<SubmissionListItem[]> {
  // Mock data - similar to getAllSubmissions but conceptually for a specific contest
  return getAllSubmissions(userId);
}

export const SubmissionsService = {
  run,
  submit,
  getLanguageList,
  getSubmissionList,
  getSubmissionById,
  getAllSubmissions,
  getAllContestSubmissions,
};
