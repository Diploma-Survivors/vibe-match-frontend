import { ProblemDifficulty, type ProblemListItem, ProblemStatus } from '@/types/problems';

export const MOCK_PROBLEMS: ProblemListItem[] = Array.from({ length: 50 }).map((_, index) => {
  const id = (index + 1).toString();
  const difficulties = [
    ProblemDifficulty.EASY,
    ProblemDifficulty.MEDIUM,
    ProblemDifficulty.HARD,
  ];
  const statuses = [
      ProblemStatus.SOLVED,
      ProblemStatus.UNSOLVED,
      ProblemStatus.ATTEMPTED,
      ProblemStatus.UN_ATTEMPTED
  ];
  
  const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const acceptanceRate = Math.floor(Math.random() * 60) + 20;

  return {
    id,
    title: `Problem ${id}: ${
      [
        'Two Sum',
        'Add Two Numbers',
        'Longest Substring Without Repeating Characters',
        'Median of Two Sorted Arrays',
        'Longest Palindromic Substring',
        'Zigzag Conversion',
        'Reverse Integer',
        'String to Integer (atoi)',
        'Palindrome Number',
        'Regular Expression Matching',
      ][index % 10]
    }`,
    difficulty,
    tags: [
      { id: 1, name: 'Array', slug: 'array' },
      { id: 2, name: 'Hash Table', slug: 'hash-table' },
    ].slice(0, Math.floor(Math.random() * 2) + 1),
    topics: [
       { id: 1, name: 'Algorithms', slug: 'algorithms' } 
    ],
    status,
    acceptanceRate,
  };
});

