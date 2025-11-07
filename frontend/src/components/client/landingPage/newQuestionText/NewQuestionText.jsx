import React from "react";

export default function NewQuestionText() {
  return (
    <div
      style={{
        marginTop: "30px",
        backgroundColor: "#f3f4f6",
        padding: "20px",
      }}
    >
      <p
        style={{ paddingTop: "30px" }}
        className="text-center font-bold text-4xl solaimanlipi"
      >
        নতুন প্রশ্ন পাওয়ার সবচেয়ে দ্রুত ঠিকানা!
      </p>
      <p
        style={{ paddingTop: "10px" }}
        className="text-center text-xl solaimanlipi"
      >
        পাবলিক পরীক্ষা শেষ হওয়ার সাথে সাথে প্রশ্ন আপডেট হয় আমাদের প্ল্যাটফর্মে —
        eExamApp.com
      </p>

      <div
        className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 gap-5"
        style={{ marginTop: "30px", marginBottom: "30px" }}
      >
        <div
          style={{ padding: "15px", backgroundColor: "#024645" }}
          className="block max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100"
        >
          <div
            style={{
              //   marginTop: "11px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            className="solaimanlipi text-xl font-bold text-white"
          >
            বোর্ড প্রশ্ন
          </div>
        </div>
        <div
          style={{ padding: "15px", backgroundColor: "#024645" }}
          className="block max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100"
        >
          <div
            style={{
              //   marginTop: "15px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            className="solaimanlipi text-xl font-bold text-white"
          >
            নির্বচনী পরীক্ষার প্রশ্ন
          </div>
        </div>
        <div
          style={{ padding: "15px", backgroundColor: "#024645" }}
          className="block max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100"
        >
          <div
            style={{
              //   marginTop: "15px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            className="solaimanlipi text-xl font-bold text-white"
          >
            এডমিশন
          </div>
        </div>
        <div
          style={{ padding: "15px", backgroundColor: "#024645" }}
          className="block max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100"
        >
          <div
            style={{
              //   marginTop: "15px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            className="solaimanlipi text-xl font-bold text-white"
          >
            মেডিকেল
          </div>
        </div>
      </div>
    </div>
  );
}
