import { useEffect, useMemo, useState } from "react";
import {
  useGetAChapterQuery,
  useGetAQuestionQuery,
  useQuestionInfoUpdateMutation,
} from "../../../../redux/api/slices/chapterSlice";
import JoditEditor from "jodit-react";
import { Button, Form, Input, Select, SelectItem } from "@heroui/react";
import Swal from "sweetalert2";

import sanitizeHtml from "sanitize-html";
import { useGetAllTopicsQuery } from "../../../../redux/api/slices/topicsSlice";

export const searchType = [
  { key: "অনুশীলনী", label: "অনুশীলনী" },
  { key: "চিত্রযুক্ত", label: "চিত্রযুক্ত" },
  { key: "বহুপদী", label: "বহুপদী" },
  { key: "অভিন্ন তথ্যভিত্তিক", label: "অভিন্ন তথ্যভিত্তিক" },
  { key: "রিপিটেড স্কুল", label: "রিপিটেড স্কুল" },
  { key: "তত্ত্বীয়", label: "তত্ত্বীয়" },
  { key: "গাণিতিক", label: "গাণিতিক" },
];
export const questionLevel = [
  { key: "জ্ঞান", label: "জ্ঞান" },
  { key: "অনুধাবন", label: "অনুধাবন" },
  { key: "প্রয়োগ", label: "প্রয়োগ" },
  { key: "দক্ষতা", label: "দক্ষতা" },
  { key: "সহজ(গণিত বিষয়)", label: "সহজ(গণিত বিষয়)" },
  { key: "মধ্যম(গণিত বিষয়)", label: "মধ্যম(গণিত বিষয়)" },
  { key: "কঠিন(গণিত বিষয়)", label: "কঠিন(গণিত বিষয়)" },
];
export const typeQuestion = [
  { key: "MCQ", label: "MCQ" },
  { key: "CQ", label: "CQ" },
];

