import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chapterSlice = createApi({
  reducerPath: "chapter",
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://api.eexamapp.com/api",
    baseUrl: import.meta.env.VITE_main_url,
    credentials: "include",
  }),
  tagTypes: ["chapter"],
  endpoints: (builder) => ({
    createAChapter: builder.mutation({
      query: ({ formData, token }) => ({
        url: "/chapter",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["chapter"],
    }),

    createAMcqQuestion: builder.mutation({
      query: ({ formData, token, chapterId }) => ({
        url: `/chapter/${chapterId}/question`,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["chapter"],
    }),

    createACqQuestion: builder.mutation({
      query: ({ formData, token, chapterId }) => {
        return {
          url: `/chapter/${chapterId}/cq-question`,
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        };
      },
      invalidatesTags: ["chapter"],
    }),
    createAShortQuestion: builder.mutation({
      query: ({ formData, token, chapterId }) => {
        return {
          url: `/chapter/${chapterId}/short-question`,
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        };
      },
      invalidatesTags: ["chapter"],
    }),

    getAllChapters: builder.query({
      query: ({ page, limit, className, subjectId }) => {
        const params = new URLSearchParams();

        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        if (className) params.append("className", className);
        if (subjectId) params.append("subjectId", subjectId);

        return {
          url: `/chapter?${params.toString()}`,
        };
      },
      providesTags: ["chapter"],
    }),

    getAllChaptersWithOutQuery: builder.query({
      query: () => {
        return {
          url: `/chapter/all`,
        };
      },
      providesTags: ["chapter"],
    }),

    getAChapter: builder.query({
      query: (chapterId) => ({
        url: `/chapter/${chapterId}`,
      }),
      providesTags: ["chapter"],
    }),

    getAQuestion: builder.query({
      query: ({ chapterId, questionId }) => ({
        url: `/chapter/${chapterId}/${questionId}`,
      }),
      providesTags: ["chapter"],
    }),

    chapterStatusUpdate: builder.mutation({
      query: ({ formattedStatus, token, chapterId }) => ({
        url: `/chapter/${chapterId}`,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "PUT",
        body: formattedStatus,
      }),
      invalidatesTags: ["chapter"],
    }),

    chapterInfoUpdate: builder.mutation({
      query: ({ formData, token, chapterId }) => ({
        url: `/chapter/${chapterId}`,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["chapter"],
    }),

    questionInfoUpdate: builder.mutation({
      query: ({ formData, token, chapterId, questionId }) => ({
        url: `/chapter/${chapterId}/question/${questionId}`,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["chapter"],
    }),

    chapterDelete: builder.mutation({
      query: ({ chapterId, token }) => ({
        url: `/chapter/${chapterId}`,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "DELETE",
      }),
      invalidatesTags: ["chapter"],
    }),

    questionDelete: builder.mutation({
      query: ({ chapterId, questionId, token }) => ({
        url: `/chapter/${chapterId}/question/${questionId}`,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "DELETE",
      }),
      invalidatesTags: ["chapter"],
    }),

    getAllDesireQuestions: builder.query({
      query: ({
        email,
        subjectClassName,
        subjectName,
        chapterId,
        examType,
        // subscription,
      }) => {
        const params = new URLSearchParams();

        if (email) params.append("email", email);
        if (subjectClassName)
          params.append("subjectClassName", subjectClassName);
        if (subjectName) params.append("subjectName", subjectName);
        if (examType) params.append("examType", examType);
        // if (subscription !== undefined)
        //   params.append("subscription", subscription);

        if (chapterId?.length) {
          params.append("ids", chapterId.join(","));
        }

        return {
          url: `/chapter/questions?${params.toString()}`,
        };
      },
      providesTags: ["chapter"],
    }),
  }),
});

export const {
  useCreateAChapterMutation,
  useGetAllChaptersQuery,
  useChapterDeleteMutation,
  useChapterStatusUpdateMutation,
  useGetAChapterQuery,
  useChapterInfoUpdateMutation,
  useCreateAMcqQuestionMutation,
  useQuestionDeleteMutation,
  useGetAllDesireQuestionsQuery,
  useQuestionInfoUpdateMutation,
  useCreateACqQuestionMutation,
  useGetAQuestionQuery,
  useGetAllChaptersWithOutQueryQuery,
  useCreateAShortQuestionMutation,
} = chapterSlice;
