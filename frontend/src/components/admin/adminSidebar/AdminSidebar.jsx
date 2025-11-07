import { Link } from "react-router";
import ClassIcon from "../../../assets/ClassIcon";
import SubjectIcon from "../../../assets/SubjectIcon";
import UserIcon from "../../../assets/UserIcon";
import ChapterIcon from "../../../assets/ChapterIcon";
import ExamTypeIcon from "../../../assets/ExamTypeIcon";
import ReportIcon from "../../../assets/ReportIcon";
import AnnouncmentIcon from "../../../assets/AnnouncmentIcon";
import SubscriptionIcon from "../../../assets/SubscriptionIcon";
import ReadyQuestionsSetsIcon from "../../../assets/ReadyQuestionsSetsIcon";
import LectureShitIcon from "../../../assets/LectureShitIcon";
import TopicsIcon from "../../../assets/TopicsIcon";

export default function AdminSidebar() {
  return (
    <div className="z-20 print:hidden">
      <div className="min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-gray-50 text-gray-800">
        <div className="fixed flex flex-col top-0 left-0 w-64 bg-white h-full drop-shadow-md sidebar_options_wrapper">
          <div className="h-[60px] p-3">
            <Link to="/" className="flex flex-row items-center justify-center">
              <img
                src="https://i.ibb.co.com/mVgY9jFz/main-logo.png"
                className="mr-3 w-14"
                alt="main Logo"
              />
              <p className="monstar text-2xl italic font-bold">E-Exam app</p>
            </Link>
          </div>
          <div className="overflow-y-auto overflow-x-hidden">
            <ul className="flex flex-col client_sidebar_wrapper mt-10">
              <li className="px-5">
                <div className="flex flex-row items-center h-8">
                  <div className="solaimanlipi text-lg font-bold tracking-wide text-gray-500">
                    কন্ট্রোলিং সেকশন
                  </div>
                </div>
              </li>
              <li>
                <Link
                  to="/admin/dashboard"
                  className="relative flex flex-row items-center h-11 sidebar_list"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      ></path>
                    </svg>
                  </span>
                  <span className="text-xl tracking-wide truncate sidebar_text solaimanlipi">
                    ড্যাশবোর্ড
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/class"
                  className="relative flex flex-row items-center h-11 sidebar_list"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <ClassIcon size="24px" color="#000000" />
                  </span>
                  <span className="text-xl tracking-wide truncate sidebar_text solaimanlipi">
                    ক্লাস কন্ট্রোলিং
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/subject"
                  className="relative flex flex-row items-center h-11 sidebar_list"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <SubjectIcon size="24px" color="#000000" />
                  </span>
                  <span className="text-xl tracking-wide truncate sidebar_text solaimanlipi">
                    সাবজেক্ট কন্ট্রোলিং
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to="/admin/chapter"
                  className="relative flex flex-row items-center h-11 sidebar_list"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <ChapterIcon size="24px" color="#000000" />
                  </span>
                  <span className="text-xl tracking-wide truncate sidebar_text solaimanlipi">
                    চ্যাপ্টার কন্ট্রোলিং
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to="/admin/exam"
                  className="relative flex flex-row items-center h-11 sidebar_list"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <ExamTypeIcon size="24px" color="#000000" />
                  </span>
                  <span className="text-xl tracking-wide truncate sidebar_text solaimanlipi">
                    এক্সাম কন্ট্রোলিং
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/all-topics"
                  className="relative flex flex-row items-center h-11 sidebar_list"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <TopicsIcon size="24px" color="#000000" />
                  </span>
                  <span className="text-xl tracking-wide truncate sidebar_text solaimanlipi">
                    টপিকস কন্ট্রোলিং
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          <div className="overflow-y-auto overflow-x-hidden flex-grow">
            <ul className="flex flex-col client_sidebar_wrapper">
              <li className="px-5">
                <div className="flex flex-row items-center h-8">
                  <div className="solaimanlipi text-lg font-bold tracking-wide text-gray-500">
                    ম্যানেজ সেকশন
                  </div>
                </div>
              </li>
              <li>
                <Link
                  to="/admin/all-user"
                  className="relative flex flex-row items-center h-11 sidebar_list"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <UserIcon size="24px" color="#000000" />
                  </span>
                  <span className="text-xl tracking-wide truncate sidebar_text solaimanlipi">
                    ম্যানেজ ইউসার
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/all-report"
                  className="relative flex flex-row items-center h-11 sidebar_list"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <ReportIcon size="24px" color="#000000" />
                  </span>
                  <span className="text-xl tracking-wide truncate sidebar_text solaimanlipi">
                    রিপোর্ট ম্যানেজ
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/all-subscriptions"
                  className="relative flex flex-row items-center h-11 sidebar_list"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <SubscriptionIcon size="24px" color="#000000" />
                  </span>
                  <span className="text-xl tracking-wide truncate sidebar_text solaimanlipi">
                    সাবস্ক্রিপশন ম্যানেজ
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/all-ready-questions-set"
                  className="relative flex flex-row items-center h-11 sidebar_list"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <ReadyQuestionsSetsIcon size="24px" color="#000000" />
                  </span>
                  <span className="text-xl tracking-wide truncate sidebar_text solaimanlipi">
                    রেডি প্রশ্ন সাবস্ক্রিপশন ম্যানেজ
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/all-lecture-shit-packages"
                  className="relative flex flex-row items-center h-11 sidebar_list"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <LectureShitIcon size="24px" color="#000000" />
                  </span>
                  <span className="text-xl tracking-wide truncate sidebar_text solaimanlipi">
                    লেকচার শিট সাবস্ক্রিপশন ম্যানেজ
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/announcement"
                  className="relative flex flex-row items-center h-11 sidebar_list"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <AnnouncmentIcon size="24px" color="#000000" />
                  </span>
                  <span className="text-xl tracking-wide truncate sidebar_text solaimanlipi">
                    মারকিউ ম্যাসেজ
                  </span>
                </Link>
              </li>
            </ul>
            <ul className="flex flex-col client_sidebar_wrapper">
              <li className="px-5">
                <div className="flex flex-row items-center h-8">
                  <div className="solaimanlipi text-lg font-bold tracking-wide text-gray-500">
                    নিজ
                  </div>
                </div>
              </li>
              <li>
                <Link
                  to="#"
                  className="relative flex flex-row items-center h-11 sidebar_list"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#000000"
                    >
                      <path d="M480-40q-112 0-206-51T120-227v107H40v-240h240v80h-99q48 72 126.5 116T480-120q75 0 140.5-28.5t114-77q48.5-48.5 77-114T840-480h80q0 91-34.5 171T791-169q-60 60-140 94.5T480-40ZM40-480q0-91 34.5-171T169-791q60-60 140-94.5T480-920q112 0 206 51t154 136v-107h80v240H680v-80h99q-48-72-126.5-116T480-840q-75 0-140.5 28.5t-114 77q-48.5 48.5-77 114T120-480H40Zm440 240q21 0 35.5-14.5T530-290q0-21-14.5-36T480-341q-21 0-35.5 14.5T430-291q0 21 14.5 36t35.5 15Zm-36-152h73q0-36 8.5-54t34.5-44q35-35 46.5-56.5T618-598q0-56-40-89t-98-33q-50 0-86 26t-52 74l66 28q7-26 26.5-43t45.5-17q27 0 45.5 15.5T544-595q0 17-8 34t-34 40q-33 29-45.5 56.5T444-392Z" />
                    </svg>
                  </span>
                  <span className="text-xl tracking-wide truncate sidebar_text solaimanlipi">
                    আমার তৈরি প্রশ্ন
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
