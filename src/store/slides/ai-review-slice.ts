import { AIService } from '@/services/ai-service';
import {
  type PayloadAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';

interface AIReviewState {
  isVisible: boolean;
  customPrompt: string;
  isCustomizing: boolean;
  aiResponse: string | null;
  isLoading: boolean;
  error: string | null;
}

const DEFAULT_PROMPT =
  'Vui lòng xem xét bài nộp mã nguồn này. Hãy phân tích độ phức tạp thời gian và bộ nhớ, chỉ ra các lỗi tiềm ẩn hoặc các trường hợp biên, và đề xuất cải thiện về khả năng đọc cũng như hiệu năng. ';
const initialState: AIReviewState = {
  isVisible: false,
  customPrompt: DEFAULT_PROMPT,
  isCustomizing: false,
  aiResponse: null,
  isLoading: false,
  error: null,
};

export const generateAIReview = createAsyncThunk(
  'aiReview/generate',
  async ({
    submissionId,
    prompt,
    code,
  }: { submissionId: string; prompt: string; code: string }) => {
    const response = await AIService.generateReview(submissionId, prompt, code);
    return response;
  }
);

const aiReviewSlice = createSlice({
  name: 'aiReview',
  initialState,
  reducers: {
    toggleVisibility: (state) => {
      state.isVisible = !state.isVisible;
    },
    setCustomPrompt: (state, action: PayloadAction<string>) => {
      state.customPrompt = action.payload;
    },
    setIsCustomizing: (state, action: PayloadAction<boolean>) => {
      state.isCustomizing = action.payload;
    },
    resetPrompt: (state) => {
      state.customPrompt = DEFAULT_PROMPT;
    },
    resetReview: (state) => {
      state.aiResponse = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateAIReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateAIReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.aiResponse = action.payload;
      })
      .addCase(generateAIReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to generate review';
      });
  },
});

export const {
  toggleVisibility,
  setCustomPrompt,
  setIsCustomizing,
  resetPrompt,
  resetReview,
} = aiReviewSlice.actions;
export default aiReviewSlice.reducer;
