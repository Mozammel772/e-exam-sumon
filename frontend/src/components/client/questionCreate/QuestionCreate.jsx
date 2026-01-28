
import { Button, Card, Input, Select, SelectItem } from "@heroui/react";
import { useWindowSize } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { useGetAllClassesQuery } from "../../../redux/api/slices/classSlice";
import { useCreateAExamSetMutation } from "../../../redux/api/slices/examSetSlice";
import { useGetAllExamsQuery } from "../../../redux/api/slices/examSlice";
import { useGetASubjectQuery } from "../../../redux/api/slices/subjectSlice";
import { useGetASubscriptionInfoOfAnUserQuery } from "../../../redux/api/slices/subscriptionSlice";
import ClientLoader from "../../../utils/loader/ClientLoader";

export const examType = [
  { key: "সাপ্তাহিক পরীক্ষা", label: "সাপ্তাহিক পরীক্ষা" },
  { key: "মডেল টেস্ট", label: "মডেল টেস্ট" },
  { key: "অর্ধ-বার্ষিক পরীক্ষা", label: "অর্ধ-বার্ষিক পরীক্ষা" },
  { key: "বার্ষিক পরীক্ষা", label: "বার্ষিক পরীক্ষা" },
];

export default function QuestionCreate() {
  const navigate = useNavigate();
  const size = useWindowSize();
  const email = localStorage.getItem("email");

  const [changeSubjectId, setChangeSubjectId] = useState(null);
  const [classFilteredPackages, setClassFilteredPackages] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    className: "",
    chapterId: [],
    examCategory: "",
    examType: "",
    marks: 30,
    email,
  });

  // Fetch data
  const { data: classes, isLoading: classLoader } = useGetAllClassesQuery();
  const { data: exams } = useGetAllExamsQuery();
  const { data: subscriptionData, isLoading: subscriptionLoader } =
    useGetASubscriptionInfoOfAnUserQuery(email);
  const { data: subjectData, isLoading: subjectLoader } = useGetASubjectQuery(
    changeSubjectId,
    { skip: !changeSubjectId },
  );
  const [createAExamSet, { isLoading }] = useCreateAExamSetMutation();

  /* ---------- CORRECTED ELIGIBILITY ---------- */
  // প্রথমে সব প্রপার্টি আলাদাভাবে সংজ্ঞায়িত করি
  const isUserVerified = subscriptionData?.user?.isVerified;
  const hasSubscription = subscriptionData?.user?.subscription;

  // বিভিন্ন জায়গায় isApproved চেক করি
  const isSubscriptionApproved =
    subscriptionData?.user?.isSubscriptionApproved ||
    subscriptionData?.subscriptions?.[0]?.isApproved ||
    subscriptionData?.user?.subscription?.isApproved ||
    true; // যদি API তে এই ফিল্ড না থাকে তবে default true ধরি

  const hasPackages = subscriptionData?.packages?.length > 0;

  // Boolean হিসেবে convert করি
  const isEligible = Boolean(
    isUserVerified && hasSubscription && isSubscriptionApproved && hasPackages,
  );

  /* ---------- FILTER CLASSES ---------- */
  useEffect(() => {
    if (!subscriptionData?.packages || !classes) {
      setClassFilteredPackages([]);
      return;
    }

    // Filter unique classes from packages
    const uniqueClassesMap = new Map();

    subscriptionData.packages.forEach((pkg, index) => {
      const classId = pkg.subjectClassName?._id;
      if (classId) {
        const classInfo = classes.find((c) => c._id === classId);
        if (classInfo) {
          if (!uniqueClassesMap.has(classId)) {
            const subjectsInThisClass = subscriptionData.packages.filter(
              (p) => p.subjectClassName?._id === classId,
            );
            uniqueClassesMap.set(classId, {
              _id: classId,
              className: classInfo.className,
              subjectCount: subjectsInThisClass.length,
              // Debug info
              subjects: subjectsInThisClass.map((s) => s.subjectName),
            });
          }
        } else {
          console.log(`Class not found for ID: ${classId}`);
        }
      } else {
        console.log(`Package ${index + 1} has no class ID`);
      }
    });

    const uniqueClasses = Array.from(uniqueClassesMap.values());

    setClassFilteredPackages(uniqueClasses);
  }, [subscriptionData, classes]);

  /* ---------- GET SUBJECTS FOR SELECTED CLASS ---------- */
  const getSubjectsForSelectedClass = () => {
    if (!formData.className || !subscriptionData?.packages) {
      return [];
    }

    const subjects = subscriptionData.packages.filter(
      (pkg) => pkg.subjectClassName?._id === formData.className,
    );

    return subjects;
  };

  /* ---------- HANDLERS ---------- */
  const handleChange = (field, value) => {
    console.log(`Changing ${field} to:`, value);

    if (field === "className") {
      // Reset subject when class changes
      setChangeSubjectId(null);
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        chapterId: [],
      }));
    } else if (field === "chapterId") {
      setFormData((prev) => ({
        ...prev,
        [field]: Array.isArray(value) ? value : [value],
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubjectSelect = (subjectId) => {
    setChangeSubjectId(subjectId);

    // Also update formData
    const selectedSubject = getSubjectsForSelectedClass().find(
      (s) => s._id === subjectId,
    );
    if (selectedSubject) {
      console.log("Selected subject:", selectedSubject.subjectName);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEligible) {
      Swal.fire({
        icon: "error",
        title: "সাবস্ক্রিপশন প্রয়োজন",
        html: `
          <div class="text-right">
            <p>প্রশ্ন তৈরি করতে আপনাকে সাবস্ক্রাইব করতে হবে</p>
            <p class="text-sm text-gray-600 mt-2">স্ট্যাটাস:</p>
            <ul class="text-sm text-gray-600 text-right">
              <li>ভেরিফাইড: ${isUserVerified ? "✅" : "❌"}</li>
              <li>সাবস্ক্রিপশন: ${hasSubscription ? "✅" : "❌"}</li>
              <li>অনুমোদিত: ${isSubscriptionApproved ? "✅" : "❌"}</li>
              <li>প্যাকেজ: ${hasPackages ? "✅" : "❌"}</li>
            </ul>
          </div>
        `,
        showConfirmButton: true,
        confirmButtonText: "বুঝেছি",
      });
      return;
    }

    if (!changeSubjectId) {
      Swal.fire({
        icon: "error",
        title: "বিষয় নির্বাচন করুন",
        text: "দয়া করে একটি বিষয় নির্বাচন করুন",
        showConfirmButton: true,
      });
      return;
    }

    // Validate form
    if (
      !formData.title ||
      !formData.className ||
      !formData.examType ||
      !formData.examCategory ||
      !formData.marks ||
      formData.chapterId.length === 0
    ) {
      Swal.fire({
        icon: "error",
        title: "ফর্ম অসম্পূর্ণ",
        text: "দয়া করে সবগুলো ফিল্ড পূরণ করুন",
        showConfirmButton: true,
      });
      return;
    }

    try {
      const payload = {
        title: formData.title,
        className: formData.className,
        subjectName: changeSubjectId,
        chapterId: formData.chapterId,
        examCategory: formData.examCategory,
        examType: formData.examType,
        marks: Number(formData.marks),
        email: email,
        questionIds: [],
      };

      const res = await createAExamSet(payload);

      if (res?.data) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: "প্রশ্ন সেট তৈরি হয়েছে",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate(`/user/new-question/layout/${res.data._id}`);
      } else if (res?.error) {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি!",
          text: res.error.data?.message || "কিছু সমস্যা হয়েছে",
          showConfirmButton: true,
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: err.message || "সার্ভারে সমস্যা হয়েছে",
        showConfirmButton: true,
      });
    }
  };

  /* ---------- LOADING STATE ---------- */
  if (classLoader || subscriptionLoader) {
    return <ClientLoader />;
  }

  /* ---------- GET ERROR MESSAGE ---------- */
  const getErrorMessage = () => {
    if (!subscriptionData) return "লোডিং...";
    if (!isUserVerified) return "অ্যাকাউন্ট ভেরিফাই করা হয়নি";
    if (!hasSubscription) return "কোনো সাবস্ক্রিপশন নেই";
    if (!isSubscriptionApproved) return "সাবস্ক্রিপশন অনুমোদনের অপেক্ষায়";
    if (!hasPackages) return "কোনো প্যাকেজ নেই";
    return "";
  };

  const errorMessage = getErrorMessage();

  return (
    <div className="px-3 md:ml-72 md:mr-8 mt-5">
      <div className="flex justify-center items-center w-full min-h-screen flex-col space-y-4 max-w-3xl mx-auto">
        <Card className="w-full mt-8 md:mt-16 mb-10 bg-white">
          <div className="text-center space-y-2 bg-[#024645] h-42 md:min-h-52 p-5">
            <div className="mb-5 md:mb-10">
              <p className="solaimanlipi text-2xl md:text-4xl text-white drop-shadow-sm">
                ১ ক্লিকে আপনার প্রশ্ন তৈরি করুন!
              </p>
              <p className="solaimanlipi font-thin text-xl text-white ">
                নিচের তথ্যগুলো দিয়ে আপনার প্রশ্ন তৈরি করুন
              </p>
            </div>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-3 md:space-y-4 mt-6 w-full max-w-md md:max-w-xl mx-auto px-3 pb-8"
          >
            {/* Title */}
            <div>
              <Input
                size="lg"
                className="solaimanlipi w-full text-lg"
                placeholder="প্রশ্নের টাইটেল লিখুন"
                isRequired
                variant="bordered"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                isDisabled={!isEligible}
                classNames={{
                  input: "text-lg solaimanlipi",
                }}
              />
            </div>

            {/* Class & Subject */}
            <div className="grid grid-cols-2  gap-4">
              {/* Class Select */}
              <Select
                className="solaimanlipi"
                isRequired
                placeholder={
                  isEligible ? "শ্রেণী নির্বাচন করুন" : "সাবস্ক্রিপশন প্রয়োজন"
                }
                selectedKeys={formData.className ? [formData.className] : []}
                onSelectionChange={(keys) => {
                  const key = Array.from(keys)[0];
                  if (key) handleChange("className", key);
                }}
                isDisabled={!isEligible}
                variant="bordered"
                size="lg"
              >
                {isEligible && classFilteredPackages.length > 0 ? (
                  classFilteredPackages.map((item) => (
                    <SelectItem
                      key={item._id}
                      className="solaimanlipi"
                      textValue={item.className}
                    >
                      <div className="flex justify-between items-center">
                        <span>{item.className}</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {item.subjectCount} বিষয়
                        </span>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem
                    key="no-classes"
                    isDisabled
                    className="solaimanlipi"
                  >
                    {isEligible
                      ? "কোন ক্লাস পাওয়া যায়নি"
                      : "সাবস্ক্রিপশন প্রয়োজন"}
                  </SelectItem>
                )}
              </Select>

              {/* Subject Select */}
              <Select
                className="solaimanlipi"
                isRequired
                placeholder={
                  !isEligible
                    ? "সাবস্ক্রিপশন প্রয়োজন"
                    : !formData.className
                      ? "প্রথমে শ্রেণী নির্বাচন করুন"
                      : "বিষয় নির্বাচন করুন"
                }
                selectedKeys={changeSubjectId ? [changeSubjectId] : []}
                onSelectionChange={(keys) => {
                  const key = Array.from(keys)[0];
                  if (key) handleSubjectSelect(key);
                }}
                isDisabled={!isEligible || !formData.className}
                variant="bordered"
                size="lg"
              >
                {isEligible && formData.className ? (
                  getSubjectsForSelectedClass().length > 0 ? (
                    getSubjectsForSelectedClass().map((subject) => (
                      <SelectItem
                        key={subject._id}
                        className="solaimanlipi"
                        textValue={subject.subjectName}
                      >
                        {subject.subjectName}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem
                      key="no-subjects"
                      isDisabled
                      className="solaimanlipi"
                    >
                      এই ক্লাসে কোনো বিষয় নেই
                    </SelectItem>
                  )
                ) : (
                  <SelectItem
                    key="disabled"
                    isDisabled
                    className="solaimanlipi"
                  >
                    {!isEligible
                      ? "সাবস্ক্রিপশন প্রয়োজন"
                      : "প্রথমে শ্রেণী নির্বাচন করুন"}
                  </SelectItem>
                )}
              </Select>
            </div>

            {/* Chapter Select */}
            <div>
              <Select
                className="solaimanlipi w-full"
                isRequired
                placeholder={
                  !isEligible
                    ? "সাবস্ক্রিপশন প্রয়োজন"
                    : !changeSubjectId
                      ? "প্রথমে বিষয় নির্বাচন করুন"
                      : "অধ্যায় নির্বাচন করুন"
                }
                selectionMode="multiple"
                selectedKeys={new Set(formData.chapterId)}
                onSelectionChange={(keys) => {
                  handleChange("chapterId", Array.from(keys));
                }}
                isDisabled={!isEligible || !changeSubjectId}
                variant="bordered"
                size="lg"
              >
                {isEligible && changeSubjectId ? (
                  subjectLoader ? (
                    <SelectItem key="loading" isDisabled>
                      <span className="solaimanlipi">লোডিং...</span>
                    </SelectItem>
                  ) : subjectData?.chapters?.length > 0 ? (
                    subjectData.chapters.map((chapter) => (
                      <SelectItem
                        key={chapter._id}
                        className="solaimanlipi"
                        textValue={chapter.chapterName}
                      >
                        {chapter.chapterName}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem
                      key="no-chapters"
                      isDisabled
                      className="solaimanlipi"
                    >
                      এই বিষয়ে কোনো অধ্যায় নেই
                    </SelectItem>
                  )
                ) : (
                  <SelectItem
                    key="disabled"
                    isDisabled
                    className="solaimanlipi"
                  >
                    {!isEligible
                      ? "সাবস্ক্রিপশন প্রয়োজন"
                      : "প্রথমে বিষয় নির্বাচন করুন"}
                  </SelectItem>
                )}
              </Select>
            </div>

            {/* Exam Type, Category, Marks */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Exam Type */}
              <Select
                className="solaimanlipi"
                isRequired
                placeholder={
                  !isEligible ? "সাবস্ক্রিপশন প্রয়োজন" : "পরীক্ষার ধরন"
                }
                selectedKeys={formData.examType ? [formData.examType] : []}
                onSelectionChange={(keys) => {
                  const key = Array.from(keys)[0];
                  if (key) handleChange("examType", key);
                }}
                isDisabled={!isEligible}
                variant="bordered"
                size="lg"
              >
                {isEligible ? (
                  examType.map((item) => (
                    <SelectItem
                      key={item.key}
                      className="solaimanlipi"
                      textValue={item.label}
                    >
                      {item.label}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem
                    key="disabled"
                    isDisabled
                    className="solaimanlipi"
                  >
                    সাবস্ক্রিপশন প্রয়োজন
                  </SelectItem>
                )}
              </Select>

              {/* Exam Category */}
              <Select
                className="solaimanlipi"
                isRequired
                placeholder={
                  !isEligible ? "সাবস্ক্রিপশন প্রয়োজন" : "প্রশ্নের ধরণ"
                }
                selectedKeys={
                  formData.examCategory ? [formData.examCategory] : []
                }
                onSelectionChange={(keys) => {
                  const key = Array.from(keys)[0];
                  if (key) handleChange("examCategory", key);
                }}
                isDisabled={!isEligible}
                variant="bordered"
                size="lg"
              >
                {isEligible && exams ? (
                  exams.map((exam) => {
                    const displayName =
                      exam.examName === "সংক্ষিপ্ত প্রশ্ন"
                        ? "সমন্বিত প্রশ্ন"
                        : exam.examName;
                    return (
                      <SelectItem
                        key={exam._id}
                        className="solaimanlipi"
                        textValue={displayName}
                      >
                        {displayName}
                      </SelectItem>
                    );
                  })
                ) : (
                  <SelectItem
                    key="disabled"
                    isDisabled
                    className="solaimanlipi"
                  >
                    সাবস্ক্রিপশন প্রয়োজন
                  </SelectItem>
                )}
              </Select>

              {/* Marks */}
              <Input
                size="lg"
                className="solaimanlipi"
                placeholder={!isEligible ? "সাবস্ক্রিপশন প্রয়োজন" : "পূর্ণমান"}
                type="number"
                min="1"
                max="100"
                value={formData.marks}
                onChange={(e) => handleChange("marks", e.target.value)}
                isRequired
                isDisabled={!isEligible}
                variant="bordered"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className={`w-full solaimanlipi text-lg h-12 ${
                  isEligible
                    ? "bg-[#024645] hover:bg-[#003338] text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                radius="lg"
                size="lg"
                isLoading={isLoading}
                isDisabled={!isEligible || isLoading}
              >
                {isEligible ? "প্রশ্নসেট তৈরি করুন" : "সাবস্ক্রাইব করুন"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
