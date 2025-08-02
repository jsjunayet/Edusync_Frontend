import { baseApi } from "@/components/Redux/api/baseApi";

const AuthApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
      providesTags: ["User"], // ✅ This tells RTK Query this query provides "User" data
    }),

    postRegister: build.mutation({
      query: ({ formData, role }) => ({
        url: `users/create-${role}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["User"], // ✅ After register, refetch "User"
    }),

    postLogin: build.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"], // ✅ Refetch getMe after login
    }),

    changeUser: build.mutation({
      query: (userData) => ({
        url: "/user",
        method: "PATCH",
        body: userData,
      }),
      invalidatesTags: ["User"], // ✅ Refetch after change
    }),

    postForgetPassword: build.mutation({
      query: ({ email }) => ({
        url: `/auth/forgotpassword/${email}`,
        method: "POST",
      }),
    }),

    updateUser: build.mutation({
      query: (userData) => ({
        url: "/user",
        method: "PATCH",
        body: userData,
      }),
      invalidatesTags: ["User"], // ✅ Refetch after update
    }),

    changePassword: build.mutation({
      query: (userData) => ({
        url: "auth/change-password",
        method: "POST",
        body: userData,
      }),
    }),

    verifyCode: build.mutation({
      query: (body) => ({
        url: "/auth/verifyCode",
        method: "POST",
        body,
      }),
    }),

    getVerify: build.query({
      query: () => ({
        url: "auth/verify",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetMeQuery,
  useChangeUserMutation,
  usePostRegisterMutation,
  usePostLoginMutation,
  usePostForgetPasswordMutation,
  useChangePasswordMutation,
  useVerifyCodeMutation,
  useGetVerifyQuery,
  useUpdateUserMutation,
} = AuthApi;
