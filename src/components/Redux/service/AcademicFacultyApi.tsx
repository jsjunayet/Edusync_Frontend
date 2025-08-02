/* eslint-disable react-refresh/only-export-components */

import { baseApi } from "../api/baseApi";

const AcademicFacultyApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ✅ GET all faculties
    getAcademicFaculty: build.query({
      query: () => ({
        url: "/academic-faculties",
        method: "GET",
      }),
      providesTags: ["AcademicFaculty"],
    }),

    // ✅ GET single faculty by ID
    getSingleAcademicFaculty: build.query({
      query: (id) => ({
        url: `/academic-faculties/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "AcademicFaculty", id }],
    }),

    // ✅ CREATE new faculty
    createAcademicFaculty: build.mutation({
      query: (body) => ({
        url: "/academic-faculties/create-academic-faculty",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AcademicFaculty"],
    }),

    // ✅ UPDATE faculty by ID
    updateAcademicFaculty: build.mutation({
      query: ({ id, ...body }) => ({
        url: `/academic-faculties/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "AcademicFaculty", id },
        { type: "AcademicFaculty" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAcademicFacultyQuery,
  useGetSingleAcademicFacultyQuery,
  useCreateAcademicFacultyMutation,
  useUpdateAcademicFacultyMutation,
} = AcademicFacultyApi;
