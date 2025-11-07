import { useMemo, useRef, useState } from "react";
import {
  useCreateAShortQuestionMutation,
  useGetAChapterQuery,
  useGetAllChaptersQuery,
} from "../../../../redux/api/slices/chapterSlice";
import ClientLoader from "../../../../utils/loader/ClientLoader";

import JoditEditor from "jodit-react";
import { MathJaxContext, MathJax } from "better-react-mathjax";
import { Button, Select, SelectItem } from "@heroui/react";
import { Input } from "@heroui/input";
import Swal from "sweetalert2";
import { useGetAllTopicsQuery } from "../../../../redux/api/slices/topicsSlice";

const mathjaxConfig = {
  loader: { load: ["input/asciimath"] },
  tex: {
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
    processEscapes: true,
  },
  asciimath: {
    delimiters: [["`", "`"]],
  },
  options: {
    enableMenu: false,
  },
};

export const searchType = [
  { key: "অনুশীলনী", label: "অনুশীলনী" },
  { key: "চিত্রযুক্ত", label: "চিত্রযুক্ত" },
  { key: "বহুপদী", label: "বহুপদী" },
  { key: "অভিন্ন তথ্যভিত্তিক", label: "অভিন্ন তথ্যভিত্তিক" },
  { key: "রিপিটেড স্কুল", label: "রিপিটেড স্কুল" },
  { key: "তত্ত্বীয়", label: "তত্ত্বীয়" },
  { key: "গাণিতিক", label: "গাণিতিক" },
];
export default function AddShortQuestion() {
  const token = localStorage?.getItem("token");
  const pathParts = location.pathname.split("/");
  const chapterId = pathParts[5];

  const [boardExamInput, setBoardExamInput] = useState("");
  //   const [questionSearchType, setQuestionSearchType] = useState([]);
  const [boardExamList, setBoardExamList] = useState([]);

  const shortQuestionRef = useRef(null);
  const shortQuestionAnswerRef = useRef(null);

  const [shortQuestionEditor, setShortQuestionEditor] = useState("");
  const [shortQuestionAnswerEditor, setshortQuestionAnswerEditor] =
    useState("");
  const [topic, setTopic] = useState("");

  const { data: getAllChapters, isLoading: chapterLoader } =
    useGetAllChaptersQuery();
  const { data: getASingleChapter } = useGetAChapterQuery(chapterId);

  const { data: getAllTopics } = useGetAllTopicsQuery();

  const matchedTopics = getAllTopics?.filter(
    (topic) =>
      topic.subject === getASingleChapter?.subjectName?.subjectName &&
      topic.class === getASingleChapter?.subjectClassName?.className &&
      topic.chapter === getASingleChapter?.chapterName
  );

  const handleAddBoardExam = () => {
    if (boardExamInput.trim() !== "") {
      setBoardExamList((prev) => [...prev, boardExamInput.trim()]);
      setBoardExamInput("");
    }
  };

  const handleRemoveBoardExam = (index) => {
    setBoardExamList((prev) => prev.filter((_, i) => i !== index));
  };

  const [createAShortQuestion, { isLoading: shortQuestionLoader }] =
    useCreateAShortQuestionMutation();

  const getSingleChapter = getAllChapters?.find(
    (chapter) => chapter?._id === chapterId
  );

  const configForShortQuestionEditor = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write your main short question here...",
      buttons: [
        "mathjax",
        "bold",
        "italic",
        "underline",
        "subscript",
        "superscript",
        {
          name: "সুতরাং",
          icon: "∴",
          exec: (editor) => {
            editor.s.insertHTML("∴");
          },
        },
        "|",
        "ul",
        "ol",
        "|",
        "fontsize",
        "|",
        "fullsize",
        "|",
        "image",
        "|",
        "table",
        "|",
        "preview",
        { name: "symbols", icon: "omega" },
      ],
      extraPlugins: ["mathjax"],
      mathJax: {
        engine: "mathjax",
        src: "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js",
        preview: true,
        asciimath: {
          displaystyle: true,
        },
        styles: {
          ".mathjax-preview": {
            backgroundColor: "#f3f4f6",
            padding: "10px",
            borderRadius: "4px",
            margin: "5px 0",
          },
        },
      },
      height: 500,
    }),
    []
  );

  const configForShortQuestionAnswerEditor = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write here short question answer...",
      buttons: [
        "mathjax",
        "bold",
        "italic",
        "underline",
        "subscript",
        "superscript",
        {
          name: "সুতরাং",
          icon: "∴",
          exec: (editor) => {
            editor.s.insertHTML("∴");
          },
        },
        "|",
        "ul",
        "ol",
        "|",
        "fontsize",
        "|",
        "fullsize",
        "|",
        "image",
        "|",
        "table",
        "|",
        "preview",
        { name: "symbols", icon: "omega" },
      ],
      extraPlugins: ["mathjax"],
      mathJax: {
        engine: "mathjax",
        src: "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js",
        preview: true,
        asciimath: {
          displaystyle: true,
        },
        styles: {
          ".mathjax-preview": {
            backgroundColor: "#f3f4f6",
            padding: "10px",
            borderRadius: "4px",
            margin: "5px 0",
          },
        },
      },
      height: 500,
      width: "100%",
    }),
    []
  );

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Prepare short qus details object
    const shortQusDetails = {
      shortQuestion: shortQuestionEditor,
      shortQuestionAnswer: shortQuestionAnswerEditor,
      shortQuestionTopic: topic,
      boardExamList: boardExamList,
    };

    // Prepare complete form data
    const formData = {
      shortQusDetails,
    };
    try {
      const res = await createAShortQuestion({
        formData: formData,
        token: token,
        chapterId: chapterId,
      });

      if (res?.data) {
        Swal.fire({
          title: "A Short Question Added.",
          icon: "success",
          showCloseButton: true,
          showConfirmButton: false,
          timer: 1500,
        });
        window.location.reload();
      } else {
        Swal.fire({
          title: "Short Question Not Added. Please check your login status.",
          icon: "error",
          showCloseButton: true,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        title: error.message || "An error occurred",
        icon: "error",
        showCloseButton: true,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  if (chapterLoader) {
    return <ClientLoader />;
  }
  return (
    <div className="ms-[270px] mt-24 me-3">
      <p className="text-center font-bold solaimanlipi text-4xl">
        অধ্যায়:{" "}
        <span className="text-[#22c55e]">{getSingleChapter?.chapterName}</span>{" "}
        সংক্ষিপ্ত প্রশ্ন তৈরি করুন
      </p>
      <form onSubmit={handleFormSubmit} className="">
        <div>
          <MathJaxContext config={mathjaxConfig} className="w-full">
            <div className="mt-10 w-full">
              <JoditEditor
                value={shortQuestionEditor}
                ref={shortQuestionRef}
                config={configForShortQuestionEditor}
                tabIndex={1}
                onBlur={(newContent) => setShortQuestionEditor(newContent)}
                onChange={(newContent) => setShortQuestionEditor(newContent)}
              />
            </div>

            <div className="preview">
              <MathJax dynamic>{shortQuestionEditor}</MathJax>
            </div>
          </MathJaxContext>
        </div>

        <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
          <div>
            <MathJaxContext config={mathjaxConfig}>
              <div className="mt-10 w-full">
                <JoditEditor
                  value={shortQuestionAnswerEditor}
                  ref={shortQuestionAnswerRef}
                  config={configForShortQuestionAnswerEditor}
                  tabIndex={1}
                  onBlur={(newContent) =>
                    setshortQuestionAnswerEditor(newContent)
                  }
                  onChange={(newContent) =>
                    setshortQuestionAnswerEditor(newContent)
                  }
                />
              </div>

              <div className="preview">
                <MathJax dynamic>{shortQuestionAnswerEditor}</MathJax>
              </div>
            </MathJaxContext>
          </div>

          {/* <Input
            label="Board Exam Info"
            type="text"
            placeholder="e.g: board name-year"
            onValueChange={(setValue) => setBoardExamInfo(setValue)}
          /> */}
          {/* <Input
            label="School exam info"
            type="text"
            onValueChange={(setValue) => setSchoolExamInfo(setValue)}
          /> */}
          {/* <Select
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
          </Select> */}
          {/* Board Exam Todo Input */}
          <div className="mt-6">
            <label className="block mb-2 font-semibold">Board Exam List</label>
            <div className="flex gap-2">
              <Input
                placeholder="কুমিল্লা-২০২০, ঢাকা-২০২২ ..."
                value={boardExamInput}
                onChange={(e) => setBoardExamInput(e.target.value)}
                className="flex-1"
              />
              <Button color="primary" onClick={handleAddBoardExam}>
                Add
              </Button>
            </div>

            {/* Render list */}
            <ul className="mt-3 space-y-2">
              {boardExamList.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center border px-3 py-2 rounded"
                >
                  <span>{item}</span>
                  <Button
                    color="danger"
                    size="sm"
                    variant="light"
                    onClick={() => handleRemoveBoardExam(index)}
                  >
                    ✕
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <Select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="max-w-full mt-10"
            label="Select a topic"
          >
            {matchedTopics?.map((item) => (
              <SelectItem key={item.topicsName} value={item.topicsName}>
                {item.topicsName}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className="flex justify-center items-center">
          <Button
            isLoading={shortQuestionLoader}
            type="submit"
            className="mt-10 mb-10"
            color="success"
          >
            Create
          </Button>
        </div>
      </form>
    </div>
  );
}
