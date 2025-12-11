import { INITIAL_PROBLEM, type ProblemDescription } from '@/types/problems';
import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '..';

type ProblemState = ProblemDescription | null;
const initialState: ProblemState = INITIAL_PROBLEM;

const ProblemSlice = createSlice({
  name: 'problem',
  initialState,
  reducers: {
    setProblem: (state, action: PayloadAction<ProblemDescription>) =>
      action.payload,
  },
});

export const { setProblem } = ProblemSlice.actions;
export const selectProblem = (state: RootState) => state.problem;
export default ProblemSlice.reducer;
