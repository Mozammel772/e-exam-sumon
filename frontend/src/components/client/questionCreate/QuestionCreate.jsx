import { useEffect, useState } from "react";
import { Button, Card, Input, Select, SelectItem } from "@heroui/react";
import { Link } from "react-router";
import { useGetAllClassesQuery } from "../../../redux/api/slices/classSlice";
import ClientLoader from "../../../utils/loader/ClientLoader";
import {
  useGetAllSubjectsQuery,
  useGetASubjectQuery,
} from "../../../redux/api/slices/subjectSlice";
import { useNavigate } from "react-router-dom";
import { useGetAllExamsQuery } from "../../../redux/api/slices/examSlice";
import { useGetASubscriptionInfoOfAnUserQuery } from "../../../redux/api/slices/subscriptionSlice";
import { useCreateAExamSetMutation } from "../../../redux/api/slices/examSetSlice";
import Swal from "sweetalert2";
import { useWindowSize } from "@uidotdev/usehooks";

export const examType = [
  { key: "সাপ্তাহিক পরীক্ষা", label: "সাপ্তাহিক পরীক্ষা" },
  { key: "মডেল টেস্ট", label: "মডেল টেস্ট" },
  { key: "প্রি-টেস্ট", label: "প্রি-টেস্ট" },
  { key: "টেস্ট-এক্সাম", label: "টেস্ট-এক্সাম" },
  { key: "ক্লাস-টেস্ট", label: "ক্লাস-টেস্ট" },
  { key: "বিষয় ভিত্তিক", label: "বিষয় ভিত্তিক" },
  { key: "অধ্যায় ভিত্তিক", label: "অধ্যায় ভিত্তিক" },
  { key: "মাসিক পরীক্ষা", label: "মাসিক পরীক্ষা" },
  { key: "অর্ধ-বার্ষিক পরীক্ষা", label: "অর্ধ-বার্ষিক পরীক্ষা" },
  { key: "বার্ষিক পরীক্ষা", label: "বার্ষিক পরীক্ষা" },
];

