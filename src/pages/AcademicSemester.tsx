import DashboardLayout from "@/components/Layout/DashboardLayout";
import { useUpdateAcademicFacultyMutation } from "@/components/Redux/service/AcademicFacultyApi";
import {
  useCreateAcademicSemesterMutation,
  useGetAcademicSemesterQuery,
} from "@/components/Redux/service/AcademicSemester";
import { useToast } from "@/hooks/use-toast";
import ReusableCRUDPage from "./ResuableCRUDPage";

const AcademicSemester = () => {
  const { data } = useGetAcademicSemesterQuery();
  const [createAcademicSemester] = useCreateAcademicSemesterMutation();
  const [updateAcademicFaculty] = useUpdateAcademicFacultyMutation();
  const { toast } = useToast();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const semesterCodes = ["01", "02", "03"]; // Or use Spring, Summer, Fall if you prefer
  const semesterName = ["Autumn", "Summer", "Fall"];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createItem = async (data: any) => {
    try {
      const res = await createAcademicSemester(data).unwrap(); // সরাসরি success data পাবে
      toast({
        title: "Academic Semester Created Successfully",
        description: `Semester: ${data?.name} (${data?.year})`,
        variant: "default",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast({
        title: "Failed to create academic semester",
        description:
          err?.data?.errorSources?.[0]?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  // const updateItem = async (id: string, data: any) => {
  //   const payload = { id, ...data };
  //   const res = await updateAcademicFaculty(payload);
  //   if ("error" in res) {
  //     toast({
  //       title: "Failed to update academic semester",
  //       description:
  //         res?.error?.data?.errorSources?.[0]?.message ||
  //         "Something went wrong",
  //       variant: "destructive",
  //     });
  //   }
  // };

  return (
    <DashboardLayout>
      <ReusableCRUDPage
        title="Academic Semester"
        subtitle="Interactive real-time Academic Semester management"
        formFieldMeta={[
          { name: "name", type: "select", options: semesterName },
          { name: "year", type: "text" },
          { name: "code", type: "select", options: semesterCodes },
          { name: "startMonth", type: "select", options: months },
          { name: "endMonth", type: "select", options: months },
        ]}
        fetchItems={data?.data || []}
        createItem={createItem}
      />
    </DashboardLayout>
  );
};

export default AcademicSemester;
