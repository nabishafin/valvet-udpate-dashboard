import baseApi from "../../api/baseApi";

export const subscribersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubscribers: builder.query({
      query: ({ search = '', status = '', page = 1, limit = 10 } = {}) => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (status) params.append('status', status);
        params.append('page', page);
        params.append('limit', limit);
        return { url: `/admin/subscribers?${params.toString()}`, method: "GET" };
      },
      providesTags: ["subscribers"],
    }),
    getSubscriberCount: builder.query({
      query: (status = '') => {
        const params = new URLSearchParams({ page: 1, limit: 1 });
        if (status) params.append('status', status);
        return { url: `/admin/subscribers?${params.toString()}`, method: "GET" };
      },
      providesTags: ["subscribers"],
    }),
    updateSubscriberStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/subscribers/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["subscribers"],
    }),
    deleteSubscriber: builder.mutation({
      query: (id) => ({ url: `/admin/subscribers/${id}`, method: "DELETE" }),
      invalidatesTags: ["subscribers"],
    }),
  }),
});

export const {
  useGetAllSubscribersQuery,
  useGetSubscriberCountQuery,
  useUpdateSubscriberStatusMutation,
  useDeleteSubscriberMutation,
} = subscribersApi;
