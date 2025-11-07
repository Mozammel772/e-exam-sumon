import { useState } from "react";
import { Link } from "react-router";
import "../../../styles/clientSidebar.css";
import LectureShitIcon from "../../../assets/LectureShitIcon";
import SubscriptionIcon from "../../../assets/SubscriptionIcon";
import { useWindowSize } from "@uidotdev/usehooks";
import { Menu, X } from "lucide-react"; // for hamburger icons

export default function ClientSidebar() {
  const size = useWindowSize();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <div className="z-50 print:hidden">
      {/* Hamburger menu (only visible on <=600px) */}
      {size?.width <= 600 && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-30 p-2 bg-white border rounded-md shadow-md"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-white drop-shadow-md transform transition-transform duration-300 ease-in-out z-50
        ${
          size?.width <= 600
            ? isOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        }
        `}
      >
        <div className="h-[60px] p-3 border-b flex items-center justify-center mt-5">
          <Link to="/" className="flex flex-row items-center justify-center ">
            <img
              src="https://i.ibb.co.com/mVgY9jFz/main-logo.png"
              className="mr-3 w-14 "
              alt="Main Logo"
            />
            <p className="monstar text-2xl italic font-bold">E-Exam app</p>
          </Link>
        </div>

        <div className="overflow-y-auto overflow-x-hidden h-[calc(100%-60px)]">
          <ul className="flex flex-col client_sidebar_wrapper mt-5">
            <li className="px-5">
              <div className="flex flex-row items-center h-8">
                <div className="solaimanlipi text-lg font-bold tracking-wide text-gray-500">
                  সার্বিক চিত্র
                </div>
              </div>
            </li>
            <li>
              <Link
                to="/user/dashboard"
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
                to="/user/question-create"
                className="relative flex flex-row items-center h-11 sidebar_list"
              >
                <span className="inline-flex justify-center items-center ml-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#000000"
                  >
                    <path d="M516-82.32q-9 1.65-18 1.99-9 .33-18 .33-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 9-.33 18-.34 9-1.99 18l-64.35-20v-16q0-139.58-96.87-236.46-96.88-96.87-236.46-96.87t-236.46 96.87Q146.67-619.58 146.67-480t96.87 236.46q96.88 96.87 236.46 96.87h16l20 64.35ZM821-60 650-231 600-80 480-480l400 120-151 50 171 171-79 79Z" />
                  </svg>
                </span>
                <span className="text-xl tracking-wide truncate sidebar_text solaimanlipi">
                  ১ ক্লিকে প্রশ্ন তৈরি
                </span>
              </Link>
            </li>

            <li>
              <Link
                to="/user/question-bank"
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
                    <path d="M240-80v-172q-57-52-88.5-121.5T120-520q0-150 105-255t255-105q125 0 221.5 73.5T827-615l52 205q5 19-7 34.5T840-360h-80v120q0 33-23.5 56.5T680-160h-80v80h-80v-160h160v-200h108l-38-155q-23-91-98-148t-172-57q-116 0-198 81t-82 197q0 60 24.5 114t69.5 96l26 24v208h-80Zm254-360Zm-14 120q17 0 28.5-11.5T520-360q0-17-11.5-28.5T480-400q-17 0-28.5 11.5T440-360q0 17 11.5 28.5T480-320Zm-30-128h61q0-25 6.5-40.5T544-526q18-20 35-40.5t17-53.5q0-42-32.5-71T483-720q-40 0-72.5 23T365-637l55 23q7-22 24.5-35.5T483-663q22 0 36.5 12t14.5 31q0 21-12.5 37.5T492-549q-20 21-31 42t-11 59Z" />
                  </svg>
                </span>
                <span className="text-xl tracking-wide truncate sidebar_text solaimanlipi">
                  প্রশ্নব্যাংক
                </span>
              </Link>
            </li>
          </ul>
          <ul className="flex flex-col client_sidebar_wrapper">
            <li className="px-5">
              <div className="flex flex-row items-center h-8">
                <div className="solaimanlipi text-lg font-bold tracking-wide text-gray-500">
                  প্যাকেজ
                </div>
              </div>
            </li>
            <li>
              <Link
                to="/user/ready-questions-set"
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
                    <path d="M200-800v640-640 200-200Zm80 400h147q11-23 25.5-43t32.5-37H280v80Zm0 160h123q-3-20-3-40t3-40H280v80ZM200-80q-33 0-56.5-23.5T120-160v-640q0-33 23.5-56.5T200-880h320l240 240v92q-19-6-39-9t-41-3v-40H480v-200H200v640h227q11 23 25.5 43T485-80H200Zm480-400q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480Zm0 320q11 0 18.5-7.5T706-186q0-11-7.5-18.5T680-212q-11 0-18.5 7.5T654-186q0 11 7.5 18.5T680-160Zm-18-76h36v-10q0-11 6-19.5t14-16.5q14-12 22-23t8-31q0-29-19-46.5T680-400q-23 0-41.5 13.5T612-350l32 14q3-12 12.5-21t23.5-9q15 0 23.5 7.5T712-336q0 11-6 18.5T692-302q-6 6-12.5 12T668-276q-3 6-4.5 12t-1.5 14v14Z" />
                  </svg>
                </span>
                <span className="text-xl tracking-wide truncate sidebar_text solaimanlipi">
                  রেডি প্রশ্ন
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/user/lecture-shit-packages"
                className="relative flex flex-row items-center h-11 sidebar_list"
              >
                <span className="inline-flex justify-center items-center ml-4">
                  <LectureShitIcon size="20px" color="#000000" />
                </span>
                <span className="text-xl tracking-wide truncate sidebar_text solaimanlipi">
                  লেকচার শিট প্রশ্ন
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
                to="/user/self-questions-set"
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
            <li>
              <Link
                to="/user/self-subscriptions"
                className="relative flex flex-row items-center h-11 sidebar_list"
              >
                <span className="inline-flex justify-center items-center ml-4">
                  <SubscriptionIcon size="24px" color="#000000" />
                </span>
                <span className="text-xl tracking-wide truncate sidebar_text solaimanlipi">
                  আমার সাবস্ক্রিপশন গুলো
                </span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="overflow-y-auto overflow-x-hidden flex-grow"></div>
      </div>

      {/* Overlay for mobile (click to close sidebar) */}
      {size?.width <= 600 && isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-40 z-10"
        />
      )}
    </div>
  );
}
