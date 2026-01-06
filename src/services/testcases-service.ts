import clientApi from '@/lib/apis/axios-client';
import type {
  CreateTestcaseFileResponse,
  CreateTestcaseResponse,
  SampleTestCase,
} from '@/types/testcases';

// Create test cases from array (returns testcase ID)
async function createTestcase(
  testcases: SampleTestCase[]
): Promise<CreateTestcaseResponse> {
  try {
    const response = await clientApi.post('/testcases', { testcases });
    return response.data.data;
  } catch (error) {
    console.error('Error creating testcase:', error);
    throw error;
  }
}

// Create testcase by uploading file
async function createTestcaseFile(
  file: File
): Promise<CreateTestcaseFileResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const response = await clientApi.post('/testcases', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true, // Include cookies if needed
    });
    return response.data.data;
  } catch (error) {
    console.error('Error uploading testcase file:', error);
    throw error;
  }
}

// Cache management for testcase responses
const testcaseStorage = new Map<string, CreateTestcaseFileResponse>();

function saveTestcaseToCache(
  key: string,
  response: CreateTestcaseFileResponse
): void {
  testcaseStorage.set(key, response);
  // Optional: Set expiration time (e.g., 1 hour)
  setTimeout(
    () => {
      testcaseStorage.delete(key);
    },
    60 * 60 * 1000
  ); // 1 hour expiration
}

function getTestcaseFromCache(key: string): CreateTestcaseFileResponse | null {
  return testcaseStorage.get(key) || null;
}

function clearTestcaseCache(): void {
  testcaseStorage.clear();
}

// Helper method to generate cache key for file
function generateCacheKey(file: File): string {
  return `testcase_${file.name}_${file.size}_${file.lastModified}`;
}

// Complete testcase creation workflow with caching
async function createTestcaseComplete(file: File): Promise<string> {
  try {
    // Check if we have a cached testcase response for this file
    const cacheKey = generateCacheKey(file);
    const cachedResponse = getTestcaseFromCache(cacheKey);

    if (cachedResponse) {
      return cachedResponse.id;
    }
    // Upload new testcase and cache the result
    const testcaseResponse = await createTestcaseFile(file);
    saveTestcaseToCache(cacheKey, testcaseResponse);
    return testcaseResponse.id;
  } catch (error) {
    console.error('Error in complete testcase creation:', error);
    throw error;
  }
}

export const TestcasesService = {
  createTestcase,
  createTestcaseFile,
  createTestcaseComplete,
  saveTestcaseToCache,
  getTestcaseFromCache,
  clearTestcaseCache,
};
