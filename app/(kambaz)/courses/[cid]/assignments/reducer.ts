// app/(kambaz)/courses/[cid]/assignments/reducer.ts
import { createSlice } from "@reduxjs/toolkit";        // import createSlice
import { assignments } from "../../../database";        // import assignments from database
import { v4 as uuidv4 } from "uuid";

const initialState = {
  assignments: assignments,                             // declare initial state with default assignments
};

const assignmentsSlice = createSlice({
  name: "assignments",                                  // name the slice
  initialState,                                         // set initial state
  reducers: {
    addAssignment: (state, { payload: assignment }) => {// new assignment is in action.payload
      const newAssignment: any = {
        ...assignment,
        _id: uuidv4(),                                  // override _id with unique id
      };
      state.assignments = [                             // update assignments in state
        ...state.assignments, newAssignment] as any;
    },
    deleteAssignment: (state, { payload: assignmentId }) => { // assignment ID to delete is in action.payload
      state.assignments = state.assignments.filter(
        (a: any) => a._id !== assignmentId              // filter out assignment to delete
      );
    },
    updateAssignment: (state, { payload: assignment }) => {   // assignment to update is in action.payload
      state.assignments = state.assignments.map((a: any) =>   // replace assignment whose ID matches
        a._id === assignment._id ? assignment : a
      ) as any;
    },
  },
});

export const { addAssignment, deleteAssignment, updateAssignment } =  // export reducer functions
  assignmentsSlice.actions;
export default assignmentsSlice.reducer;                // export reducer for store
