import { Button } from "antd";
import "../../../styles/navbar.css";
import { Link } from "react-router";
import { jwtDecode } from "jwt-decode";
import { useWindowSize } from "@uidotdev/usehooks";

export default function MainNavbar() {
  const size = useWindowSize();
  const token = localStorage.getItem("token");

  const isTokenValid = () => {
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const isLoggedIn = isTokenValid();

  const getFontSizeClass = () => {
    if (size?.width > 768) return "text-4xl";
    if (size?.width > 480) return "text-3xl";
    if (size?.width > 1024) return "text-5xl";
    return "text-2xl";
  };

  return (
    <nav className="navbar" style={{ backgroundColor: "#024645" }}>
      <div className="navbar-logo flex flex-row justify-between items-center w-full">
        <Link to="/">
          <img src="https://i.ibb.co.com/mVgY9jFz/main-logo.png" alt="Logo" />
        </Link>
        <Link to="/">
          <p
            className={`text-white italic font-bold pil ${getFontSizeClass()}`}
          >
            E-Exam App
          </p>
        </Link>

        <div>
          {isLoggedIn ? (
            <Link to="/user/dashboard">
              <Button
                style={{
                  color: "black",
                  outline: "none",
                  border: "none",
                  fontSize: "20px",
                }}
                className="solaimanlipi font-semibold bg-[#f8bb62]"
              >
                ড্যাশবোর্ড এ যান
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button
                style={{
                  backgroundColor: "#f8bb62",
                  color: "black",
                  outline: "none",
                  border: "none",
                  fontSize: "20px",
                }}
                className="solaimanlipi font-semibold"
              >
                লগইন করুন
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
