import { useEffect, useState } from "react";
import { Button, Checkbox, cn, Form } from "@heroui/react";
import { Badge } from "@heroui/badge";
import { Input } from "@heroui/input";

import GoogleDriveIcon from "../../../assets/GoogleDriveIcon";
import { useGetAllSubjectsQuery } from "../../../redux/api/slices/subjectSlice";
import ClientLoader from "../../../utils/loader/ClientLoader";

import { useCreateAReadyQuestionSetsMutation } from "../../../redux/api/slices/readyQuestionsSetsSlice";
import Swal from "sweetalert2";

export default function SixToEightClasses() {
  const email = localStorage.getItem("email");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState({
    email: email,
    name: "",
    phoneNumber: "",
    packages: [],
    transactionId: "",
    status: false,
    totalPrice: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({ ...prev, [name]: value }));
  };

  const { data: getAllSubjects, isLoading: subjectLoader } =
    useGetAllSubjectsQuery();

  const [createAReadyQuestionSets, { isLoading: makeReadyQuestionSetLoader }] =
    useCreateAReadyQuestionSetsMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createAReadyQuestionSets(paymentInfo);
      if (res?.data) {
        Swal.fire({
          title:
            "আপনার অনুরোধটি জমা দেওয়া হয়েছে। অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন।",
          icon: "success",
          showCloseButton: true,
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        Swal.fire({
          title: "অনুরোধটি জমা দেওয়া যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।",
          icon: "error",
          showCloseButton: true,
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "কিছু ভুল হয়েছে: " + error?.message,
        icon: "error",
        showCloseButton: true,
        showConfirmButton: false,
        timer: 2000,
      });
    } finally {
      setPaymentInfo({ name: "", phoneNumber: "", transactionId: "" });
    }
  };

  // Check if all subjects from all groups are selected
  const areAllSubjectsSelected = () => {
    return groupedSubjects.every((group) =>
      group.subjects.every((subject) => selectedSubjects.includes(subject._id))
    );
  };

  // Select or deselect all subjects
  const toggleAllSubjects = () => {
    if (areAllSubjectsSelected()) {
      // Deselect all
      setSelectedSubjects([]);
    } else {
      // Select all
      const allSubjectIds = groupedSubjects.flatMap((group) =>
        group.subjects.map((subject) => subject._id)
      );
      setSelectedSubjects(allSubjectIds);
    }
  };

  const areAllSelected = (group) =>
    group.subjects.every((subject) => selectedSubjects.includes(subject._id));

  const toggleGroupSelection = (group) => {
    const allSelected = areAllSelected(group);
    const subjectIds = group.subjects.map((subject) => subject._id);

    if (allSelected) {
      // Remove all group subjects from selection
      setSelectedSubjects((prev) =>
        prev.filter((id) => !subjectIds.includes(id))
      );
    } else {
      // Add all group subjects to selection
      setSelectedSubjects((prev) => [...new Set([...prev, ...subjectIds])]);
    }
  };

  const handleToggleSubject = (id) => {
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };
  const classGroups = {
    ষষ্ঠ: "ষষ্ঠ",
    সপ্তম: "সপ্তম",
    অষ্টম: "অষ্টম",
  };

  const groupedSubjects = Object.entries(classGroups).map(
    ([groupLabel, className]) => {
      // Only keep subjects whose className matches exactly:
      const subjects = getAllSubjects.filter(
        (subject) => subject.subjectClassName?.className === className
      );

      return {
        label: groupLabel,
        className,
        subjects,
      };
    }
  );

  const calculateTotalPrice = () => {
    let total = 0;

    groupedSubjects.forEach((group) => {
      const selectedCount = group.subjects?.filter((subject) =>
        selectedSubjects?.includes(subject._id)
      ).length;

      if (selectedCount === group.subjects?.length) {
        total += 99;
      } else {
        total += selectedCount * 29;
      }
    });

    return total;
  };

  useEffect(() => {
    setPaymentInfo((prev) => ({
      ...prev,
      packages: selectedSubjects,
      totalPrice: calculateTotalPrice(),
    }));
  }, [selectedSubjects]);

  const banglaNumber = (num) => {
    const engToBn = {
      0: "০",
      1: "১",
      2: "২",
      3: "৩",
      4: "৪",
      5: "৫",
      6: "৬",
      7: "৭",
      8: "৮",
      9: "৯",
    };
    return num
      .toString()
      .split("")
      .map((digit) => engToBn[digit] || digit)
      .join("");
  };

  if (subjectLoader) {
    return <ClientLoader />;
  }

  return (
    <div className="ms-[275px] me-[20px] mt-20 solaimanlipi pb-5">
      <div className="bg-gradient-to-r from-amber-100 to-orange-50 py-6 mt-6">
        <p className="text-center font-bold solaimanlipi text-orange-700 text-5xl mt-6">
          রেডি প্রশ্ন প্যাকেজ: ষষ্ঠ থেকে অষ্টম শ্রেণী পর্যন্ত
        </p>
      </div>
      <div className="bg-gradient-to-r from-yellow-50 to-orange-100 py-10 mt-5 rounded-2xl shadow-lg border border-orange-200 max-w-full mx-auto px-4">
        <p className="text-center text-3xl text-orange-600 font-semibold tracking-wider animate-pulse">
          🎉 অফার! অফার! অফার! 🎉
        </p>
        <p className="text-5xl text-red-700 font-extrabold text-center mt-4 solaimanlipi drop-shadow-sm">
          মাত্র ৯৯ টাকায় এসএসসি মডেল প্রশ্ন!
        </p>
        <p className="text-center text-lg text-gray-600 mt-3">
          সীমিত সময়ের জন্য — আজই সংগ্রহ করুন!
        </p>
      </div>
      <div className="bg-yellow-50 py-10 px-6 rounded-xl shadow-md space-y-10 max-w-full mx-auto mt-8">
        <div>
          <h2 className="text-center text-xl font-bold text-orange-600 flex items-center gap-2 mb-4">
            <span className="text-center text-2xl">🧑‍🏫</span> যাদের জন্য তৈরি
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-700">
            <div className="flex items-center justify-center gap-2 text-xl">
              <span>✔️</span> শিক্ষক
            </div>
            <div className="flex items-center  justify-center  gap-2 text-xl">
              <span>✔️</span> অভিভাবক
            </div>
            <div className="flex items-center justify-center gap-2 text-xl">
              <span>✔️</span> কোচিং পরিচালক
            </div>
            <div className="flex items-center justify-center gap-2 text-xl">
              <span>✔️</span> শিক্ষার্থী
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-orange-600 flex items-center gap-2 mb-4">
            <span className="text-2xl">📦</span> যা পাবেন এই প্যাকেজে
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-xl">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                ✔️ সাধারণ গণিত = ৬ সেট
              </li>
              <li className="flex items-center gap-2">
                ✔️ উচ্চতর গণিত = ৫/৬ সেট
              </li>
              <li className="flex items-center gap-2">✔️ রসায়ন = ৪/৫ সেট</li>
              <li className="flex items-center gap-2">
                ✔️ পদার্থবিজ্ঞান = ৪/৫ সেট
              </li>
              <li className="flex items-center gap-2">
                ✔️ জীববিজ্ঞান = ৪/৫ সেট
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                ✔️ প্রতি অধ্যায়ে ৪ সেট প্রশ্ন
              </li>
              <li className="flex items-center gap-2">
                ✔️ প্রতিটি প্রশ্নের উত্তরসহ
              </li>
              <li className="flex items-center gap-2">
                ✔️ এসএসসি পরীক্ষার উপযোগী গুরুত্বপূর্ণ বাইহুকৃত প্রশ্ন
              </li>
              <li className="flex items-center gap-2">
                ✔️ Word + PDF দুইটাই পাওয়া যাবে
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-orange-50 border-l-4 border-r-4 border-orange-400 p-4 rounded-lg shadow-sm max-w-full mx-auto mt-6 mb-10">
        <p className="text-orange-700 text-2xl font-semibold flex items-center gap-2 text-center justify-center">
          📢 নোটিশ:{" "}
          <span className="font-normal text-xl">
            পেমেন্ট করার পর অটোমেটিক এক্সেল চলে যাবে আপনার ইমেইল এ।
          </span>
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center shadow-sm max-w-full mx-auto mt-6">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 text-green-700 font-bold text-lg mb-4">
          <span className="text-2xl">✅</span>
          <span>নমুনা দেখুন</span>
        </div>

        {/* Action Button */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition">
          <span className="text-gray-600">
            <GoogleDriveIcon size="20px" color="#000000" />
          </span>
          <a
            href="https://drive.google.com/your-demo-link-here"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <button className="text-lg font-medium text-gray-700 rounded-md hover:bg-gray-100 transition">
              নমুনা দেখতে এখানে ক্লিক করুন
            </button>
          </a>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-6 mt-6">
        {groupedSubjects.map((group, index) => (
          <div
            key={index}
            className="ps-6 pe-6 w-full bg-green-50 border border-green-200 rounded-xl shadow-sm py-5 mb-6"
          >
            <div className="flex justify-between items-center">
              <p className="text-xl font-bold solaimanlipi">
                {group?.label} শ্রেণী
              </p>
              <Badge
                content="১০% ছাড়!"
                color="success"
                className="text-sm font-semibold solaimanlipi px-2 py-1 rounded-full shadow-md"
              >
                <Checkbox
                  color="success"
                  isSelected={areAllSelected(group)}
                  onValueChange={() => toggleGroupSelection(group)}
                  classNames={{
                    base: cn(
                      "inline-flex w-full bg-white",
                      "hover:bg-green-50 transition-colors duration-300",
                      "items-center justify-between",
                      "cursor-pointer rounded-xl gap-3 border border-gray-300",
                      "shadow-sm data-[selected=true]:border-green-500 data-[selected=true]:shadow-md"
                    ),
                    label:
                      "w-full flex justify-between items-center font-medium text-gray-700",
                  }}
                >
                  <span className="text-base solaimanlipi">
                    সবগুলো ৯৯ টাকায়
                  </span>
                </Checkbox>
              </Badge>
            </div>

            <div className="w-full mt-5 mb-5 space-y-4">
              {group.subjects.map((subject, idx) => (
                <Checkbox
                  key={idx}
                  color="success"
                  classNames={{
                    base: cn(
                      "inline-flex w-full max-w-full bg-white",
                      "hover:bg-green-50 transition-colors duration-300",
                      "items-center justify-start",
                      "cursor-pointer rounded-xl gap-3 p-4 border-2 border-dashed border-gray-300",
                      "data-[selected=true]:border-green-500 data-[selected=true]:bg-green-50"
                    ),
                    label: "w-full",
                  }}
                  isSelected={selectedSubjects.includes(subject._id)}
                  onValueChange={() => handleToggleSubject(subject._id)}
                >
                  <div className="w-full flex justify-between items-center gap-2">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg font-semibold text-gray-700 solaimanlipi">
                        {subject.subjectName}
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg font-semibold text-green-600 solaimanlipi">
                        ২৯ টাকা
                      </span>
                    </div>
                  </div>
                </Checkbox>
              ))}
            </div>
          </div>
        ))}

        <div></div>
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="flex justify-end items-center mb-4">
          <Badge
            content="১০% ছাড়!"
            color="success"
            className="text-sm font-semibold solaimanlipi px-2 py-1 rounded-full shadow-md"
          >
            <Checkbox
              color="success"
              isSelected={areAllSubjectsSelected()}
              onValueChange={toggleAllSubjects}
              classNames={{
                base: cn(
                  "inline-flex bg-white",
                  "hover:bg-green-100 transition-colors duration-300",
                  "items-center justify-start",
                  "cursor-pointer rounded-xl gap-3 border border-green-300 px-5",
                  "shadow-sm data-[selected=true]:border-green-600 data-[selected=true]:bg-green-50 data-[selected=true]:shadow-md"
                ),
                label: "font-semibold text-green-800 solaimanlipi",
              }}
            >
              সব গ্রুপের সব বিষয়ের প্যাক (১৯৯ টাকা করে)
            </Checkbox>
          </Badge>
        </div>

        <div className="mt-3 flex justify-end">
          <div className="bg-green-100 border-l-4 border-r-4 border-green-500 px-6 py-4 rounded-xl shadow-lg animate-pulse hover:animate-none transition-all duration-300">
            <p className="text-2xl font-extrabold text-green-800 solaimanlipi tracking-wide">
              মোট মূল্য:
              <span className="ml-2 text-3xl text-green-900 underline decoration-dotted decoration-2">
                {banglaNumber(calculateTotalPrice())} টাকা
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 mb-5">
        <div className="max-w-full mx-auto bg-white shadow-2xl rounded-2xl p-6 md:p-8 mt-8 border border-green-100/50 bg-gradient-to-b from-green-50/20 to-white">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-green-800 solaimanlipi mb-2">
              পেমেন্ট তথ্য দিন
            </h2>
            <p className="text-gray-600 solaimanlipi">
              নিরাপদ লেনদেনের জন্য আপনার তথ্য সঠিকভাবে প্রদান করুন
            </p>
          </div>

          <Form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-2 gap-5 w-full">
              {/* Name Input */}
              <Input
                label="পুরো নাম"
                isRequired
                name="name"
                onChange={handleInputChange}
                value={paymentInfo.name}
                type="text"
                startContent={<span className="text-gray-400">👤</span>}
                className="solaimanlipi"
                classNames={{
                  inputWrapper:
                    "border-1 border-green-200/80 hover:border-green-300 h-14 bg-white shadow-sm",
                  input: "text-lg placeholder:text-gray-400",
                  label: "text-base font-medium text-gray-700 mb-1",
                }}
              />

              {/* Phone Input */}
              <Input
                label="ফোন নম্বর"
                isRequired
                type="tel"
                name="phoneNumber"
                onChange={handleInputChange}
                value={paymentInfo?.phoneNumber}
                startContent={<span className="text-gray-400">📱</span>}
                classNames={{
                  inputWrapper:
                    "border-1 border-green-200/80 hover:border-green-300 h-14 bg-white shadow-sm",
                  input: "text-lg placeholder:text-gray-400",
                  label: "text-base font-medium text-gray-700 mb-1",
                }}
                description="বিকাশ নম্বরটি অবশ্যই এই নাম্বারে রেজিস্টার্ড থাকতে হবে"
              />

              {/* Payment Method */}
              <div className="col-span-full">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">📲</span>
                    <div>
                      <p className="font-semibold text-lg text-green-800 solaimanlipi">
                        বিকাশ পেমেন্ট নির্দেশিকা
                      </p>
                      <p className="text-md text-gray-600 solaimanlipi">
                        ১। বিকাশ এ Send Money অপশনে যান
                        <br />
                        ২। নিচের নম্বরে টাকা পাঠান
                      </p>
                    </div>
                  </div>
                  <Input
                    label="বিকাশ নম্বর"
                    value="০১৮৯৮৭৯০৩৮২৭"
                    isReadOnly
                    classNames={{
                      inputWrapper:
                        "bg-green-100/50 border border-green-200 h-14",
                      input:
                        "text-lg font-semibold text-green-800 tracking-wide",
                      label: "text-base font-medium text-gray-700 mb-1",
                    }}
                  />
                </div>
              </div>

              {/* Transaction ID */}
              <Input
                label="ট্রানজেকশন আইডি"
                isRequired
                type="text"
                name="transactionId"
                onChange={handleInputChange}
                value={paymentInfo?.transactionId}
                startContent={<span className="text-gray-400">🔢</span>}
                classNames={{
                  inputWrapper:
                    "border-1 border-green-200/80 hover:border-green-300 h-14 bg-white shadow-sm",
                  input: "text-lg placeholder:text-gray-400 uppercase",
                  label: "text-base font-medium text-gray-700 mb-1",
                }}
                description="TRXID লিখুন (যেমন: 8A4BC5DEF)"
              />
            </div>

            {/* Payment Button */}
            <Button
              type="submit"
              isLoading={makeReadyQuestionSetLoader}
              color="success"
              className="w-full py-6 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-green-200/50"
            >
              <span className="text-xl font-semibold text-white solaimanlipi tracking-wide">
                পেমেন্ট নিশ্চিত করুন →
              </span>
            </Button>

            {/* Security Assurance */}
            <div className="text-center pt-4">
              <div className="inline-flex items-center gap-2 text-lg text-gray-500">
                <span className="text-green-600">🔒</span>
                <span className="solaimanlipi">
                  সবগুলো তথ্য নিরাপদে সংরক্ষণ করা হয়
                </span>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
