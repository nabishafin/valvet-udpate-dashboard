import baseApi from "../../api/baseApi";

export const blogsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBlogs: builder.query({
      query: ({ search = '', page = 1, limit = 10 } = {}) => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        params.append('page', page);
        params.append('limit', limit);
        return {
          url: `/admin/blogs?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["blogs"],
    }),

    getBlogById: builder.query({
      query: (id) => ({ url: `/admin/blogs/${id}`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "blogs", id }],
    }),

    createBlog: builder.mutation({
      query: (body) => ({ url: "/admin/blogs", method: "POST", body }),
      invalidatesTags: ["blogs"],
    }),

    updateBlog: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/blogs/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["blogs"],
    }),

    deleteBlog: builder.mutation({
      query: (id) => ({ url: `/admin/blogs/${id}`, method: "DELETE" }),
      invalidatesTags: ["blogs"],
    }),
  }),
});

export const {
  useGetAllBlogsQuery,
  useGetBlogByIdQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogsApi;

export default blogsApi;
