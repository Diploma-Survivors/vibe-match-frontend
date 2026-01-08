import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

interface CreateSolutionState {
  drafts: Record<string, string>; // submissionId -> markdown content
}

const initialState: CreateSolutionState = {
  drafts: {},
};

const createSolutionSlice = createSlice({
  name: 'createSolution',
  initialState,
  reducers: {
    setDraft: (
      state,
      action: PayloadAction<{ submissionId: string; content: string }>
    ) => {
      const { submissionId, content } = action.payload;
      state.drafts[submissionId] = content;
    },
    resetDraft: (state, action: PayloadAction<string>) => {
      const submissionId = action.payload;
      delete state.drafts[submissionId];
    },
  },
});

export const { setDraft, resetDraft } = createSolutionSlice.actions;
export default createSolutionSlice.reducer;
