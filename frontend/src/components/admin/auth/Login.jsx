import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../../redux/api/slices/authSlice";
import { Button } from "@heroui/react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { authSlice } from "../../../redux/api/slices/authSlice";
export default function AdminLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });

      google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        {
          theme: "outline",
          size: "large",
          width: "100%",
        }
      );
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_main_url}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          title: "Login Successful",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        localStorage.setItem("token", data?.token);
        localStorage.setItem("email", data?.user?.email);

        if (data?.user?.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      } else {
        throw new Error(data?.message || "Google login failed");
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(formData).unwrap();
      if (res) {
        Swal.fire({
          title: res?.msg,
          icon: "success",
          showCloseButton: true,
          showConfirmButton: false,
          timer: 1500,
        });

        localStorage.setItem("token", res?.token);
        localStorage.setItem("email", formData?.email);

        if (res?.user?.role === "admin") {
          navigate("/admin/dashboard");
        } else if (res?.user?.role === "user") {
          navigate("/user/dashboard");
        }

        dispatch(authSlice.util.resetApiState());
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error?.data?.msg || "Login failed",
        icon: "error",
      });
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with decorative element */}
          <div className="bg-[#024645] py-4 px-6">
            <h1 className="text-2xl font-bold text-white text-center pil">
              Welcome Back
            </h1>
          </div>

          <div className="p-8">
            {/* Social login buttons */}
            <div className="space-y-4 mb-6">
              {/* <button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  
                  <FcGoogle className="text-xl" />
                  <span className="pil">Continue with Google</span>
                </button> */}
              {/* <div id="googleSignInDiv" className="mb-6"></div> */}
            </div>

            {/* Divider */}
            {/* <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500 pil">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div> */}

            {/* Email/Password form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all pr-12"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className="mt-2 text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-teal-600 hover:text-teal-800 hover:underline pil"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full py-3 px-4 bg-[#024645] hover:bg-teal-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                Sign in
              </Button>
            </form>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 text-center pil">
            <p className="text-gray-600 text-sm">
              Don{"'"}t have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-teal-600 hover:text-teal-800 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-6 text-center text-sm text-gray-500 pil">
          By continuing, you agree to our{" "}
          <Link
            to="/terms_conditions"
            className="underline hover:text-gray-700"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy_policies"
            className="underline hover:text-gray-700"
          >
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
