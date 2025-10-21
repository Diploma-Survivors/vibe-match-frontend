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

// UI-only type: enriches TestcaseSample with required id and local editing state
export type UITestcaseSample = TestcaseSample & {
  id: string;
  isEditing: boolean;
};

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
}
