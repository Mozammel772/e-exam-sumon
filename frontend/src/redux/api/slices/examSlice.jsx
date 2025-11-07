import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const examSlice = createApi({
  reducerPath: "exam",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:5555/api",
    baseUrl: import.meta.env.VITE_main_url,
  }),
  tagTypes: ["exam"],
  endpoints: (builder) => ({
    createAExam: builder.mutation({
      query: ({ examInfo, token }) => ({
        url: "/exam",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: examInfo,
      }),
      invalidatesTags: ["exam"],
    }),

    getAllExams: builder.query({
      query: () => ({
        url: "/exam",
      }),
      providesTags: ["exam"],
    }),

    // getAClass: builder.query({
    //   query: (classId) => ({
    //     url: `/class/${classId}/`,
    //   }),
    //   providesTags: ["class"],
    // }),

    examStatusUpdate: builder.mutation({
      query: ({ newStatus, token, examId }) => ({
        url: `/exam/${examId}`,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "PUT",
        body: newStatus,
      }),
      invalidatesTags: ["exam"],
    }),

    examDelete: builder.mutation({
      query: ({ examId, token }) => ({
        url: `/exam/${examId}`,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "DELETE",
      }),
      invalidatesTags: ["exam"],
    }),
  }),
});

export const {
  useCreateAExamMutation,
  useGetAllExamsQuery,
  useExamDeleteMutation,
  useExamStatusUpdateMutation,
} = examSlice;
