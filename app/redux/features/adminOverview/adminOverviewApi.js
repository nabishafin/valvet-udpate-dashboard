import baseApi from "../../api/baseApi";

export const adminOverviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => ({
        url: "/admin/stats", // Based on backend route: router.get('/stats', getDashboardStats)
        method: "GET",
      }),
      providesTags: ["dashboardStats"],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = adminOverviewApi;
export default adminOverviewApi;
