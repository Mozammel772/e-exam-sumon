import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const lectureShitPackagesSlice = createApi({
  reducerPath: "lectureShitPackages",
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://api.eexamapp.com/api",
    baseUrl: import.meta.env.VITE_main_url,
  }),
  tagTypes: ["lectureShitPackages"],
  endpoints: (builder) => ({
    createALectureShitPackage: builder.mutation({
      query: (paymentInfo) => ({
        url: "/lecture-shit-packages",
        method: "POST",
        body: paymentInfo,
      }),
      invalidatesTags: ["lectureShitPackages"],
    }),

    getAllLectureShitPackages: builder.query({
      query: (token) => ({
        url: "/lecture-shit-packages",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["lectureShitPackages"],
    }),

    getLectureShitPackagesOfAnUser: builder.query({
      query: (email) => ({
        url: `/lecture-shit-packages/by-email?email=${email}`,
      }),
      providesTags: ["lectureShitPackages"],
    }),

    lectureShitPackageDelete: builder.mutation({
      query: ({ id, token }) => ({
        url: `/lecture-shit-packages/${id}`,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "DELETE",
      }),
      invalidatesTags: ["lectureShitPackages"],
    }),
  }),
});

export const {
  useCreateALectureShitPackageMutation,
  useGetAllLectureShitPackagesQuery,
  useLectureShitPackageDeleteMutation,
  useGetLectureShitPackagesOfAnUserQuery,
} = lectureShitPackagesSlice;
