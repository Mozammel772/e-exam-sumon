import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const readyQuestionsSetSlice = createApi({
  reducerPath: "readyQuestionsSet",
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://api.eexamapp.com/api",
    baseUrl: import.meta.env.VITE_main_url,
  }),
  tagTypes: ["readyQuestionsSet"],
  endpoints: (builder) => ({
    createAReadyQuestionSets: builder.mutation({
      query: (paymentInfo) => ({
        url: "/ready-question-sets",
        method: "POST",
        body: paymentInfo,
      }),
      invalidatesTags: ["readyQuestionsSet"],
    }),

    getAllReadyQuestionsSets: builder.query({
      query: (token) => ({
        url: "/ready-question-sets",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["readyQuestionsSet"],
    }),

    getReadyQuesSetsAnUser: builder.query({
      query: (email) => ({
        url: `/ready-question-sets/by-email?email=${email}`,
      }),
      providesTags: ["readyQuestionsSet"],
    }),

    readyQuesSetDelete: builder.mutation({
      query: ({ id, token }) => ({
        url: `/ready-question-sets/${id}`,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "DELETE",
      }),
      invalidatesTags: ["readyQuestionsSet"],
    }),
  }),
});

export const {
  useCreateAReadyQuestionSetsMutation,
  useGetAllReadyQuestionsSetsQuery,
  useReadyQuesSetDeleteMutation,
  useGetReadyQuesSetsAnUserQuery,
} = readyQuestionsSetSlice;
