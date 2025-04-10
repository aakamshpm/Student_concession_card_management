import { apiSlice } from "./apiSlice";

const ADMIN_URL = "/api/admin";

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // get all students
    getAllStudents: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/all-students`,
        method: "GET",
      }),
    }),

    //get a student
    getStudentById: builder.query({
      query: (id) => ({
        url: `${ADMIN_URL}/get-student/${id}`,
        method: "GET",
      }),
    }),

    //get applied for verification students
    getAppliedForVerificationStudents: builder.query({
      query: (id) => ({
        url: `${ADMIN_URL}/students-eligibility`,
        method: "GET",
      }),
    }),

    // handle update verification
    verifyStudent: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/verify-student`,
        method: "POST",
        body: data,
      }),
    }),

    //get applied for concession student list
    getAppliedForConcessionStudents: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/students-application`,
        method: "GEt",
      }),
    }),

    // handle update application
    handleApplication: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/approve-concession`,
        method: "POST",
        body: data,
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
} = adminApiSlice;
