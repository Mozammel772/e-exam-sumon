import { Button, Card } from "@heroui/react";
import React, { useState } from "react";
import GoogleDriveIcon from "../../../assets/GoogleDriveIcon";
import { Checkbox } from "@heroui/checkbox";
import { Badge } from "@heroui/badge";

export default function Offers() {
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const subjects = [
    { name: "গণিত", price: 49 },
    { name: "উচ্চতর গণিত", price: 49 },
    { name: "পদার্থবিজ্ঞান", price: 49 },
    { name: "রসায়ন", price: 49 },
    { name: "জীববিজ্ঞান", price: 49 },
  ];
  const fullPackagePrice = 199;
  const isFullPackage = selectedSubjects.length === subjects.length;

  const toggleSubject = (subject) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const toggleFullPackage = () => {
    if (isFullPackage) {
      setSelectedSubjects([]);
    } else {
      setSelectedSubjects(subjects.map((s) => s.name));
    }
  };

  const totalPrice = isFullPackage
    ? fullPackagePrice
    : selectedSubjects.length * 49;

  return (
    <div className="mt-24 container mx-auto solaimanlipi">
      <div className="border-none pt-8">
        <div className="w-full mx-auto p-4 bg-yellow-200 border border-yellow-300 rounded-lg shadow-lg text-center">
          {/* Small Text */}
          <p className="text-gray-600 text-xl font-semibold">
            অফার ! অফার ! অফার !
          </p>

          {/* Main Offer Text */}
          <h2 className="text-4xl font-bold text-red-600 mt-1">
            মাত্র ৯৯ টাকায় এসএসসি মডেল প্রশ্ন
          </h2>

          {/* Limited Time Offer */}
          <p className="text-gray-700 text-lg font-medium mt-1">
            অফারটি শুধুমাত্র আজকের জন্য
          </p>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg border border-gray-200 mt-5 mb-5">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="font-semibold text-gray-700 text-center text-3xl">
            যাদের জন্য তৈরি
          </span>
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 bg-white p-2 rounded-md shadow-sm">
            <span className="text-gray-700 text-xl">শিক্ষক</span>
          </div>
          <div className="flex items-center gap-2 bg-white p-2 rounded-md shadow-sm">
            <span className="text-gray-700 text-xl">কোচিং পরিচালক</span>
          </div>
          <div className="flex items-center gap-2 bg-white p-2 rounded-md shadow-sm">
            <span className="text-gray-700 text-xl">অভিভাবক</span>
          </div>
          <div className="flex items-center gap-2 bg-white p-2 rounded-md shadow-sm">
            <span className="text-gray-700 text-xl">শিক্ষার্থী</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Package Details Section */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="font-semibold text-gray-700 text-3xl">
              যা পাবেন এই প্যাকেজে
            </span>
          </div>

          {/* List Items */}
          <ul className="space-y-2">
            {[
              "সাধারণ গণিত = ৬৮ সেট",
              "উচ্চতর গণিত = ৫৫ সেট",
              "রসায়ন = ৪৮ সেট",
              "পদার্থবিজ্ঞান = ৫৫ সেট",
              "জীববিজ্ঞান = ৫৫ সেট",
              "প্রতি অধ্যায়ে ৪ সেট প্রশ্ন",
              "প্রতি প্রশ্নের উত্তরপত্র",
              "এসএসসি পরীক্ষার উপযোগী গুরুত্বপূর্ণ বাহিরকৃত প্রশ্ন",
              "ওয়ার্ড + পিডিএফ দুটোই পাওয়া যাবে",
            ].map((item, index) => (
              <li
                key={index}
                className="flex justify-center items-center gap-2 bg-white p-2 rounded-md shadow-sm"
              >
                <span className="text-gray-700 text-center text-xl">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Sample Section */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="font-semibold text-gray-700 text-3xl">নমুনা</span>
          </div>

          {/* Sample Button */}
          <div className="flex items-center justify-center gap-2 bg-white p-3 rounded-md border border-gray-300 shadow-sm">
            <Button
              startContent={<GoogleDriveIcon size="24px" />}
              className="bg-[#024544] text-xl text-white"
            >
              নমুনা দেখতে এখানে ক্লিক করুন
            </Button>
          </div>
        </div>

        {/* Countdown Section */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-gray-200 text-center">
          <h3 className="text-3xl font-semibold text-gray-700">
            অফার শেষ হতে সময় বাকি
          </h3>
          <div className="flex justify-center gap-4 mt-3">
            {[
              { time: "৩", label: "ঘণ্টা" },
              { time: "৩২", label: "মিনিট" },
              { time: "৪৬", label: "সেকেন্ড" },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-3 rounded-lg shadow-md text-center w-20"
              >
                <span className="block text-3xl font-bold text-gray-800">
                  {item.time}
                </span>
                <span className="text-lg text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto space-y-4 p-4">
        {/* Class Selection Section */}
        <div className="bg-white p-4 rounded-lg shadow-md border">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Class 10</h3>
            <div className="flex items-center gap-2">
              <Checkbox
                color="success"
                isSelected={isFullPackage}
                onValueChange={toggleFullPackage}
              >
                <Badge color="success" content="Save 60%">
                  <span className="text-lg">
                    সবগুলো {fullPackagePrice} টাকা
                  </span>
                </Badge>
              </Checkbox>
            </div>
          </div>
          <ul className="space-y-2">
            {subjects.map((subject, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-100 p-2 rounded-md shadow-sm"
              >
                <Checkbox
                  isSelected={selectedSubjects.includes(subject.name)}
                  onValueChange={() => toggleSubject(subject.name)}
                >
                  <span className="text-xl">{subject.name}</span>
                </Checkbox>
                <span>{subject.price} BDT</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Checkout Section */}
        <div className="bg-white p-4 rounded-lg shadow-md border">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-2xl font-semibold">মোট -</h3>
            <h3 className="text-lg font-semibold">{totalPrice} BDT</h3>
          </div>
          <input
            type="email"
            placeholder="আপনার ইমেইল দিন*"
            className="w-full p-2 border rounded-md mb-2 text-lg"
          />
          <input
            type="tel"
            placeholder="মোবাইল নাম্বার দিন*"
            className="w-full p-2 border rounded-md mb-2 text-lg"
          />
          <div className="bg-yellow-100 text-yellow-700 p-2 rounded-md text-lg text-center border border-yellow-400 mb-3">
            ১ সেকেন্ডে এ অটোমেটিক আপনার ইমেইলে চলে যাবে ফাইল
          </div>
          <Button className="w-full bg-green-500 text-white py-2 rounded-md text-xl font-semibold">
            কিনুন
          </Button>
        </div>
      </div>
    </div>
  );
}
