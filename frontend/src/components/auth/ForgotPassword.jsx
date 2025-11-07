import { Button } from "@heroui/react";
import { useState } from "react";
import Swal from "sweetalert2";
import { useForgotPasswordMutation } from "../../redux/api/slices/authSlice";

export default function ForgotPassword() {
  const [formData, setFormData] = useState({ email: "" });
  const [forgotPassword, { isLoading: loader }] = useForgotPasswordMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleForgotPasswordFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword(formData).unwrap();
      if (res?.message) {
        Swal.fire({
          title: "পাসওয়ার্ড রিসেটের লিংক আপনার ইমেইলে পাঠানো হয়েছে।",
          icon: "success",
          showCloseButton: true,
          showConfirmButton: false,
          timer: 1500,
        });
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
      setFormData({ email: "" });
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Forgot Your Password?
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your email address and get a link in your providing{" "}
          <span className="font-bold italic">email address</span> to reset your
          password.
        </p>
        <form className="space-y-5" onSubmit={handleForgotPasswordFormSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="example@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17c964]"
              required
            />
          </div>
          <Button
            isLoading={loader}
            type="submit"
            className="w-full bg-[#17c964] hover:bg-[#13b955] text-white font-semibold py-2 rounded-lg transition-all duration-200"
          >
            Send Reset Link
          </Button>
        </form>
      </div>
    </div>
  );
}