export default function UpdateAQuestion() {
  const pathParts = location.pathname.split("/");
  const chapterId = pathParts[4];
  const questionId = pathParts[6];

  const token = localStorage?.getItem("token");

  const [editorQData, setEditorQData] = useState("");
  const [editor1Data, setEditor1Data] = useState("");
  const [editor2Data, setEditor2Data] = useState("");
  const [editor3Data, setEditor3Data] = useState("");
  const [editor4Data, setEditor4Data] = useState("");
  const [editorCorrectAnsData, setEditorCorrectAnsData] = useState("");
  const [explanationData, setExplanationData] = useState("");
  const [boardExamInfo, setBoardExamInfo] = useState("");
  const [schoolExamInfo, setSchoolExamInfo] = useState("");
  const [topic, setTopic] = useState("");
  const [questionSearchType, setQuestionSearchType] = useState([]);
  const [questionSearchLevel, setQuestionSearchLevel] = useState(new Set());
  const [questionType, setQuestionType] = useState(new Set([]));

  const { data: getAQuestion } = useGetAQuestionQuery({
    chapterId,
    questionId,
  });
  const { data: getAllTopics } = useGetAllTopicsQuery();
  const { data: getASingleChapter } = useGetAChapterQuery(chapterId);

  const [questionInfoUpdate, { isLoading: updateLoader }] =
    useQuestionInfoUpdateMutation();

  const matchedTopics = getAllTopics?.filter(
    (topic) =>
      topic.subject === getASingleChapter?.subjectName?.subjectName &&
      topic.class === getASingleChapter?.subjectClassName?.className &&
      topic.chapter === getASingleChapter?.chapterName
  );

  useEffect(() => {
    if (getAQuestion?.question?.questionName) {
      const safeData = sanitizeHtml(getAQuestion.question?.questionName, {
        allowedTags: ["p", "b", "i", "u", "span", "img"],
        allowedAttributes: {
          img: ["src", "alt", "width", "height", "loading"],
          "*": ["style"],
        },
      });
      setEditorQData(safeData);
    }
    if (getAQuestion?.question?.option1) {
      const safeDataForOption1 = sanitizeHtml(getAQuestion.question.option1, {
        allowedTags: ["b", "i", "u", "span", "img"],
        allowedAttributes: {},
      });
      setEditor1Data(safeDataForOption1);
    }
    if (getAQuestion?.question?.option2) {
      const safeDataForOption2 = sanitizeHtml(getAQuestion.question.option2, {
        allowedTags: ["b", "i", "u", "span", "img"],
        allowedAttributes: {},
      });
      setEditor2Data(safeDataForOption2);
    }
    if (getAQuestion?.question?.option3) {
      const safeDataForOption3 = sanitizeHtml(getAQuestion.question.option3, {
        allowedTags: ["b", "i", "u", "span", "img"],
        allowedAttributes: {},
      });
      setEditor3Data(safeDataForOption3);
    }
    if (getAQuestion?.question?.option4) {
      const safeDataForOption4 = sanitizeHtml(getAQuestion.question.option4, {
        allowedTags: ["b", "i", "u", "span", "img"],
        allowedAttributes: {},
      });
      setEditor4Data(safeDataForOption4);
    }

    if (getAQuestion?.question?.correctAnswer) {
      const safeDataForCorrectAnswer = sanitizeHtml(
        getAQuestion.question.correctAnswer,
        {
          allowedTags: ["b", "i", "u", "span", "img"],
          allowedAttributes: {},
        }
      );
      setEditorCorrectAnsData(safeDataForCorrectAnswer);
    }
    if (getAQuestion?.question?.explanation) {
      const safeDataForExplanation = sanitizeHtml(
        getAQuestion.question.explanation,
        {
          allowedTags: ["b", "i", "u", "span", "img"],
          allowedAttributes: {},
        }
      );
      setExplanationData(safeDataForExplanation);
    }
    if (getAQuestion?.question?.boardExamInfo) {
      const safeDataForBoardExamInfo = sanitizeHtml(
        getAQuestion.question.boardExamInfo,
        {
          allowedTags: ["b", "i", "u", "span", "img"],
          allowedAttributes: {},
        }
      );
      setBoardExamInfo(safeDataForBoardExamInfo);
    }
    if (getAQuestion?.question?.schoolExamInfo) {
      const safeDataForBoardSchoolInfo = sanitizeHtml(
        getAQuestion.question.schoolExamInfo,
        {
          allowedTags: ["b", "i", "u", "span", "img"],
          allowedAttributes: {},
        }
      );
      setSchoolExamInfo(safeDataForBoardSchoolInfo);
    }

    if (getAQuestion?.question?.searchType) {
      setQuestionSearchType(getAQuestion.question.searchType);
    }

    if (getAQuestion?.question?.questionLevel) {
      setQuestionSearchLevel(new Set([getAQuestion.question.questionLevel]));
    }

    if (getAQuestion?.question?.type) {
      setQuestionType(new Set([getAQuestion.question.type]));
    }
  }, [getAQuestion]);

  const configForQuestionEditor = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write your question here...",
    }),
    []
  );
  const configForOption1 = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write here option 1...",
    }),
    []
  );
  const configForOption2 = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write here option 2...",
    }),
    []
  );
  const configForOption3 = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write here option 3...",
    }),
    []
  );
  const configForOption4 = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write here option 4...",
    }),
    []
  );
  const configForCorrcectAnswer = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write here correct answer...",
    }),
    []
  );

  const configForExplanationAnswer = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write here explanation according to the answer...",
    }),
    []
  );

  const handleEditorChange = async (e) => {
    e.preventDefault();

    const selectedLevel =
      questionSearchLevel.size > 0 ? Array.from(questionSearchLevel)[0] : "";

    const formData = {
      type: questionType?.currentKey,
      questionName: editorQData,
      option1: editor1Data,
      option2: editor2Data,
      option3: editor3Data,
      option4: editor4Data,
      correctAnswer: editorCorrectAnsData,
      boardExamInfo: boardExamInfo,
      schoolExamInfo: schoolExamInfo,
      explanation: explanationData,
      searchType: questionSearchType,
      questionLevel: selectedLevel,
      topic: topic,
    };

    try {
      const res = await questionInfoUpdate({
        formData,
        token,
        chapterId,
        questionId,
      });

      console.log("res", res);

      if (res?.data) {
        Swal.fire({
          title: res?.data?.msg,
          icon: "success",
          showCloseButton: true,
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          title: res?.error?.data?.error,
          icon: "error",
          showCloseButton: true,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        title: error,
        icon: "error",
        showCloseButton: true,
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setEditorQData("");
      setEditor1Data("");
      setEditor2Data("");
      setEditor3Data("");
      setEditor4Data("");
      setEditorCorrectAnsData("");
      setExplanationData("");
      setBoardExamInfo("");
      setSchoolExamInfo("");
      setQuestionSearchType("");
      setQuestionSearchLevel("");
      setQuestionType("");
    }
  };
  return (
    <div className="ms-[270px] mt-24 me-3 solaimanlipi">
      <p className="text-center font-bold text-4xl pt-3">
        <span
          className="text-green-700 font-semibold text-nowrap"
          dangerouslySetInnerHTML={{
            __html: `${editorQData} উক্ত প্রশ্নটি পরিবর্তন করুন`,
          }}
        />
      </p>

      <Form onSubmit={handleEditorChange}>
        <div className="mt-10 w-full">
          <JoditEditor
            value={editorQData}
            config={configForQuestionEditor}
            tabIndex={1}
            onBlur={(newContent) => setEditorQData(newContent)}
            onChange={(newContent) => setEditorQData(newContent)}
          />
        </div>

        <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-5">
          <div className="mt-10">
            <JoditEditor
              value={editor1Data}
              config={configForOption1}
              tabIndex={2}
              onBlur={(newContent) => setEditor1Data(newContent)}
              onChange={(newContent) => setEditor1Data(newContent)}
            />
          </div>
          <div className="mt-10">
            <JoditEditor
              value={editor2Data}
              config={configForOption2}
              tabIndex={3}
              onBlur={(newContent) => setEditor2Data(newContent)}
              onChange={(newContent) => setEditor2Data(newContent)}
            />
          </div>
          <div className="mt-10">
            <JoditEditor
              value={editor3Data}
              config={configForOption3}
              tabIndex={3}
              onBlur={(newContent) => setEditor3Data(newContent)}
              onChange={(newContent) => setEditor3Data(newContent)}
            />
          </div>

          <div className="mt-10">
            <JoditEditor
              value={editor4Data}
              config={configForOption4}
              tabIndex={5}
              onBlur={(newContent) => setEditor4Data(newContent)}
              onChange={(newContent) => {
                setEditor4Data(newContent);
              }}
            />
          </div>

          <div className="mt-10">
            <JoditEditor
              value={editorCorrectAnsData}
              config={configForCorrcectAnswer}
              tabIndex={3}
              onBlur={(newContent) => setEditorCorrectAnsData(newContent)}
              onChange={(newContent) => setEditorCorrectAnsData(newContent)}
            />
          </div>
          <div className="mt-10">
            <JoditEditor
              value={explanationData}
              config={configForExplanationAnswer}
              tabIndex={3}
              onBlur={(newContent) => setExplanationData(newContent)}
              onChange={(newContent) => setExplanationData(newContent)}
            />
          </div>

          <div className="w-full">
            <Input
              label="Board exam info"
              type="text"
              value={boardExamInfo}
              onValueChange={(setValue) => setBoardExamInfo(setValue)}
            />
          </div>
          <div className="w-full">
            <Input
              label="School exam info"
              type="text"
              value={schoolExamInfo}
              onValueChange={(setValue) => setSchoolExamInfo(setValue)}
            />
          </div>

          <Select
            selectedKeys={questionSearchType}
            selectionMode="multiple"
            onSelectionChange={(keys) =>
              setQuestionSearchType(Array.from(keys))
            }
            className="max-w-full"
            label="Select search type"
          >
            {searchType?.map((animal) => (
              <SelectItem key={animal.key}>{animal.label}</SelectItem>
            ))}
          </Select>

          <Select
            selectedKeys={questionSearchLevel}
            onSelectionChange={setQuestionSearchLevel}
            isRequired
            className="max-w-full"
            label="Select question level"
          >
            {questionLevel?.map((level) => (
              <SelectItem key={level.key}>{level.label}</SelectItem>
            ))}
          </Select>

          <Select
            selectedKeys={questionType}
            onSelectionChange={setQuestionType}
            isRequired
            className="max-w-full"
            label="Select a question type"
          >
            {typeQuestion?.map((type) => (
              <SelectItem key={type.key}>{type.label}</SelectItem>
            ))}
          </Select>

          <Select
            selectedKeys={[topic]}
            onSelectionChange={(keys) => setTopic(Array.from(keys)[0])}
            className="max-w-full"
            label="Select a topic"
          >
            {matchedTopics?.map((item) => (
              <SelectItem key={item.topicsName}>{item.topicsName}</SelectItem>
            ))}
          </Select>
        </div>

        <Button
          isLoading={updateLoader}
          className="mt-5 mb-5"
          color="secondary"
          type="submit"
        >
          Update question
        </Button>
      </Form>
    </div>
  );
}
