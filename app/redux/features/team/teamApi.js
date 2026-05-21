import baseApi from "../../api/baseApi";

export const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get All Team (with search & pagination)
    getAllTeam: builder.query({
      query: ({ search = '', page = 1, limit = 10 } = {}) => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);
        return {
          url: `/admin/team?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["team"],
    }),

    // 2. Create Team Member
    createTeamMember: builder.mutation({
      query: (body) => ({
        url: "/admin/team",
        method: "POST",
        body,
      }),
      invalidatesTags: ["team"],
    }),

    // 3. Update Team Member
    updateTeamMember: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/team/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["team"],
    }),

    // 4. Delete Team Member
    deleteTeamMember: builder.mutation({
      query: (id) => ({
        url: `/admin/team/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["team"],
    }),

    // 5. Upload Avatar (we can reuse the one from studiosApi, but good to have a specific wrapper if needed, 
    // or just use the same uploadImage mutation. We'll define it here for convenience).
    uploadTeamImage: builder.mutation({
      query: ({ file }) => {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("folder", "team");
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
  useGetAllTeamQuery,
  useCreateTeamMemberMutation,
  useUpdateTeamMemberMutation,
  useDeleteTeamMemberMutation,
  useUploadTeamImageMutation,
} = teamApi;

export default teamApi;
