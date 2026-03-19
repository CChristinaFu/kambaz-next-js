import { createSlice } from "@reduxjs/toolkit";
import { enrollments } from "../database";         

const initialState = {
  enrollments: enrollments,                        
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    enroll: (state, { payload: { userId, courseId } }) => {
      state.enrollments = [                         
        ...state.enrollments,
        { _id: new Date().getTime().toString(), user: userId, course: courseId },
      ] as any;
    },
    unenroll: (state, { payload: { userId, courseId } }) => {
      state.enrollments = state.enrollments.filter( 
        (e: any) => !(e.user === userId && e.course === courseId)
      );
    },
  },
});

export const { enroll, unenroll } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;
