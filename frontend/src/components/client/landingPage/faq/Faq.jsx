import { Accordion, AccordionItem } from "@heroui/react";

export default function Faq() {
  // const onChange = (key) => {
  //   console.log(key);
  // };
  return (
    <div
      style={{
        marginTop: "30px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <p className="text-center text-5xl font-bold solaimanlipi">
        🔍 যে প্রশ্নই খুঁজছেন — আমরা তৈরি করে রেখেছি!
      </p>

      <Accordion className="mt-5">
        <AccordionItem
          key="1"
          className="border-2 border-[#024645] ps-3 rounded-xl pe-3 mt-5"
          aria-label="E-examapp এর সুবিধা কি কি ?"
          title={
            <p className="solaimanlipi text-xl">E-examapp এর সুবিধা কি কি ?</p>
          }
        >
          <ul className="max-w-md space-y-1 list-inside">
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
                প্রশ্ন সম্পাদনা, জলছাপ, ঠিকানা, লোগো এবং মটো যোগ করা যাবে
              </p>
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
              <p style={{ marginLeft: "8px" }}>
                অটোমেটিকভাবে প্রতিষ্ঠানের নাম, সময়, পূর্ণমান, নির্দেশনা, বিষয়
                এবং অধ্যায়ের নাম যুক্ত হবে{" "}
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
              <p style={{ marginLeft: "8px" }}>OMR সিস্টেম সংযুক্ত করা যাবে </p>
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
                ফন্ট, কলাম সংখ্যা, ডিভাইডার, সাইজ পরিবর্তন করা যাবে
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
                অপশন/প্রশ্নের স্টাইল এবং সেট/বিষয় কোড কাস্টমাইজ করা যাবে,ইত্যাদি{" "}
              </p>
            </li>
          </ul>
        </AccordionItem>
        <AccordionItem
          key="2"
          className="border-2 border-[#024645] ps-3 rounded-xl pe-3 mt-5"
          aria-label="E-examapp এর সুবিধা কি কি ?"
          title={
            <p className="solaimanlipi text-xl">
              E-examapp প্রশ্ন তৈরীতে কাস্টমাইজেশন সমূহ:
            </p>
          }
        >
          <ul className="max-w-md space-y-1 list-inside">
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
                প্রশ্ন সম্পাদনা, জলছাপ, ঠিকানা, লোগো এবং মটো যোগ করা যাবে
              </p>
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
              <p style={{ marginLeft: "8px" }}>
                অটোমেটিকভাবে প্রতিষ্ঠানের নাম, সময়, পূর্ণমান, নির্দেশনা, বিষয়
                এবং অধ্যায়ের নাম যুক্ত হবে{" "}
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
              <p style={{ marginLeft: "8px" }}>OMR সিস্টেম সংযুক্ত করা যাবে </p>
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
                ফন্ট, কলাম সংখ্যা, ডিভাইডার, সাইজ পরিবর্তন করা যাবে
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
                অপশন/প্রশ্নের স্টাইল এবং সেট/বিষয় কোড কাস্টমাইজ করা যাবে,ইত্যাদি{" "}
              </p>
            </li>
          </ul>
        </AccordionItem>
        <AccordionItem
          key="3"
          className="border-2 border-[#024645] ps-3 rounded-xl pe-3 mt-5"
          aria-label="E-examapp এর সুবিধা কি কি ?"
          title={
            <p className="solaimanlipi text-xl">
              E-examapp এর প্রশ্ন বাছাই করার উপায়:
            </p>
          }
        >
          <ul className="max-w-md space-y-1 list-inside">
            <li className="flex items-center solaimanlipi text-lg">
              <svg
                className="w-4 h-4 text-green-500 me-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              <p style={{ marginLeft: "8px" }}>বিষয়ভিত্তিক বাছাই </p>
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
              <p style={{ marginLeft: "8px" }}>অধ্যায়ভিত্তিক বাছাই </p>
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
                বোর্ড ও নির্বাচনী পরীক্ষার প্রশ্ন{" "}
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
                প্রশ্নের ধরণ, সাইজ, সঠিকতা ইত্যাদি
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
              <p style={{ marginLeft: "8px" }}>ইউনিক প্রশ্ন তৈরি </p>
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
                চিত্রযুক্ত, বহুপদী, তথ্যভিত্তিক প্রশ্ন{" "}
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
                গাণিতিক, তত্ত্বীয় প্রশ্ন,ইত্যাদি ।{" "}
              </p>
            </li>
          </ul>
        </AccordionItem>

        <AccordionItem
          key="4"
          className="border-2 border-[#024645] ps-3 rounded-xl pe-3 mt-5"
          aria-label="E-examapp এর সুবিধা কি কি ?"
          title={
            <p className="solaimanlipi text-xl">
              E-examapp এর রেডি প্রশ্ন প্যাকেজের সুবিধা:
            </p>
          }
        >
          <ul className="max-w-md space-y-1 list-inside">
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
                কাস্টমাইজযোগ্য প্রশ্ন,উত্তরপত্র যুক্ত ফরম্যাট।{" "}
              </p>
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
              <p style={{ marginLeft: "8px" }}>অটোমেটিক গ্রেডিং সিস্টেম। </p>
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
              <p style={{ marginLeft: "8px" }}>সহজ ও দ্রুত ব্যবহার।</p>
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
                বৈচিত্র্যময় প্রশ্ন ধরনের অন্তর্ভুক্ত।
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
                প্রশ্নবাংক সংবলিত প্রশ্নের সুবিধা{" "}
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
                শিক্ষক,অভিভাবক ও ছাত্রদের জন্য সহজ ব্যবহার।{" "}
              </p>
            </li>
          </ul>
        </AccordionItem>
        <AccordionItem
          key="5"
          className="border-2 border-[#024645] ps-3 rounded-xl pe-3 mt-5"
          aria-label="E-examapp এর সুবিধা কি কি ?"
          title={
            <p className="solaimanlipi text-xl">
              নতুন প্রশ্ন কবে থেকে ডাটাবেসে যুক্ত হয়?
            </p>
          }
        >
          <ul className="max-w-md space-y-1 list-inside">
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
                নতুন প্রশ্ন সাধারণত প্রতি মাসে একবার বা নির্দিষ্ট সময় পরপর
                ডাটাবেসে যুক্ত হয়।
              </p>
            </li>
          </ul>
        </AccordionItem>

        <AccordionItem
          key="6"
          className="border-2 border-[#024645] ps-3 rounded-xl pe-3 mt-5"
          aria-label="E-examapp এর সুবিধা কি কি ?"
          title={
            <p className="solaimanlipi text-xl">
              অভিযোগ এবং ফিডব্যাক কিভাবে দিব?
            </p>
          }
        >
          <ul className="max-w-md space-y-1 list-inside">
            <li className="flex items-center solaimanlipi text-lg">
              <svg
                className="w-4 h-4 text-green-500 me-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              <p style={{ marginLeft: "8px" }}>ইমেইল: (hello@eexamapp.com)</p>
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
              <p style={{ marginLeft: "8px" }}>ফেসবুক পেজ লিংক: </p>
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
              <p style={{ marginLeft: "8px" }}>
                ফোন: আমাদের কাস্টমার সাপোর্ট নম্বরে (০১৩৪০৩৪৫৭৮৭){" "}
              </p>
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
              <p style={{ marginLeft: "8px" }}>
                ফিডব্যাক ফর্ম:ফেসবুক পেজে দেওয়া রিভিউ করে পাঠাতে পারেন।
              </p>
            </li>
          </ul>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
