import { MathJaxContext, MathJax } from "better-react-mathjax";

import { useLocation } from "react-router-dom";

import { useState, useMemo, useRef } from "react";

import JoditEditor from "jodit-react";

import { Button, Form } from "@heroui/react";
import { Select, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";
import {
  useCreateAMcqQuestionMutation,
  useGetAChapterQuery,
} from "../../../../redux/api/slices/chapterSlice";
import Swal from "sweetalert2";
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
export const typeQuestion = [{ key: "MCQ", label: "MCQ" }];

// Add this configuration at the top of your component file
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

export default function AddMcqQuestion() {
  const token = localStorage?.getItem("token");
  const editor = useRef(null);
  const editorOption1 = useRef(null);

  const configForQuestionEditor = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write your main question here...",
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

      extraPlugins: ["mathjax", "symbols"],
      mathJax: {
        engine: "mathjax",
        src: "https://cdn.jsdelivr.net/npm/mathjax@2/MathJax.js?config=TeX-AMS_HTML",
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

  const configForOption1 = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write your option 1...",
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

  const configForOption2 = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write your option 2...",
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

  const configForOption3 = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write your option 3...",
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

  const configForOption4 = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write your option 4...",
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

  const configForCorrcectAnswer = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write your correct answer...",
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

  const configForExplanationAnswer = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write your explanation...",
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

  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const chapterId = pathParts[5];

  const [editorQData, setEditorQData] = useState("");
  const [editor1Data, setEditor1Data] = useState("");
  const [editor2Data, setEditor2Data] = useState("");
  const [editor3Data, setEditor3Data] = useState("");
  const [editor4Data, setEditor4Data] = useState("");
  const [editorCorrectAnsData, setEditorCorrectAnsData] = useState("");
  const [explanationData, setExplanationData] = useState("");
  const [boardExamInfo, setBoardExamInfo] = useState("");
  const [boardExamList, setBoardExamList] = useState([]);
  const [schoolExamInfo, setSchoolExamInfo] = useState("");
  const [questionSearchType, setQuestionSearchType] = useState(["অনুশীলনী"]);
  const [questionSearchLevel, setQuestionSearchLevel] = useState(["জ্ঞান"]);
  const [topic, setTopic] = useState("");

  const [createAMcqQuestion, { isLoading }] = useCreateAMcqQuestionMutation();
  const { data: getAllTopics } = useGetAllTopicsQuery();
  const { data: getASingleChapter } = useGetAChapterQuery(chapterId);

  const matchedTopics = getAllTopics?.filter(
    (topic) =>
      topic.subject === getASingleChapter?.subjectName?.subjectName &&
      topic.class === getASingleChapter?.subjectClassName?.className &&
      topic.chapter === getASingleChapter?.chapterName
  );

  const handleAdd = () => {
    if (!boardExamInfo.trim()) return;

    setBoardExamList((prev) => [...prev, boardExamInfo.trim()]);
    setBoardExamInfo("");
  };

  const handleDelete = (index) => {
    const newList = [...boardExamList];
    newList.splice(index, 1);
    setBoardExamList(newList);
  };

  const handleEditorChange = async (e) => {
    e.preventDefault();
    const formData = {
      type: "MCQ",
      questionName: editorQData,
      option1: editor1Data,
      option2: editor2Data,
      option3: editor3Data,
      option4: editor4Data,
      topic: topic,
      correctAnswer: editorCorrectAnsData,
      // boardExamInfo: boardExamInfo,
      boardExamList: boardExamList,
      schoolExamInfo: schoolExamInfo,
      explanation: explanationData,
      searchType: questionSearchType,
      questionLevel: questionSearchLevel?.currentKey,
    };

    try {
      const res = await createAMcqQuestion({ formData, token, chapterId });
      if (res?.data) {
        Swal.fire({
          title: res?.data?.msg,
          icon: "success",
        });
      } else {
        Swal.fire({
          title: res?.error?.errors?.message,
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: error,
        icon: "error",
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
      setTopic("");
      window.location.reload();
    }
  };

  return (
    <div className="ms-[270px] mt-24 me-3">
      <h1 className="text-center font-bold text-3xl solaimanlipi">
        একটি বহুনির্বাচনীয় প্রশ্ন তৈরি করুন
      </h1>
      <Form onSubmit={handleEditorChange}>
        <MathJaxContext config={mathjaxConfig}>
          <div className="mt-10 w-full">
            <JoditEditor
              value={editorQData}
              ref={editor}
              config={configForQuestionEditor}
              tabIndex={1}
              onBlur={(newContent) => setEditorQData(newContent)}
              onChange={(newContent) => setEditorQData(newContent)}
            />
          </div>

          <div className="preview">
            <MathJax dynamic>{editorQData}</MathJax>
          </div>
        </MathJaxContext>

        <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-5">
          <MathJaxContext config={mathjaxConfig}>
            <div className="mt-10 w-full">
              <JoditEditor
                value={editor1Data}
                ref={editorOption1}
                config={configForOption1}
                tabIndex={2}
                onBlur={(newContent) => setEditor1Data(newContent)}
                onChange={(newContent) => setEditor1Data(newContent)}
              />
            </div>

            <MathJaxContext config={mathjaxConfig}>
              <div className="mt-10">
                <JoditEditor
                  value={editor2Data}
                  config={configForOption2}
                  tabIndex={3}
                  onBlur={(newContent) => setEditor2Data(newContent)}
                  onChange={(newContent) => setEditor2Data(newContent)}
                />
              </div>
            </MathJaxContext>

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
          </MathJaxContext>

          <div className="max-w-full space-y-4">
            <div className="flex items-end gap-2">
              <Input
                label="Board Exam Info"
                type="text"
                value={boardExamInfo}
                onValueChange={setBoardExamInfo}
                placeholder="e.g. SSC - 2020"
              />
              <Button color="primary" onPress={handleAdd}>
                Add
              </Button>
            </div>

            <ul className="list-disc pl-5">
              {boardExamList.map((item, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{item}</span>
                  <Button
                    size="sm"
                    color="danger"
                    variant="light"
                    onPress={() => handleDelete(index)}
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full">
            <Input
              label="School exam info"
              type="text"
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
            onSelectionChange={(keys) => setQuestionSearchLevel(keys)}
            className="max-w-full"
            label="Select search type"
          >
            {questionLevel?.map((animal) => (
              <SelectItem key={animal.key}>{animal.label}</SelectItem>
            ))}
          </Select>
          <Select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="max-w-full"
            label="Select a topic"
          >
            {matchedTopics?.map((item) => (
              <SelectItem key={item.topicsName} value={item.topicsName}>
                {item.topicsName}
              </SelectItem>
            ))}
          </Select>
        </div>

        <Button
          isLoading={isLoading}
          className="mt-5 mb-5"
          color="success"
          type="submit"
        >
          Create question
        </Button>
      </Form>
    </div>
  );
}
