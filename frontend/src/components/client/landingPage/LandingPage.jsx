import { Card } from "antd";
import MainNavbar from "../../common/mainNavbar/MainNavbar";
import Characteristics from "./characteristics/Characteristics";
import Counting from "./counting/Counting";
import NewQuestionText from "./newQuestionText/NewQuestionText";
import OneClickQuestion from "./oneClickQuestion/OneClickQuestion";

import { motion } from "framer-motion";

import { Divider } from "@heroui/divider";
import { Button } from "@heroui/react";
import { Badge } from "antd";
import { useNavigate } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";
import { ReactTyped } from "react-typed";
import { useGetAllMessageQuery } from "../../../redux/api/slices/AnnouncementSlice";
import Faq from "./faq/Faq";
import Footer from "./footer/Footer";

import { useWindowSize } from "@uidotdev/usehooks";

export default function LandingPage() {
  const navigate = useNavigate();
  const size = useWindowSize();

  const { data: getMessage } = useGetAllMessageQuery();

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // Variant for the gradient shine effect
  const shineVariants = {
    initial: { backgroundPosition: "0% 50%" },
    animate: {
      backgroundPosition: ["0% 50%", "100% 50%"],
      transition: { duration: 3, repeat: Infinity, ease: "linear" },
    },
  };

  return (
    <div className="w-full">
      <MainNavbar />
     <div className=" max-w-[1600px] mx-auto">
       <div className="mt-14 relative w-full bg-indigo-50 text-indigo-800 py-2 px-4 overflow-hidden border-b border-indigo-200 ">
        <div className="flex items-center space-x-2">
          <marquee className="solaimanlipi whitespace-nowrap animate-marquee text-lg font-medium">
            📢{" "}
            {getMessage?.map((msg) => (
              <span key={msg?._id}>{msg?.message}</span>
            ))}
          </marquee>
        </div>
      </div>
      <div
        className="ms-5 me-5"
        style={{
          marginLeft: "20px",
          marginRight: "20px",
        }}
      >
        <Badge.Ribbon
          text="নতুন সংস্করণ"
          style={{
            backgroundColor: "red",
            fontFamily: "solaimanlipi",
            fontSize: "20px",
          }}
        >
          <Card className="relative mt-5 flex flex-col items-center text-center p-2 md:p-5 border-1 border-[#024645] overflow-hidden">
            {/* Content */}
            <div className="relative z-10">
              <p
                className="solaimanlipi font-bold text-black"
                style={{
                  fontSize:
                    size?.width > 1280
                      ? "3.75rem"
                      : size?.width > 1024
                      ? "3rem"
                      : size?.width > 768
                      ? "2.25rem"
                      : size?.width > 480
                      ? "1.875rem"
                      : "1.5rem",
                }}
              >
                <span className="pil">SSC, HSC</span> সহ সকল শ্রেণীর জন্য{" "}
                <ReactTyped
                  backSpeed={50}
                  backDelay={2000}
                  loop
                  className="text-green-500"
                  strings={[
                    "প্রশ্ন তৈরী করুন!",
                    " ডিজিটাল প্রশ্নব্যাংক",
                    "বিষয়ভিত্তিক প্রশ্নব্যাংক",
                    "স্মার্ট এক্সাম প্রিপারেশন ব্যাংক",
                  ]}
                  typeSpeed={40}
                />
              </p>

              <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1"></div>
              <p className="solaimanlipi text-2xl font-bold text-black mt-2">
                সকল বিষয় এখানেই
              </p>
              <p
                style={{
                  fontSize:
                    size?.width > 1280
                      ? "3rem"
                      : size?.width > 1024
                      ? "2.50rem"
                      : size?.width > 768
                      ? "2rem"
                      : size?.width > 480
                      ? "1.5rem"
                      : "1.5rem",
                  marginBottom: "20px",
                  color: "#ed1c24",
                }}
                className="solaimanlipi text-2xl md:text-4xl font-bold"
              >
                বিজ্ঞান, মানবিক ও ব্যবসা বিভাগ!
              </p>

              <div className="mt-5 flex flex-col md:flex-row items-center justify-center w-full gap-4">
                <Button
                  onClick={() => navigate("/user/question-create")}
                  className="bg-[#ed1c2b] hover:bg-[#c91421] text-white solaimanlipi font-bold 
               text-base sm:text-lg md:text-xl lg:text-2xl rounded-2xl px-6 py-4 shadow-md"
                  size="lg"
                >
                  📝 প্রশ্ন তৈরি করুন
                </Button>

                <Button
                  onClick={() => navigate("/user/question-create-demo")}
                  className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white solaimanlipi font-bold 
               text-base sm:text-lg md:text-xl lg:text-2xl rounded-2xl px-6 py-4 shadow-md"
                  size="lg"
                >
                  🧾 নমুনা প্রশ্ন তৈরি করুন
                </Button>
              </div>
            </div>
          </Card>
        </Badge.Ribbon>

        <div
          className="ps-8 pe-8 pb-8 rounded-xl pt-8"
          style={{
            marginTop: "20px",
            backgroundColor: "#f3f4f6",
          }}
        >
          <motion.div
            className="flex justify-center"
            variants={headerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-5xl font-extrabold solaimanlipi bg-gradient-to-r from-[#024645] via-[#22c55e] to-[#01ff5e] bg-clip-text text-transparent bg-[length:200%_200%]"
              variants={shineVariants}
              initial="initial"
              animate="animate"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              প্রশ্ন তৈরি করার প্যাকেজ
            </motion.h1>
          </motion.div>

          <Divider />
          <div
            className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 gap-3 pt-4"
            style={{ marginTop: "20px" }}
          >
            <div
              style={{ backgroundColor: "#024645" }}
              onClick={() => navigate("/subscriptions?class=9,10,11,12")}
              className="block max-w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer"
            >
              <div>
                <div
                  className="text-center"
                  style={{ paddingTop: "40px", paddingBottom: "40px" }}
                >
                  <p className="text-white solaimanlipi text-3xl">
                    ১০ম - ১২শ শ্রেণী
                  </p>
                </div>
              </div>

              <Button
                style={{
                  backgroundColor: "#22c55e",
                  color: "white",
                  border: "none",
                  fontSize: "20px",
                }}
                onClick={() => navigate("/subscriptions?class=9,10,11,12")}
                className="w-full solaimanlipi"
                size="lg"
              >
                এখনই কিনুন
              </Button>
            </div>

            <div
              style={{ padding: "15px", backgroundColor: "#024645" }}
              onClick={() => navigate("/subscriptions?class=6,7,8")}
              className="block max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer"
            >
              <div>
                <div
                  className="text-center"
                  style={{ paddingTop: "40px", paddingBottom: "40px" }}
                >
                  <p className="text-white solaimanlipi text-3xl">
                    ৬ষ্ঠ - ৮ম শ্রেণী
                  </p>
                </div>
              </div>

              <Button
                style={{
                  backgroundColor: "#22c55e",
                  color: "white",
                  border: "none",
                  fontSize: "20px",
                }}
                onClick={() => navigate("/subscriptions?class=6,7,8")}
                className="w-full solaimanlipi"
                size="lg"
              >
                এখনই কিনুন
              </Button>
            </div>

            <div
              style={{ padding: "15px", backgroundColor: "#024645" }}
              // onClick={() => navigate("/subscriptions?class=1,2,3,4,5")}
              className="block max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100"
            >
              <div>
                <div
                  className="text-center"
                  style={{ paddingTop: "40px", paddingBottom: "40px" }}
                >
                  <p className="text-white solaimanlipi text-3xl">
                    ১ম - ৫ম শ্রেণী
                  </p>
                </div>
              </div>

              <Button
                style={{
                  backgroundColor: "#22c55e",
                  color: "white",
                  border: "none",
                  // marginTop: "10px",
                  fontSize: "20px",
                }}
                isDisabled
                onClick={() => navigate("/subscriptions?class=1,2,3,4,5")}
                className="w-full solaimanlipi"
                size="lg"
              >
                শীগ্রই আসছে!
              </Button>
            </div>
          </div>
        </div>

        <div
          className="ps-8 pe-8 pb-8 rounded-xl pt-8"
          style={{
            marginTop: "30px",
            backgroundColor: "#f3f4f6",
          }}
        >
          <motion.div
            className="flex justify-center"
            variants={headerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-5xl font-extrabold solaimanlipi bg-gradient-to-r from-[#024645] via-[#22c55e] to-[#01ff5e] bg-clip-text text-transparent bg-[length:200%_200%]"
              variants={shineVariants}
              initial="initial"
              animate="animate"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              রেডি প্রশ্ন প্যাকেজ
            </motion.h1>
          </motion.div>

          <Divider />
          <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 gap-3 pt-10">
            <div
              style={{ backgroundColor: "#024645" }}
              // onClick={() => navigate("/ready-questions-set/ten-twelve")}
              className="block max-w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100"
            >
              <div>
                <div
                  className="text-center"
                  style={{ paddingTop: "40px", paddingBottom: "40px" }}
                >
                  <p className="text-white solaimanlipi text-3xl">
                    ১০ম - ১২শ শ্রেণী
                  </p>
                </div>
              </div>

              <Button
                // onClick={() => navigate("/ready-questions-set/ten-twelve")}
                className="mt-2 w-full text-white text-xl solaimanlipi bg-[#22c55e]"
                size="lg"
                isDisabled
              >
                শীগ্রই আসছে!
              </Button>
            </div>

            <div
              // onClick={() => navigate("/ready-questions-set/six-eight")}
              style={{ padding: "15px", backgroundColor: "#024645" }}
              className="block max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100"
            >
              <div>
                <div
                  className="text-center"
                  style={{ paddingTop: "40px", paddingBottom: "40px" }}
                >
                  <p className="text-white solaimanlipi text-3xl">
                    ৬ষ্ঠ - ৮ম শ্রেণী
                  </p>
                </div>
              </div>

              <Button
                style={{
                  color: "white",
                  border: "none",
                  marginTop: "10px",
                  fontSize: "20px",
                }}
                isDisabled
                // onClick={() => navigate("/ready-questions-set/six-eight")}
                className="w-full solaimanlipi bg-[#22c55e]"
                size="lg"
              >
                শীগ্রই আসছে!
              </Button>
            </div>

            <div
              style={{ padding: "15px", backgroundColor: "#024645" }}
              // onClick={() => navigate("/ready-questions-set/one-five")}
              className="block max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100"
            >
              <div>
                <div
                  className="text-center"
                  style={{ paddingTop: "40px", paddingBottom: "40px" }}
                >
                  <p className="text-white solaimanlipi text-3xl">
                    ১ম - ৫ম শ্রেণী
                  </p>
                </div>
              </div>

              <Button
                style={{
                  color: "white",
                  border: "none",
                  marginTop: "10px",
                  fontSize: "20px",
                }}
                isDisabled
                // onClick={() => navigate("/ready-questions-set/one-five")}
                className="w-full solaimanlipi bg-[#22c55e]"
                size="lg"
              >
                শীগ্রই আসছে!
              </Button>
            </div>
          </div>
        </div>

        <div
          className="p-8 rounded-xl"
          style={{
            marginTop: "20px",
            backgroundColor: "#f3f4f6",
          }}
        >
          <motion.div
            className="flex justify-center"
            variants={headerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-5xl font-extrabold solaimanlipi bg-gradient-to-r from-[#024645] via-[#22c55e] to-[#01ff5e] bg-clip-text text-transparent bg-[length:200%_200%]"
              variants={shineVariants}
              initial="initial"
              animate="animate"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              লেকচার শিট প্যাকেজ
            </motion.h1>
          </motion.div>

          <Divider />
          <div
            className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 gap-3 pt-4"
            style={{ marginTop: "20px" }}
          >
            <div
              style={{ padding: "15px", backgroundColor: "#024645" }}
              // onClick={() => navigate("/lecture-shit-questions-set/ten-twelve")}
              className="block max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100"
            >
              <div>
                <div
                  className="text-center"
                  style={{ paddingTop: "40px", paddingBottom: "40px" }}
                >
                  <p className="text-white solaimanlipi text-3xl">
                    ১০ম - ১২শ শ্রেণী
                  </p>
                </div>
              </div>

              <Button
                style={{
                  color: "white",
                  border: "none",
                  marginTop: "10px",
                  fontSize: "20px",
                }}
                isDisabled
                // onClick={() =>
                //   navigate("/lecture-shit-questions-set/ten-twelve")
                // }
                className="w-full solaimanlipi bg-[#22c55e]"
                size="lg"
              >
                শীগ্রই আসছে!
              </Button>
            </div>

            <div
              // onClick={() => navigate("/lecture-shit-questions-set/six-eight")}
              style={{ padding: "15px", backgroundColor: "#024645" }}
              className="block max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100"
            >
              <div>
                <div
                  className="text-center"
                  style={{ paddingTop: "40px", paddingBottom: "40px" }}
                >
                  <p className="text-white solaimanlipi text-3xl">
                    ৬ষ্ঠ - ৮ম শ্রেণী
                  </p>
                </div>
              </div>

              <Button
                // onClick={() =>
                //   navigate("/lecture-shit-questions-set/six-eight")
                // }
                style={{
                  color: "white",
                  border: "none",
                  marginTop: "10px",
                  fontSize: "20px",
                }}
                isDisabled
                className="w-full solaimanlipi bg-[#22c55e]"
                size="lg"
              >
                শীগ্রই আসছে!
              </Button>
            </div>

            <div
              // onClick={() => navigate("/lecture-shit-questions-set/one-five")}
              style={{ padding: "15px", backgroundColor: "#024645" }}
              className="block max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100"
            >
              <div>
                <div
                  className="text-center"
                  style={{ paddingTop: "40px", paddingBottom: "40px" }}
                >
                  <p className="text-white solaimanlipi text-3xl">
                    ১ম - ৫ম শ্রেণী
                  </p>
                </div>
              </div>

              <Button
                // onClick={() => navigate("/lecture-shit-questions-set/one-five")}
                style={{
                  color: "white",
                  border: "none",
                  marginTop: "10px",
                  fontSize: "20px",
                }}
                isDisabled
                className="w-full solaimanlipi bg-[#22c55e]"
                size="lg"
              >
                শীগ্রই আসছে!
              </Button>
            </div>
          </div>
        </div>

        <Counting />

        <OneClickQuestion />
        <NewQuestionText />
        <Characteristics />
        {/* <Reviews /> */}
        <Faq />
      </div>
     </div>
      <Footer />
      <ScrollToTop
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "50%",
          backgroundColor: "#e26062",
        }}
        smooth
        color="white"
      />
    </div>
  );
}
