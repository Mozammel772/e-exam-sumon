import AdminQuestionIcon from "../../../assets/AdminQuestionIcon";
import ClickIcon from "../../../assets/ClickIcon";
import QuestionPaperIcon from "../../../assets/QuestionPaperIcon";
import SchoolIcon from "../../../assets/SchoolIcon";
import { Card } from "antd";
import { Divider } from "antd";
import { Button, useDisclosure } from "@heroui/react";

import StudentIcon from "../../../assets/StudentIcon";
import SupportIcon from "../../../assets/SupportIcon";
import Footer from "../landingPage/footer/Footer";
import {
  useGetAUserProfileByEmailQuery,
  useGetAUserProfileQuery,
} from "../../../redux/api/slices/authSlice";
import { useEffect } from "react";
import AddressModal from "./addressModal/AddressModal";
import ClientLoader from "../../../utils/loader/ClientLoader";
import { useGetExamSetsAnUserQuery } from "../../../redux/api/slices/examSetSlice";
import { useNavigate } from "react-router-dom";

import { useWindowSize } from "@uidotdev/usehooks";

export default function Dashboard() {
  const navigate = useNavigate();
  const size = useWindowSize();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const token = localStorage.getItem("token");
  const email = localStorage?.getItem("email");

  const { data: userProfileData, isLoading: profileLoader } =
    useGetAUserProfileQuery(token);
  const { data: getSingleUserProfileByEmail, isLoading: emailUserLoader } =
    useGetAUserProfileByEmailQuery(email);
  const {
    data: getAnUserAllMadeQuestions,
    isLoading: singleUserQuestionsLoader,
  } = useGetExamSetsAnUserQuery(email);

  useEffect(() => {
    if (!getSingleUserProfileByEmail?.user?.addresses?.organizations) {
      onOpen();
    }
  }, [getSingleUserProfileByEmail, onOpen]);

  function convertToBanglaNumber(englishNumber) {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return englishNumber
      ?.toString()
      ?.split("")
      ?.map((digit) => (/\d/.test(digit) ? banglaDigits[digit] : digit))
      ?.join("");
  }

  if (profileLoader || emailUserLoader || singleUserQuestionsLoader) {
    return <ClientLoader />;
  }
  return (
    <div className={`mt-24 me-3 ${size?.width <= 600 ? "ms-3" : "ms-[270px]"}`}>
      <AddressModal isOpen={isOpen} onOpenChange={onOpenChange} />
      <div
        className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-3 bg-red-100 rounded-md"
        style={{ marginBottom: "30px", padding: "20px" }}
      >
        <div className="flex items-center flex-row">
          <SchoolIcon color="#000000" />
          <div style={{ marginLeft: "20px" }}>
            <p className="solaimanlipi text-3xl">
              {userProfileData?.user?.addresses?.organizations ||
                getSingleUserProfileByEmail?.user?.addresses?.organizations ||
                "প্রতিষ্ঠানের নাম"}
            </p>
            <p className="solaimanlipi text-xl font-semibold">
              {userProfileData?.user?.addresses?.divisions ||
                getSingleUserProfileByEmail?.user?.addresses?.divisions ||
                "বিভাগ"}
              ,{" "}
              {userProfileData?.user?.addresses?.districts ||
                getSingleUserProfileByEmail?.user?.addresses?.districts ||
                "জেলা"}
            </p>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-3">
        <div
          className="flex items-center rounded-sm overflow-hidden shadow bg-green-100 cursor-pointer"
          onClick={() => navigate("/user/self-questions-set")}
        >
          <div className="bg-green-400">
            <AdminQuestionIcon color="#ffffff" />
          </div>
          <div className="text-gray-700 ml-10">
            <h3 className="text-xl solaimanlipi font-bold tracking-wider">
              মোট প্রশ্ন তৈরী
            </h3>
            <p className="text-5xl font-bold text-[#05df72] solaimanlipi">
              {convertToBanglaNumber(
                getAnUserAllMadeQuestions?.examSets?.length
              )}
            </p>
          </div>
        </div>
        <div
          className="flex items-center rounded-sm overflow-hidden shadow bg-blue-100 cursor-pointer cursor-pointer"
          onClick={() => navigate("/user/question-create")}
        >
          <div className="p-4 bg-blue-400">
            <ClickIcon color="#ffffff" />
          </div>
          <div className="px-4 text-gray-700" style={{ marginLeft: "15px" }}>
            <h3 className="text-sm tracking-wider solaimanlipi text-xl font-bold">
              ১ ক্লিকে প্রশ্ন তৈরি
            </h3>
          </div>
        </div>
        <div className="flex items-center rounded-sm overflow-hidden shadow bg-indigo-100 cursor-pointer">
          <div className="p-4 bg-indigo-400">
            <QuestionPaperIcon color="#ffffff" />
          </div>
          <div className="px-4 text-gray-700" style={{ marginLeft: "15px" }}>
            <h3 className="text-xl font-bold tracking-wider solaimanlipi">
              রেডি প্রশ্ন
            </h3>
          </div>
        </div>
      </div>

      <div
        className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-3"
        style={{ marginTop: "30px" }}
      >
        <div>
          <Card
            variant="border"
            style={{
              width: "100%",
              marginBottom: "30px",
            }}
          >
            <div className="flex flex-row justify-center items-center">
              <StudentIcon />
              <p
                className="solaimanlipi text-2xl font-bold"
                style={{ marginLeft: "10px" }}
              >
                ৬ষ্ঠ-৯ম শ্রেণির আপডেট সহ
              </p>
            </div>

            <Divider style={{ width: "100%" }} />

            <p className="solaimanlipi text-xl">
              ইন্সট্যান্ট ইএক্সাম এর নতুন আপডেট জানতে
            </p>
            <Divider style={{ width: "100%" }} />
            <p className="solaimanlipi text-xl">
              Messenger Broadcast Channel এ যুক্ত থাকুন
            </p>

            <div className="flex justify-center items-center">
              <Button
                size="sm"
                style={{
                  marginTop: "20px",
                  backgroundColor: "#1eaa3e",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: "bold",
                }}
              >
                Join Broadcast Channel
              </Button>
            </div>
          </Card>
        </div>
        <div>
          <Card
            variant="border"
            style={{
              width: "100%",
            }}
          >
            <div className="flex flex-row justify-center items-center">
              <SupportIcon />
              <p
                className="solaimanlipi text-2xl font-bold"
                style={{ marginLeft: "10px" }}
              >
                আপডেট !
              </p>
            </div>

            <Divider variant="dashed" style={{ width: "100%" }} />

            <p className="solaimanlipi text-xl">
              ইএক্সাম ডেটাবেজে সর্বশেষ নতুন প্রশ্ন যুক্ত হয়েছে
            </p>
            <Divider variant="dashed" style={{ width: "100%" }} />
            <ul className="max-w-full space-y-1 list-inside">
              <li className="flex items-center solaimanlipi text-lg">
                <svg
                  className="w-4 h-4 text-green-500 me-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>
                <p style={{ marginLeft: "8px" }}>18 hours ago</p>
              </li>
              <li className="flex items-center solaimanlipi text-lg">
                <svg
                  className="w-4 h-4 text-green-500 me-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>
                <p className="italic text-xl" style={{ marginLeft: "8px" }}>
                  প্রতি ৩০ মিনিট পর পর এই তথ্য আপডেট হয়
                </p>
              </li>
            </ul>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
