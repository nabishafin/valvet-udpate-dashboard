import baseApi from "../../api/baseApi";
import {
  setResetEmail,
  clearResetEmail,
} from "../../slices/forgotPasswordSlice";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 01. login
    login: builder.mutation({
      query: (loginData) => ({
        url: "/auth/login",
        method: "POST",
        body: loginData,
      }),
      invalidatesTags: ["auth"],
    }),

    // 01a. register
    register: builder.mutation({
      query: (registerData) => ({
        url: "/auth/register",
        method: "POST",
        body: registerData,
      }),
      invalidatesTags: ["auth"],
    }),

    // 02. refresh token
    refreshToken: builder.mutation({
      query: () => {
        const refreshToken = localStorage.getItem("refreshToken");
        return {
          url: "/auth/refresh-token",
          method: "POST",
          body: { refreshToken },
        };
      },
      invalidatesTags: ["auth"],
    }),

    // 03. logout
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["auth"],
    }),

    // 04. get user by token
    getUserByToken: builder.query({
      query: () => ({ url: `/auth/me`, method: "GET" }),
      providesTags: ["auth"],
    }),

    // 05. update user
    updateUser: builder.mutation({
      query: (data) => ({
        url: `/user/update`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),

    // 06. forgot password
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: `/auth/forgot-password`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          // Store reset token if provided
          const token =
            data?.resetPasswordToken ||
            data?.data?.resetPasswordToken ||
            data?.token;
          if (token) localStorage.setItem("resetPasswordToken", token);

          // Store email for OTP verification
          if (arg.email) dispatch(setResetEmail(arg.email));
        } catch (error) {
          console.error("Forgot password error:", error);
        }
      },
    }),

    // 07. verify email/OTP
    verifyOtp: builder.mutation({
      query: ({ email, otp }) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: { email, otp },
      }),
      invalidatesTags: ["auth"],
    }),

    // 08. reset password
    resetPassword: builder.mutation({
      query: (data) => {
        return {
          url: `/auth/reset-password`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["auth"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(clearResetEmail());
        } catch (error) {
          console.error("Reset password error:", error);
        }
      },
    }),

    // 09. change password (logged-in user)
    changePassword: builder.mutation({
      query: (data) => ({
        url: `/users/update-admin-password`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useGetUserByTokenQuery,
  useUpdateUserMutation,
} = authApi;
