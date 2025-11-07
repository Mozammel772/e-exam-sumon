import { useState } from "react";
import EyeCloseIcon from "../../assets/EyeCloseIcon";
import EyeOpenIcon from "../../assets/EyeOpenIcon";

import { useNavigate } from "react-router-dom";

import { Button } from "@heroui/react";
import { useResetPasswordMutation } from "../../redux/api/slices/authSlice";
import Swal from "sweetalert2";
export default function ResetPassword() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const pathParts = location.pathname.split("/");
  const token = pathParts[2];

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [resetPassword, { isLoading: loader }] = useResetPasswordMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleResetPasswordFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await resetPassword({ formData, token }).unwrap();
      if (res?.success) {
        Swal.fire({
          title: "আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে",
          icon: "success",
          showCloseButton: true,
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/login");
      } else {
        Swal.fire({
          title: res?.error?.errors?.message,
          icon: "error",
          showCloseButton: true,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      Swal.fire({
        title: error?.data?.msg || "Error",
        icon: "error",
        showCloseButton: true,
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      // Reset the form after submission
      setFormData({ password: "", confirmPassword: "" });
    }
  };

  const toggleNewPasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 solaimanlipi">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          নতুন পাসওয়ার্ড সেট করুন
        </h2>
        <form className="space-y-5" onSubmit={handleResetPasswordFormSubmit}>
          {/* New Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a6d6c] transition-all"
              required
              placeholder="আপনার নতুন পাসওয়ার্ড দিন"
            />
            <span
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
              onClick={toggleNewPasswordVisibility}
            >
              {showPassword ? (
                <EyeOpenIcon size="20px" color="#000000" />
              ) : (
                <EyeCloseIcon size="20px" color="#000000" />
              )}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a6d6c] transition-all"
              required
              placeholder="পুনরায় পাসওয়ার্ডটি দিন"
            />
            <span
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showPassword ? (
                <EyeOpenIcon size="20px" color="#000000" />
              ) : (
                <EyeCloseIcon size="20px" color="#000000" />
              )}
            </span>
          </div>

          <Button
            type="submit"
            isLoading={loader}
            className="w-full text-lg bg-[#17c964] hover:bg-[#13b955] text-white font-semibold py-2 rounded-lg transition-all duration-200"
          >
            পাসওয়ার্ড পরিবর্তন করুন
          </Button>
        </form>
      </div>
    </div>
  );
}
