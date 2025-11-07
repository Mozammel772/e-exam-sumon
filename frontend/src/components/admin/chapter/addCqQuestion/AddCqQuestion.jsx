import { useMemo, useRef, useState } from "react";
import {
  useCreateACqQuestionMutation,
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

export default function AddCqQuestion() {
  const token = localStorage?.getItem("token");
  const pathParts = location.pathname.split("/");
  const chapterId = pathParts[5];

  // State declarations
  const [boardExamInfo, setBoardExamInfo] = useState("");
  const [boardExamList, setBoardExamList] = useState([]);
  const [schoolExamInfo, setSchoolExamInfo] = useState("");
  const [questionSearchType, setQuestionSearchType] = useState([]);

  const mainQuestionEditorRef = useRef(null);
  const question1EditorRef = useRef(null);
  const question2EditorRef = useRef(null);
  const question3EditorRef = useRef(null);
  const question4EditorRef = useRef(null);
  const answer1EditorRef = useRef(null);
  const answer2EditorRef = useRef(null);
  const answer3EditorRef = useRef(null);
  const answer4EditorRef = useRef(null);

  const [mainQuestionEditor, setMainQuestionEditor] = useState("");
  const [question1Editor, setQuestion1Editor] = useState("");
  const [question2Editor, setQuestion2Editor] = useState("");
  const [question3Editor, setQuestion3Editor] = useState("");
  const [question4Editor, setQuestion4Editor] = useState("");
  const [answer1Editor, setAnswer1Editor] = useState("");
  const [answer2Editor, setAnswer2Editor] = useState("");
  const [answer3Editor, setAnswer3Editor] = useState("");
  const [answer4Editor, setAnswer4Editor] = useState("");
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

  const [createACqQuestion, { isLoading: cqQuestionLoader }] =
    useCreateACqQuestionMutation();

  const getSingleChapter = getAllChapters?.find(
    (chapter) => chapter?._id === chapterId
  );

  // Board Exam List handlers
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

  const configForMainQuestionEditor = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write your main question here...",
      height: 500,
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
          exec: (editor) => editor.s.insertHTML("∴"),
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
        {
          name: "mathSymbols",
          icon: "sigma",
          tooltip: "Insert Math / Science Symbol",
          popup: (editor) => {
            const symbols = [
              { label: "√", insert: "\\(\\sqrt{}\\)" },
              { label: "½", insert: "\\(\\frac{1}{2}\\)" },
              { label: "π", insert: "\\(\\pi\\)" },
              { label: "θ", insert: "\\(\\theta\\)" },
              { label: "Δ", insert: "\\(\\Delta\\)" },
              { label: "α", insert: "\\(\\alpha\\)" },
              { label: "β", insert: "\\(\\beta\\)" },
              { label: "→", insert: "\\(\\rightarrow\\)" },
              { label: "⇌", insert: "\\(\\rightleftharpoons\\)" },
              { label: "²", insert: "²" },
              { label: "³", insert: "³" },
              { label: "₁", insert: "₁" },
              { label: "₂", insert: "₂" },
              { label: "₃", insert: "₃" },
              { label: "¼", insert: "\\(\\frac{1}{4}\\)" },
              { label: "¾", insert: "\\(\\frac{3}{4}\\)" },
              { label: "⅓", insert: "\\(\\frac{1}{3}\\)" },
              { label: "⅔", insert: "\\(\\frac{2}{3}\\)" },
            ];

            const popup = document.createElement("div");
            popup.style.padding = "8px";
            popup.style.display = "grid";
            popup.style.gridTemplateColumns = "repeat(5, 1fr)";
            popup.style.gap = "6px";

            symbols.forEach(({ label, insert }) => {
              const btn = document.createElement("button");
              btn.textContent = label;
              btn.style.padding = "6px";
              btn.style.fontSize = "18px";
              btn.style.border = "1px solid #ddd";
              btn.style.borderRadius = "4px";
              btn.style.cursor = "pointer";
              btn.onclick = () => {
                editor.s.insertHTML(insert);
                editor.e.fire("closePopup");
              };
              popup.appendChild(btn);
            });

            return popup;
          },
        },
      ],
      extraPlugins: ["mathjax"],
      mathJax: {
        engine: "mathjax",
        src: "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js",
        preview: true,
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
        styles: {
          ".mathjax-preview": {
            backgroundColor: "#f3f4f6",
            padding: "10px",
            borderRadius: "4px",
            margin: "5px 0",
          },
        },
      },
    }),
    []
  );

  const configForQuestion1 = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write your question 1...",
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

  const configForQuestion1Answer = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write your question 1 answer...",
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

  const configForQuestion2 = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write your question 2...",
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

  const configForQuestion2Answer = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write your question 2 answer...",
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

  const configForQuestion3 = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write your question 3...",
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

  const configForQuestion3Answer = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write your question 3 answer...",
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

  const configForQuestion4 = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write your question 4...",
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

  const configForQuestion4Answer = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write your question 4 answer...",
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

    // Prepare CQ details object
    const cqDetails = {
      mainQuestion: mainQuestionEditorRef.current.value,
      question1: question1EditorRef.current.value,
      answer1: answer1EditorRef.current.value,
      question2: question2EditorRef.current.value,
      answer2: answer2EditorRef.current.value,
      question3: question3EditorRef.current.value,
      answer3: answer3EditorRef.current.value,
      question4: question4EditorRef.current.value,
      answer4: answer4EditorRef.current.value,
      topic: topic,
    };

    // Prepare complete form data
    const formData = {
      cqDetails: cqDetails,
      type: "CQ",
      boardExamList: boardExamList,
      schoolExamInfo: schoolExamInfo,
      searchType: questionSearchType,
    };
    try {
      const res = await createACqQuestion({
        formData: formData,
        token: token,
        chapterId: chapterId,
      });

      if (res?.data) {
        Swal.fire({
          title: "Question Added.",
          icon: "success",
          showCloseButton: true,
          showConfirmButton: false,
          timer: 1500,
        });
        window.location.reload();
      } else {
        Swal.fire({
          title: "Question Not Added. Please check your login status.",
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
        সৃজনশীল প্রশ্ন তৈরি করুন
      </p>

      <form onSubmit={handleFormSubmit} className="">
        <div>
          <MathJaxContext config={mathjaxConfig} className="w-full">
            <div className="mt-10 w-full">
              <JoditEditor
                value={mainQuestionEditor}
                ref={mainQuestionEditorRef}
                config={configForMainQuestionEditor}
                tabIndex={1}
                onBlur={(newContent) => setMainQuestionEditor(newContent)}
                onChange={(newContent) => setMainQuestionEditor(newContent)}
              />
            </div>

            <div className="preview">
              <MathJax dynamic>{mainQuestionEditor}</MathJax>
            </div>
          </MathJaxContext>
        </div>

        <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
          <div>
            <MathJaxContext config={mathjaxConfig}>
              <div className="mt-10 w-full">
                <JoditEditor
                  value={question1Editor}
                  ref={question1EditorRef}
                  config={configForQuestion1}
                  tabIndex={1}
                  onBlur={(newContent) => setQuestion1Editor(newContent)}
                  onChange={(newContent) => setQuestion1Editor(newContent)}
                />
              </div>

              <div className="preview">
                <MathJax dynamic>{question1Editor}</MathJax>
              </div>
            </MathJaxContext>
          </div>
          <div>
            <MathJaxContext config={mathjaxConfig}>
              <div className="mt-10 w-full">
                <JoditEditor
                  value={answer1Editor}
                  ref={answer1EditorRef}
                  config={configForQuestion1Answer}
                  tabIndex={2}
                  onBlur={(newContent) => setAnswer1Editor(newContent)}
                  onChange={(newContent) => setAnswer1Editor(newContent)}
                />
              </div>

              <div className="preview">
                <MathJax dynamic>{answer1Editor}</MathJax>
              </div>
            </MathJaxContext>
          </div>
          <div>
            <MathJaxContext config={mathjaxConfig}>
              <div className="mt-10 w-full">
                <JoditEditor
                  value={question2Editor}
                  ref={question2EditorRef}
                  config={configForQuestion2}
                  tabIndex={3}
                  onBlur={(newContent) => setQuestion2Editor(newContent)}
                  onChange={(newContent) => setQuestion2Editor(newContent)}
                />
              </div>

              <div className="preview">
                <MathJax dynamic>{question2Editor}</MathJax>
              </div>
            </MathJaxContext>
          </div>

          <div>
            <MathJaxContext config={mathjaxConfig}>
              <div className="mt-10 w-full">
                <JoditEditor
                  value={answer2Editor}
                  ref={answer2EditorRef}
                  config={configForQuestion2Answer}
                  tabIndex={4}
                  onBlur={(newContent) => setAnswer2Editor(newContent)}
                  onChange={(newContent) => setAnswer2Editor(newContent)}
                />
              </div>

              <div className="preview">
                <MathJax dynamic>{answer2Editor}</MathJax>
              </div>
            </MathJaxContext>
          </div>

          <div>
            <MathJaxContext config={mathjaxConfig}>
              <div className="mt-10 w-full">
                <JoditEditor
                  value={question3Editor}
                  ref={question3EditorRef}
                  config={configForQuestion3}
                  tabIndex={5}
                  onBlur={(newContent) => setQuestion3Editor(newContent)}
                  onChange={(newContent) => setQuestion3Editor(newContent)}
                />
              </div>

              <div className="preview">
                <MathJax dynamic>{question3Editor}</MathJax>
              </div>
            </MathJaxContext>
          </div>
          <div>
            <MathJaxContext config={mathjaxConfig}>
              <div className="mt-10 w-full">
                <JoditEditor
                  value={answer3Editor}
                  ref={answer3EditorRef}
                  config={configForQuestion3Answer}
                  tabIndex={4}
                  onBlur={(newContent) => setAnswer3Editor(newContent)}
                  onChange={(newContent) => setAnswer3Editor(newContent)}
                />
              </div>

              <div className="preview">
                <MathJax dynamic>{answer3Editor}</MathJax>
              </div>
            </MathJaxContext>
          </div>

          <div>
            <MathJaxContext config={mathjaxConfig}>
              <div className="mt-10 w-full">
                <JoditEditor
                  value={question4Editor}
                  ref={question4EditorRef}
                  config={configForQuestion4}
                  tabIndex={7}
                  onBlur={(newContent) => setQuestion4Editor(newContent)}
                  onChange={(newContent) => setQuestion4Editor(newContent)}
                />
              </div>

              <div className="preview">
                <MathJax dynamic>{question4Editor}</MathJax>
              </div>
            </MathJaxContext>
          </div>
          <div>
            <MathJaxContext config={mathjaxConfig}>
              <div className="mt-10 w-full">
                <JoditEditor
                  value={answer4Editor}
                  ref={answer4EditorRef}
                  config={configForQuestion4Answer}
                  tabIndex={8}
                  onBlur={(newContent) => setAnswer4Editor(newContent)}
                  onChange={(newContent) => setAnswer4Editor(newContent)}
                />
              </div>

              <div className="preview">
                <MathJax dynamic>{answer4Editor}</MathJax>
              </div>
            </MathJaxContext>
          </div>

          {/* Board Exam List Functionality */}
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

          <Input
            label="School exam info"
            type="text"
            onValueChange={(setValue) => setSchoolExamInfo(setValue)}
          />

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

        <div className="flex justify-center items-center">
          <Button
            isLoading={cqQuestionLoader}
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
