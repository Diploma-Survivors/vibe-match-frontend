import { type Contest, INITIAL_CONTEST } from '@/types/contests';
import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '..';

type ContestState = Contest | null;
const initialState: ContestState = INITIAL_CONTEST;

const contestSlice = createSlice({
  name: 'contest',
  initialState,
  reducers: {
    setContest: (state, action: PayloadAction<Contest>) => action.payload,
  },
});

export const { setContest } = contestSlice.actions;
export const selectContest = (state: RootState) => state.contest;
export default contestSlice.reducer;
