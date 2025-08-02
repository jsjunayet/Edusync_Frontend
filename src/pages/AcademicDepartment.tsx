import DashboardLayout from "@/components/Layout/DashboardLayout";
import {
  useCreateAcademicDepartmentMutation,
  useGetAcademicDepartmentQuery,
  useUpdateAcademicDepartmentMutation,
} from "@/components/Redux/service/AcademicDepartmentApi";
import { useGetAcademicFacultyQuery } from "@/components/Redux/service/AcademicFacultyApi";
import { toast } from "@/hooks/use-toast";
import ReusableCRUDPage from "./ResuableCRUDPage";

const AcademicDepartment = () => {
  const { data } = useGetAcademicDepartmentQuery();
  const { data: Faculty } = useGetAcademicFacultyQuery();
  const FacultyName = Faculty?.data?.map((item) => item.name);
  const [createAcademicDepartment] = useCreateAcademicDepartmentMutation();
  const [updateAcademicDepartment] = useUpdateAcademicDepartmentMutation();
  const createItem = async (data: FormSchema) => {
    try {
      const res = await createAcademicDepartment(data).unwrap();

      toast({
        title: "Academic Department Created",
        description: `Department: ${data?.name}`,
        variant: "default",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast({
        title: "Failed to create Academic Department",
        description:
          err?.data?.errorSources?.[0]?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const updateItem = async (id: string, data: FormSchema) => {
    const payload = {
      id,
      name: data.name,
      academicFaculty: data.academicFaculty,
    };
    const res = await updateAcademicDepartment(payload);
  };

  return (
    <div>
      <DashboardLayout>
        <ReusableCRUDPage
          title="Academic Department"
          subtitle="Interactive real-time Academic Department management"
          formFieldMeta={[
            { name: "name", type: "text" },
            {
              name: "academicFaculty",
              type: "select",
              options: FacultyName,
            },
          ]}
          fetchItems={data?.data}
          createItem={createItem}
          updateItem={updateItem}
        />
      </DashboardLayout>
    </div>
  );
};

export default AcademicDepartment;
