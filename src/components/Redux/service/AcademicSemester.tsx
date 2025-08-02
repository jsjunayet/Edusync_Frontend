/* eslint-disable react-refresh/only-export-components */

import { baseApi } from "../api/baseApi";

const AcademicSemesterApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ✅ GET all faculties
    getAcademicSemester: build.query({
      query: () => ({
        url: "/academic-semesters",
        method: "GET",
      }),
      providesTags: ["AcademicSemester"],
    }),

    // ✅ GET single Semester by ID
    getSingleAcademicSemester: build.query({
      query: (id) => ({
        url: `/academic-semesters/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "AcademicSemester", id }],
    }),

    // ✅ CREATE new Semester
    createAcademicSemester: build.mutation({
      query: (body) => ({
        url: "/academic-semesters/create-academic-semester",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AcademicSemester"],
    }),

    // ✅ UPDATE Semester by ID
    updateAcademicSemester: build.mutation({
      query: ({ id, ...body }) => ({
        url: `/academic-faculties/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "AcademicSemester", id },
        { type: "AcademicSemester" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAcademicSemesterQuery,
  useGetSingleAcademicSemesterQuery,
  useCreateAcademicSemesterMutation,
  useUpdateAcademicSemesterMutation,
} = AcademicSemesterApi;
