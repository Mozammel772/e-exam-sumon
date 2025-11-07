import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const announcementSlice = createApi({
  reducerPath: "announcements",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_main_url,
  }),
  tagTypes: ["announcements"],
  endpoints: (builder) => ({
    createAAnnouncement: builder.mutation({
      query: ({ message, token }) => ({
        url: "/announcements",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: message,
      }),
      invalidatesTags: ["announcements"],
    }),

    getAllMessage: builder.query({
      query: () => ({
        url: "/announcements",
      }),
      providesTags: ["announcements"],
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

    announceDelete: builder.mutation({
      query: ({ messageId, token }) => ({
        url: `/announcements/${messageId}`,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "DELETE",
      }),
      invalidatesTags: ["announcements"],
    }),
  }),
});

export const {
  useCreateAAnnouncementMutation,
  useGetAllMessageQuery,
  useAnnounceDeleteMutation,
} = announcementSlice;
