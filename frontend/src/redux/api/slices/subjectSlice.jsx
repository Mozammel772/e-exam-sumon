import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const subjectSlice = createApi({
  reducerPath: "subject",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:5555/api",
    baseUrl: import.meta.env.VITE_main_url,
  }),
  tagTypes: ["subject"],
  endpoints: (builder) => ({
    createASubject: builder.mutation({
      query: ({ formData, token }) => ({
        url: "/subject",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["subject"],
    }),

    getAllSubjects: builder.query({
      query: () => ({
        url: "/subject",
      }),
      providesTags: ["subject"],
    }),

    getASubject: builder.query({
      query: (changeSubjectId) => ({
        url: `/subject/${changeSubjectId}`,
      }),
      providesTags: ["subject"],
    }),

    subjectStatusUpdate: builder.mutation({
      query: ({ subjectStatus, token, subjectId }) => ({
        url: `/subject/${subjectId}`,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "PUT",
        body: subjectStatus,
      }),
      invalidatesTags: ["subject"],
    }),

    subjectInfoUpdate: builder.mutation({
      query: ({ formData, token, changeSubjectId }) => ({
        url: `/subject/${changeSubjectId}`,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["subject"],
    }),

    subjectDelete: builder.mutation({
      query: ({ subjectId, token }) => ({
        url: `/subject/${subjectId}`,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "DELETE",
      }),
      invalidatesTags: ["subject"],
    }),
  }),
});

export const {
  useCreateASubjectMutation,
  useGetAllSubjectsQuery,
  useSubjectDeleteMutation,
  useSubjectStatusUpdateMutation,
  useGetASubjectQuery,
  useSubjectInfoUpdateMutation,
} = subjectSlice;
