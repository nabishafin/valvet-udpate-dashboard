import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setLogin, logout } from "../slices/authSlice";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Create a base query with automatic token refresh
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // Try to get token from Redux state first
    const state = getState();
    const token = state.auth?.token || localStorage.getItem("token");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    // Add cache-control headers to prevent caching
    headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    headers.set("Pragma", "no-cache");
    headers.set("Expires", "0");
    return headers;
  },
  // Modern fetch API way to disable caching
  fetchFn: (input, init) =>
    fetch(input, {
      ...init,
      cache: "no-store",
    }),
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If we get a 401 Unauthorized OR 'jwt expired' message, try to refresh the token
  const isTokenExpired =
    (result?.error && result.error.status === 401) ||
    (result?.error?.data?.message === "jwt expired") ||
    (result?.error?.data?.message === "invalid signature");

  if (isTokenExpired) {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      try {
        // Try to get a new token
        const refreshResult = await baseQuery(
          {
            url: "/auth/refresh-token",
            method: "POST",
            body: { refreshToken },
          },
          api,
          extraOptions
        );

        if (refreshResult?.data) {
          const newAccessToken =
            refreshResult.data?.data?.tokens?.accessToken ||
            refreshResult.data?.tokens?.accessToken ||
            refreshResult.data?.accessToken;

          const newRefreshToken =
            refreshResult.data?.data?.tokens?.refreshToken ||
            refreshResult.data?.tokens?.refreshToken ||
            refreshResult.data?.refreshToken;

          if (newAccessToken) {
            // Store the new tokens
            localStorage.setItem("token", newAccessToken);
            if (newRefreshToken) {
              localStorage.setItem("refreshToken", newRefreshToken);
            }

            // Update the auth state
            const userData =
              refreshResult.data?.data?.user || refreshResult.data?.user;
            if (userData) {
              api.dispatch(
                setLogin({
                  user: userData,
                  token: newAccessToken,
                  refreshToken: newRefreshToken || refreshToken,
                })
              );
            }

            // Retry the original request with new token
            result = await baseQuery(args, api, extraOptions);
          }
        } else {
          throw new Error("Refresh failed - no data returned");
        }
      } catch (error) { // eslint-disable-line no-unused-vars
        // Refresh failed, logout user
        api.dispatch(logout());
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // Redirect to login page
        return { error: { status: 401, data: "Session expired" } };
      }
    } else {
      // No refresh token, logout user
      api.dispatch(logout());
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login"; // Redirect to login page
      return { error: { status: 401, data: "No refresh token" } };
    }
  }


  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["auth", "dashboardStats", "admin-users", "earnings-overview", "Faqs", "payments", "studios", "team", "instant-bookings", "settings", "pricing"],
  endpoints: () => ({}),
  // Global configuration for refetch behavior
  keepUnusedDataFor: 0, // Don't keep unused data in cache
});

export default baseApi;
