import { apiSlice } from "./apiSlice";

const STUDENTS_URL = "/api/students";

export const studentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${STUDENTS_URL}/login`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${STUDENTS_URL}/register`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    logout: builder.mutation({
      query: (data) => ({
        url: `${STUDENTS_URL}/logout`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    update: builder.mutation({
      query: (data) => ({
        url: `${STUDENTS_URL}/update`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    getStudentData: builder.query({
      query: () => ({
        url: `${STUDENTS_URL}/`,
        method: "GET",
        credentials: "include",
      }),
    }),
    uploadIdCard: builder.mutation({
      query: (data) => ({
        url: `${STUDENTS_URL}/upload-id-card`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    applyForVerification: builder.mutation({
      query: (data) => ({
        url: `${STUDENTS_URL}/verify`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    applyForConcession: builder.mutation({
      query: (data) => ({
        url: `${STUDENTS_URL}/apply`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useUpdateMutation,
  useGetStudentDataQuery,
  useUploadIdCardMutation,
  useApplyForVerificationMutation,
  useApplyForConcessionMutation,
} = studentsApiSlice;
