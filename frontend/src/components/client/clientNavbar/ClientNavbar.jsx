import { Avatar, Button, Dropdown, Tooltip } from "antd";
import { Link } from "react-router";
import AddIcon from "../../../assets/AddIcon";
import DashboardIcon from "../../../assets/DashboardIcon";
import LogoutIcon from "../../../assets/LogoutIcon";
import QuestionIcon from "../../../assets/QuestionIcon";
import "../../../styles/clientNavbar.css";
// import Clock from "../../../utils/clock/Clock";
import {
  useGetAUserProfileByEmailQuery,
  useGetAUserProfileQuery,
} from "../../../redux/api/slices/authSlice";

export default function ClientNavbar() {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  const { data: getUserProfileDate } = useGetAUserProfileQuery(token);
  const { data: getAnUserProfileWithEmail } =
    useGetAUserProfileByEmailQuery(email);

  const items = [
    {
      key: "1",
      label: (
        <Link to="/user/profile">
          <p>
            {getUserProfileDate?.user?.userName ||
              getAnUserProfileWithEmail?.user?.userName}
          </p>
          <p className="font-bold">
            {getUserProfileDate?.user?.email ||
              getAnUserProfileWithEmail?.user?.email}
          </p>
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link
          rel="noopener noreferrer"
          to="/user/dashboard"
          className="solaimanlipi text-xl"
          style={{ marginLeft: "10px" }}
        >
          ড্যাশবোর্ড
        </Link>
      ),
      icon: <DashboardIcon color="#000000" />,
    },
    {
      key: "3",
      label: (
        <Link
          // target="_blank"
          rel="noopener noreferrer"
          to="/user/question-create"
          className="solaimanlipi text-xl"
          style={{ marginLeft: "10px" }}
        >
          ১ ক্লিকে প্রশ্ন তৈরি
        </Link>
      ),
      icon: <AddIcon color="#000000" />,
      // disabled: true,
    },
    {
      key: "4",
      label: (
        <Link
          // target="_blank"
          rel="noopener noreferrer"
          to="/user/self-questions-set"
          className="solaimanlipi text-xl"
          style={{ marginLeft: "10px" }}
        >
          আমার তৈরি প্রশ্ন
        </Link>
      ),
      icon: <QuestionIcon />,
    },
    {
      key: "5",
      danger: true,
      label: (
        <button
          rel="noopener noreferrer"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            window.location.href = "/login";
          }}
          className="solaimanlipi text-xl"
          style={{ marginLeft: "10px" }}
        >
          লগআউট
        </button>
      ),
      icon: <LogoutIcon />,
    },
  ];
  return (
    <div className="w-full fixed top-0 z-10   print:hidden">
      <header className="">
        <nav
          className="bg-white client_navbar_wrapper "
          style={{ padding: "19px" }}
        >
          <div className="flex flex-wrap justify-between items-center">
            <div >
              {/* <Clock /> */}
              {/* lg:order-2 */}
            </div>
            <div className="flex items-center  gap-3">
              <Tooltip title="Create a question">
                <Link to="/user/question-create">
                  <Button
                    icon={<AddIcon color="#ffffff" />}
                    size="large"
                    type="primary"
                    shape="circle"
                    style={{ backgroundColor: "#024645" }}
                  ></Button>
                </Link>
              </Tooltip>
              <Dropdown
                menu={{
                  items,
                }}
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Avatar
                    style={{
                      backgroundColor: "#f8bb62",
                      verticalAlign: "middle",
                    }}
                    size="large"
                    // gap={gap}
                  >
                    {getUserProfileDate?.user?.userName?.slice(0, 2) ||
                      getAnUserProfileWithEmail?.user?.userName?.slice(0, 2)}
                  </Avatar>
                </a>
              </Dropdown>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
