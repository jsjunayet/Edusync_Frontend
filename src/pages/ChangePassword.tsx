import { useChangePasswordMutation } from "@/components/Redux/service/AuthApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface ChangePasswordForm {
  oldPassword: string;
  newPassword: string;
}

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordForm>();
  const [isLoading, setIsLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [ChangePassword] = useChangePasswordMutation();

  const onSubmit = async (data: ChangePasswordForm) => {
    setIsLoading(true);
    try {
      console.log(data);
      const res = await ChangePassword(data);
      console.log(res);

      if (res?.data?.data?.success) {
        toast({
          title: "Password changed successfully",
          description: "You can now access the dashboard",
        });
        navigate("/login");
      } else {
        toast({
          title: "Failed to change password",
          description: res?.error?.data?.message || "Something went wrong",
          variant: "destructive",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Failed to change password",
        description: error?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 w-full max-w-md p-6 bg-white rounded shadow"
      >
        <h2 className="text-xl font-semibold text-center">
          Change Your Password
        </h2>

        {/* Old Password Field */}
        <div className="space-y-2">
          <Label htmlFor="oldPassword">Old Password</Label>
          <div className="relative">
            <Input
              type={showOldPassword ? "text" : "password"}
              id="oldPassword"
              placeholder="Enter old password"
              className="pr-10"
              {...register("oldPassword", {
                required: "Old password is required",
              })}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setShowOldPassword(!showOldPassword)}
            >
              {showOldPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {errors.oldPassword && (
            <p className="text-sm text-destructive">
              {errors.oldPassword.message}
            </p>
          )}
        </div>

        {/* New Password Field */}
        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <div className="relative">
            <Input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              placeholder="Enter new password"
              className="pr-10"
              {...register("newPassword", {
                required: "New password is required",
              })}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {errors.newPassword && (
            <p className="text-sm text-destructive">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Updating..." : "Change Password"}
        </Button>
      </form>
    </div>
  );
};

export default ChangePassword;
