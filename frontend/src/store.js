import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./redux/api/slices/authSlice";
import { classSlice } from "./redux/api/slices/classSlice";
import { subjectSlice } from "./redux/api/slices/subjectSlice";
import { chapterSlice } from "./redux/api/slices/chapterSlice";
import { examSlice } from "./redux/api/slices/examSlice";
import { announcementSlice } from "./redux/api/slices/AnnouncementSlice";
import { subscriptionSlice } from "./redux/api/slices/subscriptionSlice";
import { makeQuestionSlice } from "./redux/api/slices/makeQuestionSlice";
import { examSetSlice } from "./redux/api/slices/examSetSlice";
import { readyQuestionsSetSlice } from "./redux/api/slices/readyQuestionsSetsSlice";
import { lectureShitPackagesSlice } from "./redux/api/slices/lectureShitPackages";
import { topicsSlice } from "./redux/api/slices/topicsSlice";

// import { logInApiSlice } from "../features/api/logInApiSlice";

export const store = configureStore({
  reducer: {
    [authSlice.reducerPath]: authSlice.reducer,
    [classSlice.reducerPath]: classSlice.reducer,
    [subjectSlice.reducerPath]: subjectSlice.reducer,
    [chapterSlice.reducerPath]: chapterSlice.reducer,
    [examSlice.reducerPath]: examSlice.reducer,
    [announcementSlice.reducerPath]: announcementSlice.reducer,
    [subscriptionSlice.reducerPath]: subscriptionSlice.reducer,
    [makeQuestionSlice.reducerPath]: makeQuestionSlice.reducer,
    [examSetSlice.reducerPath]: examSetSlice.reducer,
    [readyQuestionsSetSlice.reducerPath]: readyQuestionsSetSlice.reducer,
    [lectureShitPackagesSlice.reducerPath]: lectureShitPackagesSlice.reducer,
    [topicsSlice.reducerPath]: topicsSlice.reducer,
  },
  middleware: (getDefaultMiddlewares) =>
    getDefaultMiddlewares().concat(
      authSlice.middleware,
      classSlice.middleware,
      subjectSlice.middleware,
      examSlice.middleware,
      chapterSlice.middleware,
      announcementSlice.middleware,
      subscriptionSlice.middleware,
      makeQuestionSlice.middleware,
      examSetSlice.middleware,
      readyQuestionsSetSlice.middleware,
      lectureShitPackagesSlice.middleware,
      topicsSlice.middleware
    ),
});
