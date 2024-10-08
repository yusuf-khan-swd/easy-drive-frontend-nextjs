import { baseApi } from "./baseApi";

const AUTH_URL = "/auth";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (loginData) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        // data: loginData, // ! Need data instead data property for sending body in server because of axios
        body: loginData,
      }),
    }),

    signup: builder.mutation({
      query: (signupData) => ({
        url: `${AUTH_URL}/signup`,
        method: "POST",
        body: signupData,
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const { useLoginMutation, useSignupMutation } = authApi;
