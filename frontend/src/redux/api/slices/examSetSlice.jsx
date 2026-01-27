import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const examSetSlice = createApi({
  reducerPath: "examSet",
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://api.eexamapp.com/api",
    baseUrl: import.meta.env.VITE_main_url,
  }),
  tagTypes: ["examSet"],
  endpoints: (builder) => ({
    createAExamSet: builder.mutation({
      query: (newData) => ({
        url: "/exam-sets",
        method: "POST",
        body: newData,
      }),
      invalidatesTags: ["examSet"],
    }),

    getExamSetWithCredentials: builder.query({
      query: ({ email, examSetId }) => ({
        url: `/exam-sets/${email}/${examSetId}`,
      }),
      providesTags: ["examSet"],
    }),

    getExamSetsAnUser: builder.query({
      query: (email) => ({
        url: `/exam-sets/user/${email}/`,
      }),
      providesTags: ["examSet"],
    }),

    getAnExamSets: builder.query({
      query: (examSetId) => ({
        url: `/exam-sets/${examSetId}/`,
      }),
      providesTags: ["examSet"],
    }),

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

    questionsUpdate: builder.mutation({
      query: ({ data, examSetId }) => ({
        url: `/exam-sets/update-questions/${examSetId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["examSet"],
    }),

    demoQuestionsUpdate: builder.mutation({
      query: ({ data, examSetId }) => ({
        url: `/exam-sets/demo/update-questions/${examSetId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["examSet"],
    }),

    examSetDelete: builder.mutation({
      query: (examId) => ({
        url: `/exam-sets/${examId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["examSet"],
    }),
  }),
});

export const {
  useCreateAExamSetMutation,
  useGetExamSetWithCredentialsQuery,
  useQuestionsUpdateMutation,
  useGetExamSetsAnUserQuery,
  useGetAnExamSetsQuery,
  useExamSetDeleteMutation,
  useDemoQuestionsUpdateMutation,
} = examSetSlice;
