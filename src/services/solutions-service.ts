import type {
  CreateSolutionRequest,
  Solution,
  SolutionComment,
  SolutionListRequest,
  SolutionListResponse,
} from '@/types/solutions';
import { UserService } from './user-service';

// Mock data
const MOCK_SOLUTIONS: Solution[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `sol-${i + 1}`,
  problemId: `${(i % 5) + 1}`, // Mock problem IDs 1-5
  title: `Solution ${i + 1}: Optimal Approach with O(n) time complexity`,
  authorId: 2,
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - i * 86400000).toISOString(),
  myVote: i % 3 === 0 ? 'up_vote' : i % 3 === 1 ? 'down_vote' : null,
  upvoteCount: Math.floor(Math.random() * 100),
  downvoteCount: Math.floor(Math.random() * 10),
  commentCount: Math.floor(Math.random() * 20),
  tags: [
    { id: 1, name: 'Array', updatedAt: new Date(), createdAt: new Date() },
    { id: 2, name: 'Hash Table', updatedAt: new Date(), createdAt: new Date() },
  ],
  languageIds: [75, 76], // 1: Java, 2: C++
  content: `
# Approach

We can solve this problem using a hash map to store the indices of the elements we have seen so far.

## Algorithm

1. Initialize an empty hash map.
2. Iterate through the array.
3. For each element, check if the complement (target - element) exists in the hash map.
4. If it exists, return the indices.
5. Otherwise, add the element and its index to the hash map.

## Complexity

- Time complexity: O(n)
- Space complexity: O(n)

\`\`\`java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }
}
\`\`\`
  `,
}));

async function getSolutions(
  request: SolutionListRequest
): Promise<SolutionListResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filtered = [...MOCK_SOLUTIONS];

  // Filter by keyword
  if (request.keyword) {
    const lowerKeyword = request.keyword.toLowerCase();
    filtered = filtered.filter((s) =>
      s.title.toLowerCase().includes(lowerKeyword)
    );
  }

  // Filter by tags
  if (request.filters?.tagIds?.length) {
    filtered = filtered.filter((s) =>
      s.tags.some((t) => request.filters?.tagIds?.includes(t.id))
    );
  }

  // Filter by languages
  if (request.filters?.languageIds?.length) {
    filtered = filtered.filter((s) =>
      s.languageIds.some((l) => request.filters?.languageIds?.includes(l))
    );
  }

  // Sort
  if (request.sortBy === 'most_voted') {
    filtered.sort((a, b) => b.upvoteCount - a.upvoteCount);
  } else {
    // Default recent
    filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // Pagination
  const startIndex = request.after
    ? filtered.findIndex((s) => s.id === request.after) + 1
    : 0;
  const limit = request.first || 10;
  const sliced = filtered.slice(startIndex, startIndex + limit);

  // Hydrate authors
  const hydrated = await Promise.all(
    sliced.map(async (s) => {
      const author = await UserService.getUserProfile(s.authorId);
      return { ...s, author };
    })
  );

  return {
    edges: hydrated.map((node) => ({
      cursor: node.id,
      node,
    })),
    pageInfos: {
      hasNextPage: startIndex + limit < filtered.length,
      endCursor: hydrated[hydrated.length - 1]?.id || '',
    },
    totalCount: filtered.length,
  };
}

async function getAllSolutions(userId: number): Promise<Solution[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const filtered = [...MOCK_SOLUTIONS];

  // Hydrate authors
  const hydrated = await Promise.all(
    filtered.map(async (s) => {
      const author = await UserService.getUserProfile(s.authorId);
      return { ...s, author };
    })
  );

  return hydrated;
}

async function getSolutionDetail(id: string): Promise<Solution> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const solution = MOCK_SOLUTIONS.find((s) => s.id === id);
  if (!solution) throw new Error('Solution not found');

  const author = await UserService.getUserProfile(solution.authorId);
  return { ...solution, author };
}

async function reactSolution(
  id: string,
  type: 'up_vote' | 'down_vote'
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  console.log(`Reacted to solution ${id} with ${type}`);
}

async function unreactSolution(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  console.log(`Unreacted to solution ${id}`);
}

