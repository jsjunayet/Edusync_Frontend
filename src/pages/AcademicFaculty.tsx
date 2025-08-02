import DashboardLayout from "@/components/Layout/DashboardLayout";
import {
  useCreateAcademicFacultyMutation,
  useGetAcademicFacultyQuery,
  useUpdateAcademicFacultyMutation,
} from "@/components/Redux/service/AcademicFacultyApi";
import { toast } from "@/hooks/use-toast";
import ReusableCRUDPage from "./ResuableCRUDPage";

const AcademicFaculty = () => {
  const { data } = useGetAcademicFacultyQuery();
  const [createAcademicFaculty] = useCreateAcademicFacultyMutation();
  const [updateAcademicFaculty] = useUpdateAcademicFacultyMutation();

  const createItem = async (data: FormSchema) => {
    const payload = { name: data.name };

    try {
      const res = await createAcademicFaculty(payload).unwrap(); // unwrap করলে সরাসরি data পাবে, error হলে catch এ যাবে
      toast({
        title: "Academic Faculty Created Successfully",
        description: `Faculty name: ${data.name}`,
        variant: "default",
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast({
        title: "Failed to Create Academic Faculty",
        description:
          err?.data?.errorSources?.[0]?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const updateItem = async (id: string, data: FormSchema) => {
    const payload = { id, name: data.name };
    const res = await updateAcademicFaculty(payload);
  };

  return (
    <div>
      <DashboardLayout>
        <ReusableCRUDPage
          title="Academic Faculty"
          subtitle="Interactive real-time Academic Faculty management"
          formFieldMeta={[{ name: "name", type: "text" }]}
          fetchItems={data?.data}
          createItem={createItem}
          updateItem={updateItem}
        />
      </DashboardLayout>
    </div>
  );
};

export default AcademicFaculty;