export default function QuestionCreate() {
  const navigate = useNavigate();
  const size = useWindowSize();

  const email = localStorage?.getItem("email");
  const [changeSubjectId, setChangeSubjectId] = useState();

  const [formData, setFormData] = useState({
    title: "",
    className: "",
    subjectName: "",
    chapterId: [],
    examCategory: "",
    examType: "",
    marks: 30,
    questionIds: [],
    email: email,
  });
  const [classFilteredPackages, setClassFilteredPackages] = useState([]);

  const { data: getAllClasses, isLoading: classLoader } =
    useGetAllClassesQuery();
  const { data: getAllSubjects } = useGetAllSubjectsQuery();

  const [createAExamSet, { isLoading }] = useCreateAExamSetMutation();

  const { data: getAllExam } = useGetAllExamsQuery();
  const { data: getSubscriptionInfoData, isLoading: subscriptionLoader } =
    useGetASubscriptionInfoOfAnUserQuery(email);

  // Check user status
  const isUserVerified = getSubscriptionInfoData?.user?.isVerified;
  const hasUserPaid = getSubscriptionInfoData?.user?.payment;
  const hasSubscription = getSubscriptionInfoData?.user?.subscription;
  const isSubscriptionApproved =
    getSubscriptionInfoData?.subscriptions?.[0]?.isApproved;
  const hasPackages = getSubscriptionInfoData?.packages?.length > 0;

  // Check if user is eligible to create questions
  const isEligible =
    isUserVerified &&
    // hasUserPaid &&
    hasSubscription &&
    isSubscriptionApproved &&
    hasPackages;

  useEffect(() => {
    if (isEligible && getAllSubjects && getAllClasses) {
      const filtered = getSubscriptionInfoData.packages.map((subject) => {
        const classId = subject?.subjectClassName?._id;
        const className = getAllClasses.find(
          (cls) => cls._id === classId
        )?.className;

        return {
          _id: classId,
          className,
        };
      });

      const uniqueFiltered = filtered.filter(
        (item, index, self) =>
          item._id && index === self.findIndex((t) => t._id === item._id)
      );

      setClassFilteredPackages(uniqueFiltered);
    }
  }, [isEligible, getSubscriptionInfoData, getAllSubjects, getAllClasses]);

  const { data: getASubjectData, isLoading: subjectLoader } =
    useGetASubjectQuery(changeSubjectId);

  const handleChange = (field, value) => {
    if (!isEligible) return;

    if (field === "chapterId") {
      const chaptersArray =
        typeof value === "string"
          ? value.split(",")
          : Array.isArray(value)
          ? value
          : [value];
      setFormData((prev) => ({
        ...prev,
        [field]: chaptersArray,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEligible) return;

    const newData = {
      ...formData,
      marks: Number(formData?.marks),
      subjectName: changeSubjectId,
    };
    try {
      const res = await createAExamSet(newData);
      if (res?.data) {
        const uniqueKey = res.data?._id;
        Swal.fire({
          title: "আপনার প্রশ্ন সেট তৈরি হয়েছে",
          icon: "success",
          showCloseButton: true,
          showConfirmButton: false,
          timer: 1500,
        });
        console.log("res data", res?.data);
        navigate(`/user/new-question/layout/${uniqueKey}`);
      } else {
        Swal.fire({
          title: res?.error?.data?.message,
          icon: "error",
          showCloseButton: true,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      Swal.fire({
        title: error?.message,
        icon: "error",
        showCloseButton: true,
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setFormData({
        title: "",
        className: "",
        subjectName: "",
        chapterId: [],
        examCategory: "",
        examType: "",
        marks: 0,
      });
    }
  };

  if (classLoader || subscriptionLoader) {
    return <ClientLoader />;
  }

  // Error messages for different conditions
  const getErrorMessage = () => {
    if (!isUserVerified) return "আপনার অ্যাকাউন্ট ভেরিফাই করা হয়নি";
    if (!hasUserPaid) return "আপনার পেমেন্ট সম্পন্ন হয়নি";
    if (!hasSubscription) return "আপনার কোনো সাবস্ক্রিপশন নেই";
    if (!isSubscriptionApproved) return "সাবস্ক্রিপশন অনুমোদনের অপেক্ষায়";
    if (!hasPackages) return "আপনার কোনো প্যাকেজ নেই";
    return "";
  };

  return (
    <div className={`me-3 ${size?.width <= 600 ? "ms-3 mt-20" : "ms-72 me-8"}`}>
      <div className="flex justify-center items-center w-full h-screen flex-col space-y-4">
        <div className="text-center space-y-2">
          <p className="solaimanlipi text-4xl font-bold text-green-900 drop-shadow-sm">
            ১ ক্লিকে আপনার প্রশ্ন তৈরি করুন!
          </p>
          <p className="solaimanlipi font-thin text-2xl text-gray-600">
            নিচের তথ্যগুলো দিয়ে আপনার প্রশ্ন তৈরি করুন
          </p>
        </div>

        <Card
          className={`w-full p-8 mt-16 mb-10 bg-white rounded-2xl shadow-2xl border ${
            isEligible ? "border-green-300" : "border-red-300"
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ✅ Title - Full width */}
            <div>
              <Input
                size="lg"
                className="solaimanlipi w-full text-xl hover:border-green-300 transition-colors"
                placeholder="প্রশ্নের টাইটেল লিখুন"
                isRequired
                variant="bordered"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                classNames={{
                  input: "text-xl solaimanlipi",
                  inputWrapper: "h-16",
                  label: "text-xl solaimanlipi",
                }}
                isDisabled={!isEligible}
              />
            </div>

            {/* ✅ Class & Subject - 2 columns */}
            <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-5">
              {/* Class Select */}
              <Select
                className="max-w-full"
                isRequired
                placeholder={
                  isEligible ? "শ্রেণী সিলেক্ট করুন" : getErrorMessage()
                }
                onChange={(e) => handleChange("className", e.target.value)}
                classNames={{
                  trigger: `min-h-16 text-xl solaimanlipi border-2 rounded-xl px-4 ${
                    isEligible ? "border-gray-200" : "border-red-200 bg-red-50"
                  }`,
                  value: "text-xl solaimanlipi",
                  listboxWrapper: "max-h-[400px]",
                  popoverContent: "text-xl solaimanlipi",
                  label: "text-xl solaimanlipi",
                }}
                isDisabled={!isEligible}
                variant={isEligible ? "bordered" : "flat"}
                color={isEligible ? "default" : "danger"}
              >
                {isEligible ? (
                  classFilteredPackages?.map((item) => (
                    <SelectItem
                      key={item?._id}
                      className="text-xl solaimanlipi px-4 py-2 hover:bg-green-200"
                      textValue={item.className}
                    >
                      <span className="text-xl">{item?.className}</span>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem
                    key="error-message"
                    isDisabled
                    textValue={getErrorMessage()}
                    className="text-red-600"
                  >
                    <span className="text-xl">{getErrorMessage()}</span>
                  </SelectItem>
                )}
              </Select>

              {/* Subject Select */}
              <Select
                className="max-w-full"
                isRequired
                variant={isEligible ? "bordered" : "flat"}
                color={isEligible ? "default" : "danger"}
                placeholder={
                  isEligible ? "বিষয় নির্বাচন করুন" : getErrorMessage()
                }
                onChange={(e) => handleChange("subjectName", e.target.value)}
                classNames={{
                  label: "text-xl solaimanlipi",
                  trigger: `min-h-16 text-xl solaimanlipi ${
                    isEligible ? "" : "border-red-200 bg-red-50"
                  }`,
                  value: "text-xl solaimanlipi",
                  listboxWrapper: "max-h-[400px]",
                  popoverContent: "text-xl solaimanlipi",
                }}
                isDisabled={!isEligible || !formData.className}
              >
                {isEligible ? (
                  formData.className ? (
                    getSubscriptionInfoData?.packages
                      ?.filter(
                        (subject) =>
                          subject.subjectClassName?._id === formData?.className
                      )
                      ?.map((subject) => (
                        <SelectItem
                          key={subject?._id}
                          onClick={() => setChangeSubjectId(subject?._id)}
                          textValue={subject?.subjectName}
                        >
                          <p className="text-xl">{subject.subjectName}</p>
                        </SelectItem>
                      ))
                  ) : (
                    <SelectItem
                      key="select-class-first"
                      isDisabled
                      textValue="প্রথমে শ্রেণী নির্বাচন করুন"
                    >
                      <p className="text-xl">প্রথমে শ্রেণী নির্বাচন করুন</p>
                    </SelectItem>
                  )
                ) : (
                  <SelectItem
                    key="error-message"
                    isDisabled
                    textValue={getErrorMessage()}
                    className="text-red-600"
                  >
                    <span className="text-xl">{getErrorMessage()}</span>
                  </SelectItem>
                )}
              </Select>
            </div>

            {/* ✅ Chapter - Full width */}
            <div>
              <Select
                className="w-full"
                isRequired
                variant={isEligible ? "bordered" : "flat"}
                color={isEligible ? "default" : "danger"}
                selectionMode="multiple"
                placeholder={
                  isEligible ? "অধ্যায় সিলেক্ট করুন" : getErrorMessage()
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "select-all") {
                    const allIds =
                      getASubjectData?.chapters?.map((ch) => ch?._id) || [];
                    handleChange("chapterId", allIds);
                  } else {
                    handleChange("chapterId", value);
                  }
                }}
                value={formData?.chapterId}
                classNames={{
                  label: "text-xl solaimanlipi",
                  trigger: `min-h-16 text-xl solaimanlipi ${
                    isEligible ? "" : "border-red-200 bg-red-50"
                  }`,
                  value: "text-xl solaimanlipi",
                  listboxWrapper: "max-h-[400px]",
                  popoverContent: "text-xl solaimanlipi",
                }}
                isDisabled={!isEligible || !changeSubjectId || subjectLoader}
              >
                {isEligible ? (
                  changeSubjectId ? (
                    subjectLoader ? (
                      <SelectItem key="loading" value="loading" isDisabled>
                        <span className="text-xl solaimanlipi text-blue-600">
                          loading...
                        </span>
                      </SelectItem>
                    ) : (
                      <>
                        <SelectItem
                          key="select-all"
                          value="select-all"
                          className="text-xl solaimanlipi px-4 py-2 font-semibold text-blue-600"
                          textValue="✅ সবগুলো অধ্যায় নির্বাচন করুন"
                        >
                          <span className="text-xl">
                            ✅ সবগুলো অধ্যায় নির্বাচন করুন
                          </span>
                        </SelectItem>
                        {getASubjectData?.chapters?.map((item) => (
                          <SelectItem
                            key={item?._id}
                            value={item?._id}
                            className="text-xl solaimanlipi px-4 py-2"
                            textValue={item?.chapterName}
                          >
                            <span className="text-xl">{item?.chapterName}</span>
                          </SelectItem>
                        ))}
                      </>
                    )
                  ) : (
                    <SelectItem
                      key="select-subject-first"
                      textValue="প্রথমে বিষয় নির্বাচন করুন"
                    >
                      <p className="text-xl">প্রথমে বিষয় নির্বাচন করুন</p>
                    </SelectItem>
                  )
                ) : (
                  <SelectItem
                    key="error-message"
                    textValue={getErrorMessage()}
                    className="text-red-600"
                  >
                    <span className="text-xl">{getErrorMessage()}</span>
                  </SelectItem>
                )}
              </Select>
            </div>

            {/* ✅ ExamType, ExamCategory, Marks - 3 columns in md+lg */}
            <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 gap-5">
              {/* Exam Type */}
              <Select
                className="max-w-full"
                isRequired
                variant={isEligible ? "bordered" : "flat"}
                color={isEligible ? "default" : "danger"}
                placeholder={isEligible ? "পরীক্ষার ধরণ" : getErrorMessage()}
                onChange={(e) => handleChange("examType", e.target.value)}
                classNames={{
                  label: "text-xl solaimanlipi",
                  trigger: `min-h-16 text-xl solaimanlipi ${
                    isEligible ? "" : "border-red-200 bg-red-50"
                  }`,
                  value: "text-xl solaimanlipi",
                  listboxWrapper: "max-h-[400px]",
                  popoverContent: "text-xl solaimanlipi",
                }}
                isDisabled={!isEligible}
              >
                {isEligible ? (
                  examType?.map((item) => (
                    <SelectItem
                      key={item?.key}
                      className="text-xl solaimanlipi px-4 py-2"
                      textValue={item?.label}
                    >
                      <span className="text-xl">{item?.label}</span>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem
                    key="error-message"
                    isDisabled
                    textValue={getErrorMessage()}
                    className="text-red-600"
                  >
                    <span className="text-xl">{getErrorMessage()}</span>
                  </SelectItem>
                )}
              </Select>

              {/* Exam Category */}
              <Select
                className="max-w-full"
                isRequired
                variant={isEligible ? "bordered" : "flat"}
                color={isEligible ? "default" : "danger"}
                placeholder={
                  isEligible ? "টাইপ সিলেক্ট করুন" : getErrorMessage()
                }
                onChange={(e) => handleChange("examCategory", e.target.value)}
                classNames={{
                  label: "text-xl solaimanlipi",
                  trigger: `min-h-16 text-xl solaimanlipi ${
                    isEligible ? "" : "border-red-200 bg-red-50"
                  }`,
                  value: "text-xl solaimanlipi",
                  listboxWrapper: "max-h-[400px]",
                  popoverContent: "text-xl solaimanlipi",
                }}
                isDisabled={!isEligible}
              >
                {isEligible ? (
                  getAllExam?.map((item) => {
                    const displayName =
                      item?.examName === "সংক্ষিপ্ত প্রশ্ন"
                        ? "সমন্বিত প্রশ্ন (সং. প্রশ্ন + সৃ. প্রশ্ন + বহু. প্রশ্ন)"
                        : item?.examName;
                    return (
                      <SelectItem
                        key={item?._id}
                        className="text-xl solaimanlipi px-4 py-2"
                        textValue={displayName}
                      >
                        <span className="text-xl">{displayName}</span>
                      </SelectItem>
                    );
                  })
                ) : (
                  <SelectItem
                    key="error-message"
                    isDisabled
                    textValue={getErrorMessage()}
                    className="text-red-600"
                  >
                    <span className="text-xl">{getErrorMessage()}</span>
                  </SelectItem>
                )}
              </Select>

              {/* Marks */}
              <Input
                size="lg"
                className={`solaimanlipi w-full ${
                  !isEligible ? "bg-red-50 border-red-200" : ""
                }`}
                variant={isEligible ? "bordered" : "flat"}
                color={isEligible ? "default" : "danger"}
                value={formData.marks}
                onChange={(e) =>
                  handleChange("marks", e.target.value.replace(/[^0-9]/g, ""))
                }
                placeholder={
                  isEligible
                    ? "পূর্ণ মান দিন (যেমন: ১০, ২০, বা ৩০)"
                    : getErrorMessage()
                }
                isRequired
                type="text"
                classNames={{
                  input: "text-xl solaimanlipi h-16",
                  inputWrapper: "h-16",
                  label: "text-xl solaimanlipi",
                }}
                isDisabled={!isEligible}
              />
            </div>

            {/* ✅ Submit button */}
            <Button
              className={`mt-5 p-3 solaimanlipi w-full text-white text-xl font-bold ${
                isEligible
                  ? "bg-[#024645] hover:bg-[#003338]"
                  : "bg-red-500 cursor-not-allowed"
              }`}
              radius="lg"
              size="lg"
              type="submit"
              isLoading={isLoading}
              isDisabled={!isEligible}
            >
              {isEligible
                ? "প্রশ্নসেট তৈরি করুন"
                : "প্রশ্ন তৈরি করতে সাবস্ক্রাইব করুন"}
            </Button>

            {!isEligible && (
              <div className="mt-4 text-center">
                <Link to="/">
                  <Button className="p-3 solaimanlipi bg-[#024645] text-white text-xl font-bold hover:bg-[#003338]">
                    সাবস্ক্রিপশন পেজে যান
                  </Button>
                </Link>
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
}
