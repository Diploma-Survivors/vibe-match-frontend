import { ContestProblemStatus } from '@/types/contests';
import { ProblemDifficulty } from '@/types/problems';

export interface ContestDetailMock {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    status: 'SCHEDULED' | 'RUNNING' | 'ENDED';
    problems: {
        id: string;
        title: string;
        difficulty: ProblemDifficulty;
        maxScore: number;
        userScore?: number;
        status: ContestProblemStatus;
        solvedCount: number;
        totalSubmissions: number;
        memoryLimitKb: number;
        timeLimitMs: number;
    }[];
    userRank?: {
        rank: number;
        score: number;
        solvedProblems: number;
        finishTime: string; // e.g., "1:23:45"
    };
}

export const MOCK_CONTEST_DETAIL: ContestDetailMock = {
    id: 'weekly-482',
    title: 'Weekly Contest 482',
    startTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // Started 1 hour ago
    endTime: new Date(Date.now() + 1000 * 60 * 30).toISOString(), // Ends in 30 mins
    status: 'RUNNING',
    problems: [
        {
            id: 'p1',
            title: 'Find the Maximum Score',
            difficulty: ProblemDifficulty.EASY,
            maxScore: 3,
            userScore: 3,
            status: ContestProblemStatus.SOLVED,
            solvedCount: 15420,
            totalSubmissions: 18000,
            memoryLimitKb: 256000,
            timeLimitMs: 1000,
        },
        {
            id: 'p2',
            title: 'Minimize the Cost of Path',
            difficulty: ProblemDifficulty.MEDIUM,
            maxScore: 4,
            userScore: 0,
            status: ContestProblemStatus.ATTEMPTED,
            solvedCount: 8500,
            totalSubmissions: 12000,
            memoryLimitKb: 256000,
            timeLimitMs: 2000,
        },
        {
            id: 'p3',
            title: 'Count Valid Subsequences',
            difficulty: ProblemDifficulty.MEDIUM,
            maxScore: 5,
            status: ContestProblemStatus.UN_ATTEMPTED,
            solvedCount: 3200,
            totalSubmissions: 7000,
            memoryLimitKb: 512000,
            timeLimitMs: 2000,
        },
        {
            id: 'p4',
            title: 'Design a Resilient Network',
            difficulty: ProblemDifficulty.HARD,
            maxScore: 6,
            status: ContestProblemStatus.UNSOLVED,
            solvedCount: 450,
            totalSubmissions: 2000,
            memoryLimitKb: 512000,
            timeLimitMs: 3000,
        },
    ],
    userRank: {
        rank: 1245,
        score: 3,
        solvedProblems: 1,
        finishTime: '0:15:20',
    },
};

export const MOCK_RANKING_LIST = [
    {
        rank: 1,
        username: 'tourist',
        score: 18,
        timeSpent: '0:35:12',
        problemsSolved: 4,
        avatar: 'https://github.com/shadcn.png',
        country: 'BY',
        progress: [true, true, true, true],
    },
    {
        rank: 2,
        username: 'benq',
        score: 18,
        timeSpent: '0:38:45',
        problemsSolved: 4,
        avatar: 'https://github.com/shadcn.png',
        country: 'US',
        progress: [true, true, true, true],
    },
    {
        rank: 3,
        username: 'jiangly',
        score: 18,
        timeSpent: '0:40:02',
        problemsSolved: 4,
        avatar: 'https://github.com/shadcn.png',
        country: 'CN',
        progress: [true, true, true, true],
    },
    {
        rank: 1245,
        username: 'You',
        score: 3,
        timeSpent: '0:15:20',
        problemsSolved: 1,
        avatar: 'https://github.com/shadcn.png',
        country: 'VN',
        progress: [true, false, false, false],
        isCurrentUser: true,
    },
];

export const MOCK_PROBLEM_DESCRIPTION = {
    id: 'p1',
    title: 'Find the Maximum Score',
    difficulty: ProblemDifficulty.EASY,
    body: `
    <div class="problem-content">
      <p>You are given an array of integers <code>nums</code>.</p>
      <p>Return the <strong>maximum score</strong> you can achieve by selecting a subsequence of <code>nums</code> such that the sum of the selected elements is maximized.</p>
      <p>&nbsp;</p>
      <p><strong>Example 1:</strong></p>
      <pre><strong>Input:</strong> nums = [1, 2, 3]
<strong>Output:</strong> 6
<strong>Explanation:</strong> Select all elements.</pre>
      <p><strong>Example 2:</strong></p>
      <pre><strong>Input:</strong> nums = [-1, -2, -3]
<strong>Output:</strong> 0
<strong>Explanation:</strong> Select no elements (empty subsequence has sum 0).</pre>
      <p>&nbsp;</p>
      <p><strong>Constraints:</strong></p>
      <ul>
        <li><code>1 <= nums.length <= 1000</code></li>
        <li><code>-1000 <= nums[i] <= 1000</code></li>
      </ul>
    </div>
  `,
    input: 'nums = [1, 2, 3]',
    output: '6',
    stats: {
        accepted: 15420,
        submissions: 18000,
        acceptanceRate: '85.67%',
    },
    tags: ['Array', 'Dynamic Programming'],
    hints: ['Think about positive numbers.', 'Should you include negative numbers?'],
};
