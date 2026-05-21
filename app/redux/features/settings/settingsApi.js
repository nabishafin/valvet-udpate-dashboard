import baseApi from "../../api/baseApi";

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get Settings
    getSettings: builder.query({
      query: () => ({
        url: "/admin/settings",
        method: "GET",
      }),
      providesTags: ["settings"],
    }),

    // 2. Update Settings
    updateSettings: builder.mutation({
      query: (body) => ({
        url: "/admin/settings",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["settings"],
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} = settingsApi;

export default settingsApi;
