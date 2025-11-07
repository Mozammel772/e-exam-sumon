import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const classSlice = createApi({
  reducerPath: "class",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:5555/api",
    baseUrl: import.meta.env.VITE_main_url,
  }),
  tagTypes: ["class"],
  endpoints: (builder) => ({
    createAClass: builder.mutation({
      query: ({ formData, token }) => ({
        url: "/class",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["class"],
    }),

    getAllClasses: builder.query({
      query: () => ({
        url: "/class",
      }),
      providesTags: ["class"],
    }),

    getAClass: builder.query({
      query: (classId) => ({
        url: `/class/${classId}/`,
      }),
      providesTags: ["class"],
    }),

    classUpdate: builder.mutation({
      query: ({ classStatus, token, classId }) => ({
        url: `/class/${classId}`,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "PUT",
        body: classStatus,
      }),
      invalidatesTags: ["class"],
    }),

    classInfoUpdate: builder.mutation({
      query: ({ formData, token, updateClassId }) => ({
        url: `/class/${updateClassId}`,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["class"],
    }),

    classDelete: builder.mutation({
      query: ({ classId, token }) => ({
        url: `/class/${classId}`,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "DELETE",
      }),
      invalidatesTags: ["class"],
    }),
  }),
});

export const {
  useCreateAClassMutation,
  useGetAllClassesQuery,
  useClassUpdateMutation,
  useClassDeleteMutation,
  useGetAClassQuery,
  useClassInfoUpdateMutation,
} = classSlice;
