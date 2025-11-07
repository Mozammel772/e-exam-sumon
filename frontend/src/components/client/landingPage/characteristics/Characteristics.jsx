import React from "react";
import ExamIcon from "../../../../assets/ExamIcon";
import { Button } from "antd";

export default function Characteristics() {
  return (
    <div style={{ marginTop: "30px" }}>
      <p className="text-center solaimanlipi text-4xl font-bold italic">
        <span className="inter">E-Exam App</span> - এর বৈশিষ্ট্য
      </p>
      <div style={{ marginTop: "30px" }}>
        <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              backgroundColor: "#024645",
              borderTopLeftRadius: "8px",
              borderBottomLeftRadius: "8px",
              paddingTop: "50px",
              paddingBottom: "50px",
            }}
          >
            <ExamIcon />
            <p className="text-center solaimanlipi text-5xl text-white">
              অনলাইন প্রশ্ন তৈরী
            </p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              borderTopRightRadius: "8px",
              borderBottomRightRadius: "8px",
              paddingTop: "30px",
              paddingBottom: "30px",
              border: "1px solid #024645",
            }}
          >
            <ul
              style={{ marginLeft: "30px", color: "#000000" }}
              className="max-w-md space-y-1 text-white list-inside"
            >
              <li className="flex items-center solaimanlipi text-lg">
                <svg
                  className="w-4 h-4 text-green-500 me-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>
                <p style={{ marginLeft: "8px" }}>
                  ১ ক্লিকে স্বয়ংক্রিয় প্রশ্নপত্র তৈরি.
                </p>
              </li>
              <li className="flex items-center solaimanlipi text-lg text-black">
                <svg
                  className="w-4 h-4 text-green-500 me-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>
                <p style={{ marginLeft: "8px" }}>টাইম-সেভিং টেমপ্লেট.</p>
              </li>
              <li className="flex items-center solaimanlipi text-lg text-black">
                <svg
                  className="w-4 h-4 text-green-500 me-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>
                <p style={{ marginLeft: "8px" }}>
                  বোর্ড, ভর্তি ও নির্বাচনী পরীক্ষার প্রশ্ন ব্যাংক.
                </p>
              </li>
              <li className="flex items-center solaimanlipi text-lg text-black">
                <svg
                  className="w-4 h-4 text-green-500 me-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>
                <p style={{ marginLeft: "8px" }}>
                  বিষয়, অধ্যায় ও টপিক অনুযায়ী প্রশ্ন নির্বাচন.
                </p>
              </li>
              <li className="flex items-center solaimanlipi text-lg text-black">
                <svg
                  className="w-4 h-4 text-green-500 me-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>
                <p style={{ marginLeft: "8px" }}>
                  চিত্রযুক্ত, MCQ, গণিত ও লিখিত প্রশ্ন ফিল্টার.
                </p>
              </li>
              <li className="flex items-center solaimanlipi text-lg text-black">
                <svg
                  className="w-4 h-4 text-green-500 me-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>
                <p style={{ marginLeft: "8px" }}>
                  ফন্ট সাইজ, কলাম, লোগো ও জলছাপ কাস্টমাইজ.
                </p>
              </li>
              <li className="flex items-center solaimanlipi text-lg text-black">
                <svg
                  className="w-4 h-4 text-green-500 me-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>
                <p style={{ marginLeft: "8px" }}>
                  প্রশ্নপত্র সম্পাদনা ও ডিজাইন পরিবর্তন সুবিধা.
                </p>
              </li>
              <li className="flex items-center solaimanlipi text-lg text-black">
                <svg
                  className="w-4 h-4 text-green-500 me-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>
                <p style={{ marginLeft: "8px" }}>প্রিন্ট-রেডি আউটপুট.</p>
              </li>
            </ul>

            <p
              className="solaimanlipi text-2xl font-bold"
              style={{
                marginLeft: "30px",
                marginTop: "20px",
                marginBottom: "10px",
              }}
            >
              🚀 সহজ, দ্রুত ও কাস্টমাইজড প্রশ্নপত্র তৈরি করুন!
            </p>

            <Button
              onClick={() => window.open("/user/question-create")}
              className="text-white border-none text-lg solaimanlipi"
              style={{
                marginTop: "15px",
                marginBottom: "15px",
                backgroundColor: "#f8bb62",
                border: "none",
                color: "black",
                fontSize: "21px",
                marginLeft: "30px",
                marginRight: "30px",
              }}
              size="large"
            >
              প্রশ্ন তৈরী করুন
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
