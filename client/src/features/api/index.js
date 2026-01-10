import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "../auth/authSlice";
import toast from "react-hot-toast";
const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    }
  })
// intercept token expiry and refresh
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && [401,403].includes(result.error.status)) {
    //if token  expires request for new token
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

    if (refreshResult?.data?.accessToken) {
      // save token in redux/persist
      api.dispatch(setCredentials({ 
        user: api.getState().auth.user, 
        accessToken: refreshResult.data.accessToken 
      }));

      // retry original request again after refresh
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
      toast.error("Session expired")
    }
  }

  return result;
};

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [],
  // eslint-disable-next-line no-unused-vars
  endpoints: (builder) => ({}),
});
