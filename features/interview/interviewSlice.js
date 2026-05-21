"use client";

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentForm: {
    jobPosition: "",
    department: "",
    location: "Remote",
    jobDescription: "",
    duration: "",
    type: "",
    gmailFetch: false,
    ocrParsing: false,
    autoSendLink: true,
    questions: [],
    isEditing: false,
    editInterviewId: null,
    budget_min: "",
    budget_max: "",
    currency: "USD",
  },
  interviewsAutomation: {},
};

export const interviewSlice = createSlice({
  name: "interview",
  initialState,
  reducers: {
    updateForm: (state, action) => {
      state.currentForm = { ...state.currentForm, ...action.payload };
    },
    saveInterviewAutomation: (state, action) => {
      const { interviewId, settings } = action.payload;
      state.interviewsAutomation[interviewId] = settings;
    },
    resetForm: (state) => {
      state.currentForm = initialState.currentForm;
    },
  },
});

export const { updateForm, saveInterviewAutomation, resetForm } = interviewSlice.actions;
export default interviewSlice.reducer;
