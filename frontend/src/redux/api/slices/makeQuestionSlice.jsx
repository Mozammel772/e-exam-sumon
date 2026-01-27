import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const makeQuestionSlice = createApi({
  reducerPath: "make-question",
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://api.eexamapp.com/api",
    baseUrl: import.meta.env.VITE_main_url,
  }),
  tagTypes: ["make-question"],
  endpoints: (builder) => ({
    createYourQuestion: builder.mutation({
      query: (questionInfo) => ({
        url: "/make-question",
        method: "POST",
        body: questionInfo,
      }),
      invalidatesTags: ["make-question"],
    }),

    getAnUserOwnQuestions: builder.query({
      query: (email) => ({
        url: `/make-question/${email}`,
      }),
      providesTags: ["make-question"],
    }),

    // getAClass: builder.query({
    //   query: (classId) => ({
    //     url: `/class/${classId}/`,
    //   }),
    //   providesTags: ["class"],
    // }),

    // examStatusUpdate: builder.mutation({
    //   query: ({ newStatus, token, examId }) => ({
    //     url: `/exam/${examId}`,
    //     headers: {
    //       "content-type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //     },
    //     method: "PUT",
    //     body: newStatus,
    //   }),
    //   invalidatesTags: ["exam"],
    // }),

    // classInfoUpdate: builder.mutation({
    //   query: ({ formData, token, updateClassId }) => ({
    //     url: `/class/${updateClassId}`,
    //     headers: {
    //       "content-type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //     },
    //     method: "PUT",
    //     body: formData,
    //   }),
    //   invalidatesTags: ["class"],
    // }),

    // examDelete: builder.mutation({
    //   query: ({ examId, token }) => ({
    //     url: `/exam/${examId}`,
    //     headers: {
    //       "content-type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //     },
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["exam"],
    // }),
  }),
});

export const { useCreateYourQuestionMutation, useGetAnUserOwnQuestionsQuery } =
  makeQuestionSlice;
