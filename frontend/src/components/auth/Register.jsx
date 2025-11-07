import { useState } from "react";
import EyeOpenIcon from "../../assets/EyeOpenIcon";
import EyeCloseIcon from "../../assets/EyeCloseIcon";
// import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router";
import { useRegisterMutation } from "../../redux/api/slices/authSlice";
import { Button } from "@heroui/react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const [register, { isLoading }] = useRegisterMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(formData).unwrap();
      console.log(res);
      if (res) {
        Swal.fire({
          title: res?.msg,
          icon: "success",
        });
        navigate("/login");
      }
    } catch (error) {
      let errorMessage = error?.data?.errors?.map((err) => err.msg).join(", ");

      if (error?.status === 0 || error?.error?.name === "TypeError") {
        errorMessage = "Network error - check CORS configuration";
      }

      Swal.fire({
        title: "Error",
        text: errorMessage || "Unknown error occurred",
        icon: "error",
      });
    } finally {
      setFormData({
        userName: "",
        email: "",
        password: "",
      });
      setShowPassword(false);
    }
  };
  return (
    <div>
      <div className="flex justify-center items-center flex-col min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-96 transition-transform duration-300 hover:scale-105">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
            Register
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-600">
                Full Name<span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                name="userName"
                value={formData?.userName || ""}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a6d6c] transition-all"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600">
                Email<span className="text-red-700">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData?.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a6d6c] transition-all"
                required
              />
            </div>
            <div className="mb-4 relative">
              <label className="block text-gray-600">
                Password<span className="text-red-700">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData?.password}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a6d6c] transition-all"
                  required
                />
                <span
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                  onClick={togglePasswordVisibility}
                >
                  <span className="material-icons">
                    {showPassword ? (
                      <EyeOpenIcon size="20px" color="#000000" />
                    ) : (
                      <EyeCloseIcon size="20px" color="#000000" />
                    )}
                  </span>
                </span>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full bg-[#024645] text-white p-3 rounded-lg hover:bg-[#3a6d6c] transition-all"
            >
              Register
            </Button>
          </form>
        </div>
        <p className="mt-5">
          Already have an account?{" "}
          <Link to="/login">
            <span className="text-[#17c964] font-bold">Login here...</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
