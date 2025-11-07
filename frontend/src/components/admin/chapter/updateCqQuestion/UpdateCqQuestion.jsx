import { useEffect, useState } from "react";
import {
  useQuestionInfoUpdateMutation,
  useGetAQuestionQuery,
  useGetAChapterQuery,
} from "../../../../redux/api/slices/chapterSlice";
import JoditEditor from "jodit-react";
import { Select, SelectItem } from "@heroui/react";
import Swal from "sweetalert2";
import { useGetAllTopicsQuery } from "../../../../redux/api/slices/topicsSlice";

const allSearchTypes = [
  { key: "অনুশীলনী", label: "অনুশীলনী" },
  { key: "চিত্রযুক্ত", label: "চিত্রযুক্ত" },
  { key: "বহুপদী", label: "বহুপদী" },
  { key: "অভিন্ন তথ্যভিত্তিক", label: "অভিন্ন তথ্যভিত্তিক" },
  { key: "রিপিটেড স্কুল", label: "রিপিটেড স্কুল" },
  { key: "তত্ত্বীয়", label: "তত্ত্বীয়" },
  { key: "গাণিতিক", label: "গাণিতিক" },
];
const config = {
  toolbarAdaptive: false,
  toolbarSticky: false,
  buttons: [
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "|",
    "superscript",
    "subscript",
    "|",
    "sqrt",
    "|",
    "ul",
    "ol",
    "outdent",
    "indent",
    "font",
    "fontsize",
    "brush",
    "paragraph",
    "link",
    "image",
    "table",
    "align",
    "undo",
    "redo",
  ],
  extraButtons: [
    {
      name: "sqrt",
      iconURL:
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='black' viewBox='0 0 24 24'><text x='3' y='18' font-size='18'>√</text></svg>",
      tooltip: "Insert square root symbol",
      exec: (editor) => {
        editor.selection.insertHTML("√");
      },
    },
  ],
};

export default function UpdateCqQuestion() {
  const pathParts = location.pathname.split("/");
  const chapterId = pathParts[5];
  const questionId = pathParts[7];

  const token = localStorage?.getItem("token");

  const { data: getAQuestion, isLoading } = useGetAQuestionQuery({
    chapterId,
    questionId,
  });
  const { data: getAllTopics } = useGetAllTopicsQuery();
  const { data: getASingleChapter } = useGetAChapterQuery(chapterId);

  const [questionInfoUpdate, { isLoading: updateLoader }] =
    useQuestionInfoUpdateMutation();

  // Form states
  const [cqDetails, setCqDetails] = useState({
    mainQuestion: "",
    question1: "",
    answer1: "",
    question2: "",
    answer2: "",
    question3: "",
    answer3: "",
    question4: "",
    answer4: "",
    topic: "",
  });

  const [boardExamInfo, setBoardExamInfo] = useState("");
  const [schoolExamInfo, setSchoolExamInfo] = useState("");
  const [searchType, setSearchType] = useState([]);
  const [boardExamList, setBoardExamList] = useState([]);

  const matchedTopics = getAllTopics?.filter(
    (topic) =>
      topic.subject === getASingleChapter?.subjectName?.subjectName &&
      topic.class === getASingleChapter?.subjectClassName?.className &&
      topic.chapter === getASingleChapter?.chapterName
  );

  useEffect(() => {
    if (getAQuestion?.question) {
      setCqDetails(getAQuestion.question.cqDetails || {});
      setBoardExamInfo(getAQuestion.question.boardExamInfo || "");
      setSchoolExamInfo(getAQuestion.question.schoolExamInfo || "");
      setBoardExamList(getAQuestion.question.boardExamList || []);
    }
  }, [getAQuestion]);

  useEffect(() => {
    if (getAQuestion?.question?.searchType) {
      setSearchType(new Set(getAQuestion.question.searchType));
    }
  }, [getAQuestion]);

  const handleEditorChange = (field, value) => {
    setCqDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const searchTypeArray = Array.from(searchType);

    const updatedData = {
      boardExamInfo,
      schoolExamInfo,
      boardExamList,
      searchType: searchTypeArray,
      cqDetails,
    };

    try {
      const res = await questionInfoUpdate({
        formData: updatedData,
        token,
        chapterId,
        questionId,
      }).unwrap();

      if (res?.data) {
        Swal.fire({
          title: "Question updated successfully!",
          icon: "success",
          showCloseButton: true,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: err?.data?.msg,
        icon: "error",
        showCloseButton: true,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="ms-[270px] mt-24 me-3 solaimanlipi">
      <h2 className="text-2xl font-bold mb-6">Update CQ Question</h2>

      {isLoading ? (
        <p>Loading question...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 pb-5">
          {/* Board Exam List */}
          <div>
            <label className="block mb-1 font-semibold">
              Board Exam List (comma separated)
            </label>
            <input
              type="text"
              className="w-full border px-4 py-2 rounded"
              value={boardExamList.join(", ")}
              onChange={(e) =>
                setBoardExamList(e.target.value.split(",").map((s) => s.trim()))
              }
            />
          </div>

          {/* School Exam Info */}
          <div>
            <label className="block mb-1 font-semibold">School Exam Info</label>
            <input
              type="text"
              className="w-full border px-4 py-2 rounded"
              value={schoolExamInfo}
              onChange={(e) => setSchoolExamInfo(e.target.value)}
            />
          </div>

          {/* Search Type Multi-select */}
          <div>
            <label className="block mb-1 font-semibold">Search Type</label>
            <Select
              selectionMode="multiple"
              selectedKeys={searchType}
              onSelectionChange={setSearchType}
            >
              {allSearchTypes.map((type) => (
                <SelectItem key={type.key}>{type.label}</SelectItem>
              ))}
            </Select>
          </div>

          {/* JoditEditor Fields for CQ Details */}
          {[
            "mainQuestion",
            "question1",
            "answer1",
            "question2",
            "answer2",
            "question3",
            "answer3",
            "question4",
            "answer4",
          ].map((field, idx) => (
            <div key={idx}>
              <label className="block mb-1 font-semibold capitalize">
                {field.replace(/([a-z])([A-Z])/g, "$1 $2")}
              </label>
              <JoditEditor
                value={cqDetails?.[field] || ""}
                tabIndex={1}
                config={config}
                onBlur={(value) => handleEditorChange(field, value)}
              />
            </div>
          ))}

          <Select
            selectedKeys={[cqDetails.topic]}
            onSelectionChange={(keys) =>
              setCqDetails((prev) => ({ ...prev, topic: Array.from(keys)[0] }))
            }
            className="max-w-full"
            label="Select a topic"
          >
            {matchedTopics?.map((item) => (
              <SelectItem key={item.topicsName}>{item.topicsName}</SelectItem>
            ))}
          </Select>

          <button
            type="submit"
            disabled={updateLoader}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            {updateLoader ? "Updating..." : "Update Question"}
          </button>
        </form>
      )}
    </div>
  );
}
