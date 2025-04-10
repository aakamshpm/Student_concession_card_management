import { apiSlice } from "./apiSlice";

const ADMIN_URL = "/api/admin";

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // get all students
    getAllStudents: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/all-students`,
        method: "GET",
        credentials: "include",
      }),
    }),

    //get a student
    getStudentById: builder.query({
      query: (id) => ({
        url: `${ADMIN_URL}/get-student/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    //get applied for verification students
    getAppliedForVerificationStudents: builder.query({
      query: (id) => ({
        url: `${ADMIN_URL}/students-eligibility`,
        method: "GET",
        credentials: "include",
      }),
    }),

    // handle update verification
    verifyStudent: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/verify-student`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    //get applied for concession student list
    getAppliedForConcessionStudents: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/students-application`,
        method: "GET",
        credentials: "include",
      }),
    }),

    // handle update application
    handleApplication: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/approve-concession`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    //logout admin
    logoutAdmin: builder.mutation({
      query: () => ({
        url: `${ADMIN_URL}/logout`,
        method: "POST",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetAllStudentsQuery,
  useGetStudentByIdQuery,
  useGetAppliedForVerificationStudentsQuery,
  useVerifyStudentMutation,
  useGetAppliedForConcessionStudentsQuery,
  useHandleApplicationMutation,
  useLogoutAdminMutation,
} = adminApiSlice;
