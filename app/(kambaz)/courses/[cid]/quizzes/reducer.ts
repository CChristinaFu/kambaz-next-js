import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface QuizzesState {
  quizzes: any[];
}

const initialState: QuizzesState = {
  quizzes: [],
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes: (state, action: PayloadAction<any[]>) => {
      state.quizzes = action.payload;
    },
    addQuiz: (state, action: PayloadAction<any>) => {
      state.quizzes = [...state.quizzes, action.payload];
    },
    updateQuiz: (state, action: PayloadAction<any>) => {
      state.quizzes = state.quizzes.map((q) =>
        q._id === action.payload._id ? action.payload : q
      );
    },
    deleteQuiz: (state, action: PayloadAction<string>) => {
      state.quizzes = state.quizzes.filter((q) => q._id !== action.payload);
    },
  },
});

export const { setQuizzes, addQuiz, updateQuiz, deleteQuiz } =
  quizzesSlice.actions;

export default quizzesSlice.reducer;