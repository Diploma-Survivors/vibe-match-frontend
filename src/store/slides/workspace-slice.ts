import type { SampleTestcase } from '@/types/testcases';
import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '..'; // Adjust path as needed

// CHANGED: CodeMap now maps LanguageID (number) directly to Code (string)
export type CodeMap = Record<number, string>;

export interface Workspace {
  // Key: problemId -> Value: languageId (number)
  // This tracks which language is currently ACTIVE in the editor
  currentLanguage: Record<string, number>;

  // Key: problemId -> Value: CodeMap
  // Example: { "101": { 63: "console.log('hi')", 71: "print('hi')" } }
  currentCode: Record<string, CodeMap>;

  // Key: problemId -> Value: Array of test cases
  currentSampleTestCases: Record<string, SampleTestcase[]>;
}

const INITIAL_WORKSPACE: Workspace = {
  currentLanguage: {},
  currentCode: {},
  currentSampleTestCases: {},
};

type WorkspaceState = Workspace;
const initialState: WorkspaceState = INITIAL_WORKSPACE;

const WorkspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    // 1. Update Current Active Language
    updateCurrentLanguage: (
      state,
      action: PayloadAction<{ problemId: string; languageId: number }>
    ) => {
      const { problemId, languageId } = action.payload;
      state.currentLanguage[problemId] = languageId;
    },

    // 2. Update Current Code
    // CHANGED: Uses languageId as the key. No slug needed.
    updateCurrentCode: (
      state,
      action: PayloadAction<{
        problemId: string;
        languageId: number;
        code: string;
      }>
    ) => {
      const { problemId, languageId, code } = action.payload;

      // Initialize the map for this problem if it doesn't exist
      if (!state.currentCode[problemId]) {
        state.currentCode[problemId] = {};
      }

      // Store code directly under the languageId key
      state.currentCode[problemId][languageId] = code;
    },

    // 3. Update Sample Test Cases
    updateCurrentSampleTestCases: (
      state,
      action: PayloadAction<{ problemId: string; testCases: SampleTestcase[] }>
    ) => {
      const { problemId, testCases } = action.payload;
      state.currentSampleTestCases[problemId] = testCases;
    },

    // 4. Update Single Test Case Field
    updateSingleTestCase: (
      state,
      action: PayloadAction<{
        problemId: string;
        index: number;
        field: keyof SampleTestcase;
        value: any;
      }>
    ) => {
      const { problemId, index, field, value } = action.payload;
      const testCases = state.currentSampleTestCases[problemId];

      if (testCases?.[index]) {
        (testCases[index] as any)[field] = value;
      }
    },

    setWorkspace: (state, action: PayloadAction<Workspace>) => action.payload,
  },
});

export const {
  setWorkspace,
  updateCurrentLanguage,
  updateCurrentCode,
  updateCurrentSampleTestCases,
  updateSingleTestCase,
} = WorkspaceSlice.actions;

export const selectWorkspace = (state: RootState) => state.workspace;

export const selectCodeForProblem = (
  state: RootState,
  problemId: string,
  languageId: number
) => state.workspace.currentCode[problemId]?.[languageId];

export default WorkspaceSlice.reducer;
