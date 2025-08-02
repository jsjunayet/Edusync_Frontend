import { getCookie } from "@/components/LocalStorage/LocalStorage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../feature/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api/v1",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    console.log(token);
    if (token) {
      headers.set("Authorization", `${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const state = api.getState();
  const token = state.auth.token;
  if (!token) {
    return baseQuery(args, api, extraOptions);
  }
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 500) {
    const refreshToken = getCookie("refreshToken");
    if (refreshToken) {
      try {
        const refreshTokenResult = await baseQuery(
          {
            url: "/auth/refresh-token",
            method: "GET",
            headers: { token: refreshToken },
          },
          api,
          extraOptions
        );

        if (refreshTokenResult?.data) {
          const newToken = refreshTokenResult.data.data.accessToken;
          api.dispatch(setCredentials({ token: newToken }));
          result = await baseQuery(args, api, extraOptions);
        } else {
          console.log("error");
        }
      } catch (error) {
        console.log("error", error);
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "AcademicFaculty",
    "AcademicSemester",
    "AcademicDepartment",
    "User",
  ],
  endpoints: () => ({}),
});
