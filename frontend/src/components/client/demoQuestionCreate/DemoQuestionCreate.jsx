import { Button, Card, Input, Select, SelectItem } from "@heroui/react";
import { useState } from "react";

import { useWindowSize } from "@uidotdev/usehooks";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useGetAllClassesQuery } from "../../../redux/api/slices/classSlice";
import { useCreateAExamSetMutation } from "../../../redux/api/slices/examSetSlice";
import { useGetAllExamsQuery } from "../../../redux/api/slices/examSlice";
import {
  useGetAllSubjectsQuery,
  useGetASubjectQuery,
} from "../../../redux/api/slices/subjectSlice";
import ClientLoader from "../../../utils/loader/ClientLoader";

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
  useGetASubjectQuery(changeSubjectId, {
    skip: !changeSubjectId, // 🔥 MUST
  });

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
  <div className="px-3 md:ml-72 md:mr-8 mt-5">
     <div className="flex justify-center items-center w-full min-h-screen flex-col space-y-4 max-w-3xl mx-auto overflow-visible">
        <Card className="w-full mt-8 md:mt-16 mb-10 bg-white">
          <div className="text-center space-y-2 bg-[#024645] h-42 md:min-h-52 p-5">
            <div className="mb-5 md:mb-10">
              <p className="solaimanlipi text-2xl md:text-4xl text-white drop-shadow-sm">
                ১ ক্লিকে আপনার নমুনা প্রশ্ন তৈরি করুন!
              </p>
              <p className="solaimanlipi font-thin text-xl text-white ">
                নিচের তথ্যগুলো দিয়ে আপনার প্রশ্ন তৈরি করুন
              </p>
            </div>
          </div>

          <form
            className="space-y-3 md:space-y-4 mt-6 w-full max-w-md md:max-w-xl mx-auto px-3 pb-8"
            onSubmit={handleSubmit}
          >
            <div>
              <Input
                size="lg"
                className="solaimanlipi w-full text-lg"
                placeholder="প্রশ্নের টাইটেল লিখুন"
                isRequired
                variant="bordered"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                classNames={{
                  input: "text-xl solaimanlipi",
                  inputWrapper: "h-12",
                  label: "text-xl solaimanlipi",
                }}
              />
            </div>

            <div className="grid grid-cols-2  gap-4">
              <Select
                className="max-w-full"
                isRequired
                placeholder="শ্রেণী সিলেক্ট করুন"
                onChange={(e) => handleChange("className", e.target.value)}
                classNames={{
                  trigger:
                    "min-h-12 text-xl solaimanlipi border-2 border-gray-200 rounded-xl px-4",
                  value: "text-xl solaimanlipi",
                  listboxWrapper: "max-h-[50vh] overflow-y-auto",
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

  /* ✅ MOBILE SAFE */
  onSelectionChange={(keys) => {
    const selectedId = Array.from(keys)[0];

    setChangeSubjectId(selectedId);

    setFormData((prev) => ({
      ...prev,
      subjectName: selectedId,
      chapterId: [], // subject change হলে chapter reset
    }));
  }}

  classNames={{
    label: "text-xl solaimanlipi",
    trigger: "min-h-12 text-xl solaimanlipi",
    value: "text-xl solaimanlipi",
    listboxWrapper: "max-h-[50vh] overflow-y-auto",
    popoverContent: "text-xl solaimanlipi",
  }}
>
  {subjectsLoader ? (
    <SelectItem key="loading" isDisabled>
      লোড হচ্ছে...
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
          textValue={subject.subjectName}
        >
          {subject.subjectName}
        </SelectItem>
      ))
  )}
</Select>

            </div>

            {/* <div>
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
                  trigger: "min-h-12 text-xl solaimanlipi",
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
            </div> */}


            <div>
<Select
  className="max-w-full"
  isRequired
  variant="bordered"
  selectionMode="multiple"
  placeholder="অধ্যায় সিলেক্ট করুন"
  isDisabled={!changeSubjectId}   // 🔥 important
  onChange={(e) => handleChange("chapterId", e.target.value)}
  value={formData?.chapterId}
  popoverProps={{
    shouldBlockScroll: true,
    className: "z-[9999]",
  }}
  classNames={{
    label: "text-xl solaimanlipi",
    trigger: "min-h-12 text-xl solaimanlipi",
    value: "text-xl solaimanlipi",
    listboxWrapper: "max-h-[60vh] overflow-y-auto",
    popoverContent: "text-xl solaimanlipi",
  }}
>
  {chapterLoading ? (
    <SelectItem key="loading" isDisabled>
      লোড হচ্ছে...
    </SelectItem>
  ) : (
    getASubjectData?.chapters
      ?.filter((item) => item?.status == false)
      .map((item) => (
        <SelectItem
          key={item._id}
          value={item._id}
          textValue={item.chapterName}
        >
          {item.chapterName}
        </SelectItem>
      ))
  )}
</Select>

</div>


            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Select
                className="max-w-full"
                isRequired
                variant="bordered"
                placeholder="পরীক্ষার ধরণ"
                onChange={(e) => handleChange("examType", e.target.value)}
                classNames={{
                  label: "text-xl solaimanlipi",
                  trigger: "min-h-12 text-xl solaimanlipi",
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
                  trigger: "min-h-12 text-xl solaimanlipi",
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
                  inputWrapper: "h-12",
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
