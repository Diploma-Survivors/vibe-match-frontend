import { ProblemDifficulty, type ProblemDescription, ProblemStatus } from '@/types/problems';

export const MOCK_PROBLEM_DETAIL: ProblemDescription = {
  id: "1",
  title: "Two Sum",
  description: "Given an array of integers `nums` and an integer `target`, return *indices of the two numbers such that they add up to `target`*.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the *same* element twice.\n\nYou can return the answer in any order.",
  inputDescription: "**Input:** nums = [2,7,11,15], target = 9",
  outputDescription: "**Output:** [0,1]",
  maxScore: 10,
  timeLimitMs: 1000,
  memoryLimitKb: 128000,
  difficulty: ProblemDifficulty.EASY,
  createdAt: "2023-01-01T00:00:00Z",
  updatedAt: "2023-01-01T00:00:00Z",
  testcaseSamples: [
    {
      id: "1",
      input: "2\n3 3",
      output: "6",
      explanation: "3 + 3 = 6"
    },
    {
      id: "2",
      input: "2\n1 2",
      output: "3",
      explanation: "1 + 2 = 3"
    }
  ],
  topics: [
    { 
      id: 1, 
      name: "Array", 
      description: "Array topic", 
      createdAt: new Date("2023-01-01T00:00:00Z"), 
      updatedAt: new Date("2023-01-01T00:00:00Z") 
    },
    { 
      id: 2, 
      name: "Hash Table", 
      description: "Hash Table topic", 
      createdAt: new Date("2023-01-01T00:00:00Z"), 
      updatedAt: new Date("2023-01-01T00:00:00Z") 
    }
  ],
  tags: [
    { 
      id: 1, 
      name: "Google", 
      createdAt: new Date("2023-01-01T00:00:00Z"), 
      updatedAt: new Date("2023-01-01T00:00:00Z") 
    }
  ],
  status: ProblemStatus.UNSOLVED
};