async function createSolution(
  request: CreateSolutionRequest
): Promise<Solution> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const newSolution: Solution = {
    id: `sol-${Date.now()}`,
    problemId: request.problemId,
    title: request.title,
    authorId: 101, // Mock current user
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    myVote: null,
    upvoteCount: 0,
    downvoteCount: 0,
    commentCount: 0,
    tags: [], // In real app, we would fetch tags by ids
    languageIds: request.languageIds,
    content: request.content,
  };
  MOCK_SOLUTIONS.unshift(newSolution);
  return newSolution;
}

// Mock Comments Data
const MOCK_COMMENTS: SolutionComment[] = Array.from({ length: 20 }).map(
  (_, i) => ({
    id: `comment-${i + 1}`,
    solutionId: 'sol-1', // Mocking for the first solution
    authorId: 2,
    content: `This is a mock comment ${i + 1}. Great explanation!`,
    upvoteCount: Math.floor(Math.random() * 50),
    downvoteCount: Math.floor(Math.random() * 5),
    myVote: null,
    parentCommentId: i % 4 === 0 ? null : `comment-${Math.floor(i / 4) + 1}`, // Some replies
    replyCounts: i % 4 === 0 ? 3 : 0,
    createdAt: new Date(Date.now() - i * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - i * 3600000).toISOString(),
  })
);

async function getComments(solutionId: string): Promise<SolutionComment[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  // Return all mock comments for now, filtered by solutionId in a real app
  const comments = [...MOCK_COMMENTS];

  // Hydrate authors
  const hydrated = await Promise.all(
    comments.map(async (c) => {
      const author = await UserService.getUserProfile(c.authorId);
      return { ...c, author };
    })
  );

  return hydrated;
}

async function createComment(
  solutionId: string,
  content: string,
  parentCommentId?: string
): Promise<SolutionComment> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const newComment: SolutionComment = {
    id: `comment-${Date.now()}`,
    solutionId,
    authorId: 101, // Mock current user
    content,
    upvoteCount: 0,
    downvoteCount: 0,
    myVote: null,
    parentCommentId: parentCommentId || null,
    replyCounts: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const author = await UserService.getUserProfile(newComment.authorId);
  return { ...newComment, author };
}

async function reactComment(
  commentId: string,
  type: 'up_vote' | 'down_vote'
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  console.log(`Reacted to comment ${commentId} with ${type}`);
}

async function unreactComment(commentId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  console.log(`Unreacted to comment ${commentId}`);
}

async function deleteComment(commentId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const index = MOCK_COMMENTS.findIndex((c) => c.id === commentId);
  if (index !== -1) {
    MOCK_COMMENTS.splice(index, 1);
  }
}

async function updateComment(
  commentId: string,
  content: string
): Promise<SolutionComment> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const comment = MOCK_COMMENTS.find((c) => c.id === commentId);
  if (!comment) throw new Error('Comment not found');

  comment.content = content;
  comment.updatedAt = new Date().toISOString();

  const author = await UserService.getUserProfile(comment.authorId);
  return { ...comment, author };
}

async function deleteSolution(solutionId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const index = MOCK_SOLUTIONS.findIndex((s) => s.id === solutionId);
  if (index !== -1) {
    MOCK_SOLUTIONS.splice(index, 1);
  }
}

async function updateSolution(
  solutionId: string,
  request: CreateSolutionRequest
): Promise<Solution> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const solution = MOCK_SOLUTIONS.find((s) => s.id === solutionId);
  if (!solution) throw new Error('Solution not found');

  solution.title = request.title;
  solution.content = request.content;
  solution.languageIds = request.languageIds;
  // In real app, tags would be updated too
  solution.updatedAt = new Date().toISOString();

  const author = await UserService.getUserProfile(solution.authorId);
  return { ...solution, author };
}

export const SolutionsService = {
  getSolutions,
  getSolutionDetail,
  reactSolution,
  unreactSolution,
  getComments,
  createComment,
  reactComment,
  unreactComment,
  createSolution,
  deleteComment,
  updateComment,
  deleteSolution,
  updateSolution,
  getAllSolutions,
};
