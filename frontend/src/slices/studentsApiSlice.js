import { apiSlice } from "./apiSlice";

const STUDENTS_URL = "/api/students";

export const studentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${STUDENTS_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useLoginMutation } = studentsApiSlice;
