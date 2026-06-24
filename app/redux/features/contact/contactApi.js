import baseApi from "../../api/baseApi";

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllContact: builder.query({
      query: ({ search = '', status = '', page = 1, limit = 10 } = {}) => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (status) params.append('status', status);
        params.append('page', page);
        params.append('limit', limit);
        return { url: `/admin/contact?${params.toString()}`, method: "GET" };
      },
      providesTags: ["contact"],
    }),
    updateContactStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/contact/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["contact"],
    }),
    deleteContact: builder.mutation({
      query: (id) => ({ url: `/admin/contact/${id}`, method: "DELETE" }),
      invalidatesTags: ["contact"],
    }),
  }),
});

export const {
  useGetAllContactQuery,
  useUpdateContactStatusMutation,
  useDeleteContactMutation,
} = contactApi;
