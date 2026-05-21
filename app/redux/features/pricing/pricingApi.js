import baseApi from "../../api/baseApi";

export const pricingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPricing: builder.query({
      query: () => ({
        url: "/admin/pricing",
        method: "GET",
      }),
      providesTags: ["pricing"],
    }),
    createPricing: builder.mutation({
      query: (data) => ({
        url: "/admin/pricing",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["pricing"],
    }),
    updatePricing: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/pricing/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["pricing"],
    }),
    patchPricing: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/pricing/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["pricing"],
    }),
    deletePricing: builder.mutation({
      query: (id) => ({
        url: `/admin/pricing/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["pricing"],
    }),
    
    // Global Features Pool
    getGlobalFeatures: builder.query({
      query: () => ({
        url: "/admin/pricing-features",
        method: "GET",
      }),
      providesTags: ["pricing"],
    }),
    createGlobalFeature: builder.mutation({
      query: (data) => ({
        url: "/admin/pricing-features",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["pricing"],
    }),
    updateGlobalFeature: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/pricing-features/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["pricing"],
    }),
    deleteGlobalFeature: builder.mutation({
      query: (id) => ({
        url: `/admin/pricing-features/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["pricing"],
    }),
  }),
});

export const {
  useGetPricingQuery,
  useCreatePricingMutation,
  useUpdatePricingMutation,
  usePatchPricingMutation,
  useDeletePricingMutation,
  useGetGlobalFeaturesQuery,
  useCreateGlobalFeatureMutation,
  useUpdateGlobalFeatureMutation,
  useDeleteGlobalFeatureMutation,
} = pricingApi;
