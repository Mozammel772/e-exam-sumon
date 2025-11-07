import { useState } from "react";
import { Button, Card, Input, Select, SelectItem } from "@heroui/react";

import { useGetAllClassesQuery } from "../../../redux/api/slices/classSlice";
import ClientLoader from "../../../utils/loader/ClientLoader";
import {
  useGetAllSubjectsQuery,
  useGetASubjectQuery,
} from "../../../redux/api/slices/subjectSlice";
import { useNavigate } from "react-router-dom";
import { useGetAllExamsQuery } from "../../../redux/api/slices/examSlice";
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
export default function DemoQuestionCreate() {
  const navigate = useNavigate();
  const email = localStorage?.getItem("email");
  const [changeSubjectId, setChangeSubjectId] = useState();
  const size = useWindowSize();

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

  const { data: getAllClasses, isLoading: classLoader } =
    useGetAllClassesQuery();
  const { data: getAllSubjects, isLoading: subjectsLoader } =
    useGetAllSubjectsQuery();

  const [createAExamSet, { isLoading }] = useCreateAExamSetMutation();

  const { data: getAllExam } = useGetAllExamsQuery();

  const { data: getASubjectData, isLoading: chapterLoading } =
    useGetASubjectQuery(changeSubjectId);

  const handleChange = (field, value) => {
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
    const newData = {
      ...formData,
      marks: Number(formData?.marks),
      subjectName: changeSubjectId,
    };
    try {
      const res = await createAExamSet(newData);
      console.log("res", res);
      if (res?.data) {
        const uniqueKey = res.data._id;
        Swal.fire({
          title: "আপনার প্রশ্ন সেট তৈরি হয়েছে",
          icon: "success",
          showCloseButton: true,
          showConfirmButton: false,
          timer: 1500,
        });
        navigate(`/user/new-question/layout/${uniqueKey}?qt=demo`);
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

  if (classLoader) {
    return <ClientLoader />;
  }
  return (
    <div className={`me-3 ${size?.width <= 600 ? "ms-3 mt-20" : "ms-72 me-8"}`}>
      <div className="flex justify-center items-center w-full h-screen flex-col space-y-4">
        <div className="text-center space-y-2">
          <p className="solaimanlipi text-4xl font-bold text-green-900 drop-shadow-sm">
            📄 নমুনা প্রশ্ন তৈরি – এক ক্লিকে সহজে প্রশ্ন বানান
          </p>
          <p className="solaimanlipi font-thin text-2xl text-gray-600">
            নিচের তথ্যগুলো দিয়ে আপনার প্রশ্ন তৈরি করুন
          </p>
        </div>
        <Card className="w-full p-8 mt-10 mb-10 bg-white rounded-2xl shadow-lg border border-green-300">
          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-5">
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
              />

              <Select
                className="max-w-full"
                isRequired
                placeholder="শ্রেণী সিলেক্ট করুন"
                onChange={(e) => handleChange("className", e.target.value)}
                classNames={{
                  trigger:
                    "min-h-16 text-xl solaimanlipi border-2 border-gray-200 rounded-xl px-4",
                  value: "text-xl solaimanlipi",
                  listboxWrapper: "max-h-[400px]",
                  popoverContent: "text-xl solaimanlipi",
                  label: "text-xl solaimanlipi",
                }}
              >
                {getAllClasses?.map((item) => (
                  <SelectItem
                    key={item?._id}
                    className="text-xl solaimanlipi px-4 py-2 hover:bg-green-200"
                    textValue={item?.className}
                  >
                    <span className="text-xl">{item?.className}</span>
                  </SelectItem>
                ))}
              </Select>

              <Select
                className="max-w-full"
                isRequired
                variant="bordered"
                placeholder="বিষয় নির্বাচন করুন"
                onChange={(e) => handleChange("subjectName", e.target.value)}
                classNames={{
                  label: "text-xl solaimanlipi",
                  trigger: "min-h-16 text-xl solaimanlipi",
                  value: "text-xl solaimanlipi",
                  listboxWrapper: "max-h-[400px] overflow-y-auto",
                  popoverContent: "text-xl solaimanlipi",
                }}
              >
                {subjectsLoader ? (
                  <SelectItem key="loading" isDisabled textValue="Loading...">
                    <p className="text-xl animate-pulse">লোড হচ্ছে...</p>
                  </SelectItem>
                ) : (
                  getAllSubjects
                    ?.filter(
                      (subject) =>
                        subject?.subjectClassName?._id === formData?.className
                    )
                    .map((subject) => (
                      <SelectItem
                        key={subject._id}
                        onClick={() => setChangeSubjectId(subject._id)}
                        textValue={subject.subjectName}
                      >
                        <p className="text-xl">{subject.subjectName}</p>
                      </SelectItem>
                    ))
                )}
              </Select>

              <Select
                className="max-w-full"
                isRequired
                variant="bordered"
                selectionMode="multiple"
                placeholder="অধ্যায় সিলেক্ট করুন"
                onChange={(e) => handleChange("chapterId", e.target.value)}
                value={formData?.chapterId}
                classNames={{
                  label: "text-xl solaimanlipi",
                  trigger: "min-h-16 text-xl solaimanlipi",
                  value: "text-xl solaimanlipi",
                  listboxWrapper: "max-h-[400px] overflow-y-auto",
                  popoverContent: "text-xl solaimanlipi",
                }}
              >
                {chapterLoading ? (
                  <SelectItem key="loading" isDisabled textValue="লোড হচ্ছে...">
                    <span className="text-xl animate-pulse">লোড হচ্ছে...</span>
                  </SelectItem>
                ) : (
                  getASubjectData?.chapters
                    ?.filter((item) => item?.status === false)
                    .map((item) => (
                      <SelectItem
                        key={item?._id}
                        value={item?._id}
                        className="text-xl solaimanlipi px-4 py-2"
                        textValue={item?.chapterName}
                      >
                        <span className="text-xl">{item?.chapterName}</span>
                      </SelectItem>
                    ))
                )}
              </Select>

              <Select
                className="max-w-full"
                isRequired
                variant="bordered"
                placeholder="পরীক্ষার ধরণ"
                onChange={(e) => handleChange("examType", e.target.value)}
                classNames={{
                  label: "text-xl solaimanlipi",
                  trigger: "min-h-16 text-xl solaimanlipi",
                  value: "text-xl solaimanlipi",
                  listboxWrapper: "max-h-[400px]",
                  popoverContent: "text-xl solaimanlipi",
                }}
              >
                {examType?.map((item) => (
                  <SelectItem
                    key={item?.key}
                    className="text-xl solaimanlipi px-4 py-2"
                    textValue={item?.label}
                  >
                    <span className="text-xl">{item?.label}</span>
                  </SelectItem>
                ))}
              </Select>

              <Select
                className="max-w-full"
                isRequired
                variant="bordered"
                placeholder="টাইপ সিলেক্ট করুন"
                onChange={(e) => handleChange("examCategory", e.target.value)}
                classNames={{
                  label: "text-xl solaimanlipi",
                  trigger: "min-h-16 text-xl solaimanlipi",
                  value: "text-xl solaimanlipi",
                  listboxWrapper: "max-h-[400px]",
                  popoverContent: "text-xl solaimanlipi",
                }}
              >
                {getAllExam?.map((item) => (
                  <SelectItem
                    key={item?._id}
                    className="text-xl solaimanlipi px-4 py-2"
                    textValue={item?.examName}
                  >
                    <span className="text-xl">{item?.examName}</span>
                  </SelectItem>
                ))}
              </Select>

              <Input
                size="lg"
                className="solaimanlipi w-full"
                variant="bordered"
                value={formData.marks}
                onChange={(e) =>
                  handleChange("marks", e.target.value.replace(/[^0-9]/g, ""))
                }
                placeholder="পূর্ণ মান দিন (যেমন: ১০, ২০, বা ৩০)"
                isRequired
                type="text"
                minLength={30}
                classNames={{
                  input: "text-xl solaimanlipi h-16",
                  inputWrapper: "h-16",
                  label: "text-xl solaimanlipi",
                }}
              />
            </div>
            <Button
              className="mt-5 p-3 solaimanlipi bg-[#024645] w-full text-white text-xl font-bold hover:bg-[#003338] hover:text-white"
              radius="lg"
              size="lg"
              type="submit"
              isLoading={isLoading}
            >
              প্রশ্নসেট তৈরি করুন
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
