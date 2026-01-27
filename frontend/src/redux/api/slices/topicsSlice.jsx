import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const topicsSlice = createApi({
  reducerPath: "topics",
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://api.eexamapp.com/api",
    baseUrl: import.meta.env.VITE_main_url,
    credentials: "include",
  }),
  tagTypes: ["topics"],
  endpoints: (builder) => ({
    createATopics: builder.mutation({
      query: (formData) => ({
        url: "/topics",
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["topics"],
    }),

    getAllTopics: builder.query({
      query: () => {
        return {
          url: `/topics`,
        };
      },
      providesTags: ["topics"],
    }),

    getATopic: builder.query({
      query: (topicsId) => ({
        url: `/topics/${topicsId}`,
      }),
      providesTags: ["topics"],
    }),

    topicUpdate: builder.mutation({
      query: ({ updateData, topicId }) => ({
        url: `/topics/${topicId}`,
        headers: {
          "content-type": "application/json",
        },
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: ["topics"],
    }),

    topicDelete: builder.mutation({
      query: (topicId) => ({
        url: `/topics/${topicId}`,
        headers: {
          "content-type": "application/json",
        },
        method: "DELETE",
      }),
      invalidatesTags: ["topics"],
    }),
  }),
});

export const {
  useCreateATopicsMutation,
  useGetATopicQuery,
  useGetAllTopicsQuery,
  useTopicDeleteMutation,
  useTopicUpdateMutation,
} = topicsSlice;
