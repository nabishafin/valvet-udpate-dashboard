import baseApi from "../../api/baseApi";

export const instantBookingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get All Instant Bookings
    getAllInstantBookings: builder.query({
      query: ({ search = '', status = 'all', page = 1, limit = 10 } = {}) => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (status && status !== 'all') params.append('status', status);
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);
        
        return {
          url: `/admin/instant-bookings?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["instant-bookings"],
    }),

    // 2. Update Status
    updateInstantBookingStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/instant-bookings/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["instant-bookings", "dashboardStats"],
    }),

    // 3. Delete Instant Booking
    deleteInstantBooking: builder.mutation({
      query: (id) => ({
        url: `/admin/instant-bookings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["instant-bookings", "dashboardStats"],
    }),
  }),
});

export const {
  useGetAllInstantBookingsQuery,
  useUpdateInstantBookingStatusMutation,
  useDeleteInstantBookingMutation,
} = instantBookingsApi;

export default instantBookingsApi;
