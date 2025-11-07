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
import ClientLoader from "../../../../utils/loader/ClientLoader";

const allSearchTypes = [
  { key: "অনুশীলনী", label: "অনুশীলনী" },
  { key: "চিত্রযুক্ত", label: "চিত্রযুক্ত" },
  { key: "বহুপদী", label: "বহুপদী" },
  { key: "অভিন্ন তথ্যভিত্তিক", label: "অভিন্ন তথ্যভিত্তিক" },
  { key: "রিপিটেড স্কুল", label: "রিপিটেড স্কুল" },
  { key: "তত্ত্বীয়", label: "তত্ত্বীয়" },
  { key: "গাণিতিক", label: "গাণিতিক" },
];

export default function UpdateShortQuestion() {
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

  // Initialize state with proper structure for short questions
  const [shortQusDetails, setShortQusDetails] = useState({
    shortQuestion: "",
    shortQuestionAnswer: "",
    shortQuestionTopic: "",
    boardExamList: [],
  });

  const [boardExamList, setBoardExamList] = useState([]);
  const [searchType, setSearchType] = useState([]);

  const matchedTopics = getAllTopics?.filter(
    (topic) =>
      topic.subject === getASingleChapter?.subjectName?.subjectName &&
      topic.class === getASingleChapter?.subjectClassName?.className &&
      topic.chapter === getASingleChapter?.chapterName
  );

  useEffect(() => {
    if (getAQuestion?.question) {
      // Set short question details correctly
      if (getAQuestion.question.shortQusDetails) {
        setShortQusDetails({
          shortQuestion:
            getAQuestion.question.shortQusDetails.shortQuestion || "",
          shortQuestionAnswer:
            getAQuestion.question.shortQusDetails.shortQuestionAnswer || "",
          shortQuestionTopic:
            getAQuestion.question.shortQusDetails.shortQuestionTopic || "",
          boardExamList:
            getAQuestion.question.shortQusDetails.boardExamList || [],
        });
      }

      setBoardExamList(getAQuestion.question?.boardExamList || []);

      if (getAQuestion.question?.searchType) {
        setSearchType(new Set(getAQuestion.question.searchType));
      }
    }
  }, [getAQuestion]);

  const handleEditorChange = (field, value) => {
    setShortQusDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data in the exact format expected by the backend
    const updatedData = {
      boardExamList: boardExamList.filter((item) => item.trim() !== ""),
      searchType: Array.from(searchType),
      shortQusDetails: {
        shortQuestion: shortQusDetails.shortQuestion || "",
        shortQuestionAnswer: shortQusDetails.shortQuestionAnswer || "",
        shortQuestionTopic: shortQusDetails.shortQuestionTopic || "",
        boardExamList:
          shortQusDetails.boardExamList.filter((item) => item.trim() !== "") ||
          [],
      },
    };

    console.log("updatedData:", updatedData);

    try {
      const res = await questionInfoUpdate({
        formData: updatedData,
        token,
        chapterId,
        questionId,
      }).unwrap();

      console.log("update res:", res);

      Swal.fire({
        title: "Question updated successfully!",
        icon: "success",
        showCloseButton: true,
        showConfirmButton: false,
      });
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

  if (isLoading) {
    return <ClientLoader />;
  }

  return (
    <div className="ms-[270px] mt-24 me-3 solaimanlipi">
      <h2 className="text-2xl font-bold mb-6">Update Short Question</h2>

      {isLoading ? (
        <p>Loading question...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 pb-5">
          {/* Board Exam List (Question Level) */}
          <div>
            <label className="block mb-1 font-semibold">
              Board Exam List (comma separated)
            </label>
            <input
              type="text"
              className="w-full border px-4 py-2 rounded"
              value={boardExamList?.join(", ") || ""}
              onChange={(e) =>
                setBoardExamList(
                  e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s !== "")
                )
              }
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

          {/* Short Question */}
          <div>
            <label className="block mb-1 font-semibold">Short Question</label>
            <JoditEditor
              value={shortQusDetails?.shortQuestion || ""}
              tabIndex={1}
              onBlur={(value) => handleEditorChange("shortQuestion", value)}
            />
          </div>

          {/* Short Question Answer */}
          <div>
            <label className="block mb-1 font-semibold">
              Short Question Answer
            </label>
            <JoditEditor
              value={shortQusDetails?.shortQuestionAnswer || ""}
              tabIndex={1}
              onBlur={(value) =>
                handleEditorChange("shortQuestionAnswer", value)
              }
            />
          </div>

          {/* Short Question Board Exam List */}
          <div>
            <label className="block mb-1 font-semibold">
              Short Question Board Exam List (comma separated)
            </label>
            <input
              type="text"
              className="w-full border px-4 py-2 rounded"
              value={shortQusDetails.boardExamList?.join(", ") || ""}
              onChange={(e) =>
                setShortQusDetails((prev) => ({
                  ...prev,
                  boardExamList: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s !== ""),
                }))
              }
            />
          </div>

          {/* Topic Selection */}
          <div>
            <label className="block mb-1 font-semibold">Topic</label>
            <Select
              selectedKeys={[shortQusDetails?.shortQuestionTopic]}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0];
                setShortQusDetails((prev) => ({
                  ...prev,
                  shortQuestionTopic: selectedKey,
                }));
              }}
              className="max-w-full"
              label="Select a topic"
            >
              {matchedTopics?.map((item) => (
                <SelectItem key={item.topicsName}>{item.topicsName}</SelectItem>
              ))}
            </Select>
          </div>

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
