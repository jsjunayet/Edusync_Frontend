/* eslint-disable react-refresh/only-export-components */

import { baseApi } from "../api/baseApi";

const AcademicDepartmentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ✅ GET all faculties
    getAcademicDepartment: build.query({
      query: () => ({
        url: "/academic-departments",
        method: "GET",
      }),
      providesTags: ["AcademicDepartment"],
    }),

    // ✅ GET single Department by ID
    getSingleAcademicDepartment: build.query({
      query: (id) => ({
        url: `/academic-departments/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        { type: "AcademicDepartment", id },
      ],
    }),

    // ✅ CREATE new Department
    createAcademicDepartment: build.mutation({
      query: (body) => ({
        url: "/academic-departments/create-academic-department",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AcademicDepartment"],
    }),

    // ✅ UPDATE Department by ID
    updateAcademicDepartment: build.mutation({
      query: ({ id, ...body }) => ({
        url: `/academic-departments/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "AcademicDepartment", id },
        { type: "AcademicDepartment" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAcademicDepartmentQuery,
  useGetSingleAcademicDepartmentQuery,
  useCreateAcademicDepartmentMutation,
  useUpdateAcademicDepartmentMutation,
} = AcademicDepartmentApi;
