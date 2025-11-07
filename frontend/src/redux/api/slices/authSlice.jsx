import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authSlice = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_main_url,
  }),
  tagTypes: ["auth"],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (formData) => ({
        url: "/auth/register",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(formData),
        credentials: "include",
      }),
      invalidatesTags: [{ type: "auth", id: "LIST" }],
    }),

    login: builder.mutation({
      query: (formData) => ({
        url: "/auth/login",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "auth", id: "LIST" }],
    }),

    forgotPassword: builder.mutation({
      query: (formData) => ({
        url: "/auth/forgot-password",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "auth", id: "LIST" }],
    }),

    resetPassword: builder.mutation({
      query: ({ formData, token }) => ({
        url: `/auth/reset-password/${token}`,
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: [{ type: "auth", id: "LIST" }],
    }),

    getAllUsers: builder.query({
      query: (token) => ({
        url: "/auth/users",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((user) => ({ type: "auth", id: user._id })),
              { type: "auth", id: "LIST" },
            ]
          : [{ type: "auth", id: "LIST" }],
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
    }),

    getAUserProfile: builder.query({
      query: (token) => ({
        url: "/auth/profile",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: [{ type: "auth", id: "PROFILE" }],
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
    }),

    getAUserProfileByEmail: builder.query({
      query: (email) => ({
        url: `/auth/profile/${email}`,
      }),
      providesTags: [{ type: "auth", id: "PROFILE" }],
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
    }),

    userAddressUpdate: builder.mutation({
      query: ({ userUpdateFormData, token }) => ({
        url: `/auth/update-profile`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "PUT",
        body: userUpdateFormData,
      }),
      invalidatesTags: [{ type: "auth", id: "PROFILE" }],
    }),

    userDelete: builder.mutation({
      query: ({ userId, token }) => ({
        url: `/auth/delete/${userId}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "auth", id: userId },
        { type: "auth", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetAllUsersQuery,
  useGetAUserProfileQuery,
  useUserAddressUpdateMutation,
  useUserDeleteMutation,
  useGetAUserProfileByEmailQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authSlice;
