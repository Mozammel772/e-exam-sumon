import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const subscriptionSlice = createApi({
  reducerPath: "subscription",
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://api.eexamapp.com/api",
    baseUrl: import.meta.env.VITE_main_url,
  }),
  tagTypes: ["subscription"],
  endpoints: (builder) => ({
    createASubscription: builder.mutation({
      query: (subscriptionData) => ({
        url: "/subscription",
        method: "POST",
        body: subscriptionData,
      }),
      invalidatesTags: ["subscription"],
    }),

    getAllSubscriptions: builder.query({
      query: (token) => ({
        url: "/subscription",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["subscription"],
    }),

    getASubscriptionInfoOfAnUser: builder.query({
      query: (email) => ({
        url: `/subscription/user/${email}`,
      }),
      providesTags: ["subscription"],
    }),

    subscriptionStatusUpdate: builder.mutation({
      query: ({ newStatus, token, subscriptionId }) => ({
        url: `/subscription/${subscriptionId}`,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "PUT",
        body: newStatus,
      }),
      invalidatesTags: ["subscription"],
    }),

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

    subscriptionDelete: builder.mutation({
      query: ({ subscriptionId, token }) => ({
        url: `/subscription/${subscriptionId}`,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "DELETE",
      }),
      invalidatesTags: ["subscription"],
    }),
  }),
});

export const {
  useGetASubscriptionInfoOfAnUserQuery,
  useCreateASubscriptionMutation,
  useGetAllSubscriptionsQuery,
  useSubscriptionStatusUpdateMutation,
  useSubscriptionDeleteMutation,
} = subscriptionSlice;
