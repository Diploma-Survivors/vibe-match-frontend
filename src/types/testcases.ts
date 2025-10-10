export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isSample: boolean;
}

export interface TestcaseSample {
  id?: string;
  input: string;
  output: string;
  explanation?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTestcaseRequest {
  testcases: TestcaseSample[];
}

export interface CreateTestcaseFileResponse {
  id: string;
  fileUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTestcaseResponse {
  id: string;
  // Add other fields as returned by backend
}
