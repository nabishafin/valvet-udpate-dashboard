import baseApi from "../../api/baseApi";

export const studiosApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // 1. Get All Studios
    getAllStudios: builder.query({
      query: () => ({
        url: "/admin/studios",
        method: "GET",
      }),
      providesTags: ["studios"],
    }),

    // 2. Create Studio
    createStudio: builder.mutation({
      query: (body) => ({
        url: "/admin/studios",
        method: "POST",
        body,
      }),
      invalidatesTags: ["studios"],
    }),

    // 3. Update Studio
    updateStudio: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/studios/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["studios"],
    }),

    // 4. Delete Studio (soft delete → isActive: false)
    deleteStudio: builder.mutation({
      query: (id) => ({
        url: `/admin/studios/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["studios"],
    }),

    // 5. Upload Image
    uploadImage: builder.mutation({
      query: ({ file, folder = "studios" }) => {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("folder", folder);
        return {
          url: "/admin/upload",
          method: "POST",
          body: formData,
        };
      },
    }),

  }),
});

export const {
  useGetAllStudiosQuery,
  useCreateStudioMutation,
  useUpdateStudioMutation,
  useDeleteStudioMutation,
  useUploadImageMutation,
} = studiosApi;

export default studiosApi;
