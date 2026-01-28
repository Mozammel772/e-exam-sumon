

import { Input } from "@heroui/input";
import {
  Button,
  Card,
  Checkbox,
  Chip,
  cn,
  Pagination,
  Select,
  SelectItem,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { useWindowSize } from "@uidotdev/usehooks";
import "katex/dist/katex.min.css";
import { CheckIcon, Filter } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { BlockMath, InlineMath } from "react-katex";
import { useNavigate, useSearchParams } from "react-router-dom";
import sanitizeHtml from "sanitize-html";
import Swal from "sweetalert2";
import ClearIcon from "../../../../assets/ClearIcon";
import EyeOpenIcon from "../../../../assets/EyeOpenIcon";
import IdeaIcon from "../../../../assets/IdeaIcon";
import ReportIcon from "../../../../assets/ReportIcon";
import SaveIcon from "../../../../assets/SaveIcon";
import SearchIcon from "../../../../assets/SearchIcon";
import { useGetAllDesireQuestionsQuery } from "../../../../redux/api/slices/chapterSlice";
import {
  useDemoQuestionsUpdateMutation,
  useGetExamSetsAnUserQuery,
  useGetExamSetWithCredentialsQuery,
  useQuestionsUpdateMutation,
} from "../../../../redux/api/slices/examSetSlice";
import { useGetAllExamsQuery } from "../../../../redux/api/slices/examSlice";
import ExplainModal from "../questionView/explainModal/ExplainModal";

const toBanglaNumber = (number) => {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return number?.toString().replace(/\d/g, (digit) => banglaDigits[digit]);
};

export const searchType = [
  { key: "অনুশীলনী", label: "অনুশীলনী" },
  { key: "চিত্রযুক্ত", label: "চিত্রযুক্ত" },
  { key: "বহুপদী", label: "বহুপদী" },
  { key: "অভিন্ন তথ্যভিত্তিক", label: "অভিন্ন তথ্যভিত্তিক" },
  { key: "রিপিটেড স্কুল", label: "রিপিটেড বোর্ড" },
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

export const years = [
  { key: "২০২৬", label: "২০২৬" },
  { key: "২০২৫", label: "২০২৫" },
  { key: "২০২৪", label: "২০২৪" },
  { key: "২০২৩", label: "২০২৩" },
  { key: "২০২২", label: "২০২২" },
  { key: "২০২১", label: "২০২১" },
  { key: "২০২০", label: "২০২০" },
  { key: "২০১৯", label: "২০১৯" },
  { key: "২০১৮", label: "২০১৮" },
  { key: "২০১৭", label: "২০১৭" },
  { key: "২০১৬", label: "২০১৬" },
  { key: "২০১৫", label: "২০১৫" },
  { key: "২০১৪", label: "২০১৪" },
  { key: "২০১৩", label: "২০১৩" },
  { key: "২০১২", label: "২০১২" },
];

export const allBoard = [
  { key: "ঢাকা বোর্ড", label: "ঢাকা বোর্ড" },
  { key: "চট্টগ্রাম বোর্ড", label: "চট্টগ্রাম বোর্ড" },
  { key: "কুমিল্লা বোর্ড", label: "কুমিল্লা বোর্ড" },
  { key: "রাজশাহী বোর্ড", label: "রাজশাহী বোর্ড" },
  { key: "খুলনা বোর্ড", label: "খুলনা বোর্ড" },
  { key: "ময়মনসিংহ বোর্ড", label: "ময়মনসিংহ বোর্ড" },
  { key: "দিনাজপুর বোর্ড", label: "দিনাজপুর বোর্ড" },
  { key: "বরিশাল বোর্ড", label: "বরিশাল বোর্ড" },
  { key: "সিলেট বোর্ড", label: "সিলেট বোর্ড" },
  { key: "যশোর বোর্ড", label: "যশোর বোর্ড" },
];

// Question types for filtering
export const questionTypes = [
  { key: "MCQ", label: "বহুনির্বাচনী" },
  { key: "CQ", label: "সৃজনশীল" },
  { key: "short", label: "সংক্ষিপ্ত প্রশ্ন" },
];


// LaTeX rendering component
// const stripSpanTags = (text) =>
//   text.replace(/<\/?span[^>]*>/g, "");

// const LatexRenderer = ({ content, displayMode = false }) => {
//   if (!content) return null;

//   try {
//     const formattedContent = stripSpanTags(
//       content
//         .replace(/\biv\./g, "\niv.")
//         .replace(/\biii\./g, "\niii.")
//         .replace(/\bii\./g, "\nii.")
//         .replace(/\bi\./g, "\ni.")
//     );

//     const latexRegex =
//       /\\\[(.*?)\\\]|\\\((.*?)\\\)|\$(.*?)\$|`(.*?)`/g;

//     const hasLatex = latexRegex.test(formattedContent);

//     const sanitizedContent = sanitizeHtml(formattedContent, {
//       allowedTags: [
//         "img",
//         "table",
//         "thead",
//         "tbody",
//         "tfoot",
//         "tr",
//         "th",
//         "td",
//         "caption",
//         "b",
//         "i",
//         "u",
//         "strong",
//         "em",
//       ],
//       allowedAttributes: {
//         img: ["src", "alt", "width", "height", "style"],
//         table: ["border", "cellpadding", "cellspacing", "width", "style"],
//         th: ["rowspan", "colspan", "align", "style"],
//         td: ["rowspan", "colspan", "align", "style"],
//         "*": ["style"],
//       },
//     });

//     if (!hasLatex) {
//       return (
//         <div className="leading-relaxed whitespace-pre-line">
//           {sanitizedContent}
//         </div>
//       );
//     }

//     const parts = sanitizedContent.split(latexRegex);

//     return (
//       <div className="leading-relaxed whitespace-pre-line">
//         {parts.map((part, index) =>
//           index % 5 !== 0 && part ? (
//             displayMode ? (
//               <BlockMath key={index} math={part} />
//             ) : (
//               <InlineMath key={index} math={part} />
//             )
//           ) : (
//             <span key={index}>{part}</span>
//           )
//         )}
//       </div>
//     );
//   } catch (error) {
//     console.error(error);
//     return <div>{content}</div>;
//   }
// };




const unwrapStrongTags = (html) =>
  html
   .replace(/<strong[^>]*>/gi, "")
    .replace(/<\/strong>/gi, "")
    .replace(/<b[^>]*>/gi, "")
    .replace(/<\/b>/gi, "")
    .replace(/<\/?span[^>]*>/gi, "");

const LatexRenderer = ({ content, displayMode = false }) => {
  if (!content) return null;

  try {
    const formattedContent = unwrapStrongTags(
      content
          .replace(/\biv\./g, "\niv.")
    .replace(/\biii\./g, "\niii.")
    .replace(/\bii\./g, "\nii.")
    .replace(/\bi\./g, "\ni.")
    );

    const latexRegex =
      /\\\[(.*?)\\\]|\\\((.*?)\\\)|\$(.*?)\$|`(.*?)`/g;

    const hasLatex = latexRegex.test(formattedContent);

    const sanitizedContent = sanitizeHtml(formattedContent, {
      allowedTags: [
        "img",
        "table",
        "thead",
        "tbody",
        "tfoot",
        "tr",
        "th",
        "td",
        "caption",
        "b",
        "i",
        "u",
        "em",
      ],
      allowedAttributes: {
        img: ["src", "alt", "width", "height", "style"],
        table: ["border", "cellpadding", "cellspacing", "width", "style"],
        th: ["rowspan", "colspan", "align", "style"],
        td: ["rowspan", "colspan", "align", "style"],
        "*": ["style"],
      },
    });

    if (!hasLatex) {
      return (
        <div className="leading-relaxed whitespace-pre-line">
          {sanitizedContent}
        </div>
      );
    }

    const parts = sanitizedContent.split(latexRegex);

    return (
      <div className="leading-relaxed whitespace-pre-line">
        {parts.map((part, index) =>
          index % 5 !== 0 && part ? (
            displayMode ? (
              <BlockMath key={index} math={part} />
            ) : (
              <InlineMath key={index} math={part} />
            )
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </div>
    );
  } catch (err) {
    console.error(err);
    return <div>{content}</div>;
  }
};













// const LatexRenderer = ({ content, displayMode = false }) => {
//   if (!content) return null;

//   try {
//     // Extract LaTeX content from HTML if needed
//     const latexMatch = content.match(
//       /\\\[(.*?)\\\]|\\\((.*?)\\\)|\$(.*?)\$|`(.*?)`/,
//     );

//     if (latexMatch) {
//       const latexContent =
//         latexMatch[1] || latexMatch[2] || latexMatch[3] || latexMatch[4];
//       if (displayMode) {
//         return <BlockMath math={latexContent} />;
//       } else {
//         return <InlineMath math={latexContent} />;
//       }
//     }

//     // If no LaTeX found, return sanitized HTML
//     const sanitizedContent = sanitizeHtml(content, {
//       allowedTags: [
//         "img",
//         "br",
//         "table",
//         "thead",
//         "tbody",
//         "tfoot",
//         "tr",
//         "th",
//         "td",
//         "caption",
//       ],
//       allowedAttributes: {
//         img: ["src", "alt", "width", "height", "style"],
//         table: ["border", "cellpadding", "cellspacing", "width", "style"],
//         th: ["rowspan", "colspan", "align", "style"],
//         td: ["rowspan", "colspan", "align", "style"],
//       },
//     });

//     return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
//   } catch (error) {
//     console.error("LaTeX rendering error:", error);
//     return <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />;
//   }
// };



export default function ShortQusView() {
  const email = localStorage?.getItem("email");
  const size = useWindowSize();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  // Determine sidebar visibility based on screen size
  const shouldShowSidebar = size?.width > 600;
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedBoards, setSelectedBoards] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedSchools, setSelectedSchools] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const { isOpen: isOpens, onOpen, onOpenChange } = useDisclosure();
  const [questionAnswer, setQuestionAnswer] = useState("");
  const [questionExplanation, setQuestionExplanation] = useState("");

  // Question type filter state
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState([]);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage, setQuestionsPerPage] = useState(20);
  // Chapter filter state - SHOW ONLY SELECTED CHAPTERS
  const [selectedChaptersFilter, setSelectedChaptersFilter] = useState([]);

  const pathParts = location.pathname.split("/");
  const examSetId = pathParts[3];
  const questionType = pathParts[2];
  const [searchParams] = useSearchParams();
  const qt = searchParams.get("qt");

  // ==============================================
  //               STATE MANAGEMENT
  // ==============================================
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedExamSets, setSelectedExamSets] = useState([]);
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [foundIds, setFoundIds] = useState([]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        size?.width <= 600
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen, size]);

  // ==============================================
  //                 API HOOKS
  // ==============================================
  const { data: getUserCredentialsProfile } = useGetExamSetWithCredentialsQuery(
    { email, examSetId },
  );

  const [questionsUpdate] = useQuestionsUpdateMutation();
  const [demoQuestionsUpdate] = useDemoQuestionsUpdateMutation();
  const { data: getAnUserExamSets, isLoading: anUserExamSetLoader } =
    useGetExamSetsAnUserQuery(email);

  const { data: getAllExamData } = useGetAllExamsQuery();
  const filterExamType = getAllExamData?.filter(
    (exam) => exam?._id === getUserCredentialsProfile?.examSet?.examCategory,
  );

  const { data: getDesireQuestionsData } = useGetAllDesireQuestionsQuery({
    email,
    subjectClassName: getUserCredentialsProfile?.examSet?.className,
    subjectName: getUserCredentialsProfile?.examSet?.subjectName,
    examType: filterExamType?.[0]?.examIdentifier || "",
    chapterId: Array.isArray(getUserCredentialsProfile?.examSet?.chapterId)
      ? getUserCredentialsProfile?.examSet?.chapterId?.flatMap((item) =>
          item.split(","),
        )
      : [],
  });

  // ==============================================
  //               CHAPTER FILTERING LOGIC - UPDATED
  // ==============================================

  // Get all available chapters for filter dropdown
  const availableChapters = useMemo(() => {
    if (!getDesireQuestionsData?.chapters) return [];

    return getDesireQuestionsData.chapters.map((chapter) => ({
      key: chapter._id,
      label: chapter.chapterName,
      value: chapter._id,
    }));
  }, [getDesireQuestionsData]);

  // Filter chapters - SHOW ONLY SELECTED CHAPTERS, HIDE OTHERS
  const filteredChaptersData = useMemo(() => {
    if (!getDesireQuestionsData?.chapters) return [];

    // If no chapters are selected, show ALL chapters
    if (selectedChaptersFilter.length === 0) {
      return getDesireQuestionsData.chapters;
    }

    // If chapters are selected, show ONLY those chapters
    return getDesireQuestionsData.chapters.filter((chapter) =>
      selectedChaptersFilter.includes(chapter._id),
    );
  }, [getDesireQuestionsData, selectedChaptersFilter]);

  // Handle chapter filter toggle
  const handleChapterFilterToggle = (chapterId) => {
    setSelectedChaptersFilter((prev) => {
      if (prev.includes(chapterId)) {
        return prev.filter((id) => id !== chapterId);
      } else {
        return [...prev, chapterId];
      }
    });
  };

  // Select all chapters
  const handleSelectAllChapters = () => {
    if (selectedChaptersFilter.length === availableChapters.length) {
      setSelectedChaptersFilter([]);
    } else {
      setSelectedChaptersFilter(availableChapters.map((chap) => chap.key));
    }
  };

  const filteredChapters = useMemo(() => {
    if (!filteredChaptersData) {
      return [];
    }

    const norm = (s) => (s ?? "").toString().trim().toLowerCase();

    return filteredChaptersData
      ?.map((chapter) => {
        const chapterQuestions = chapter.questions || [];

        const filteredQuestions =
          qt === "demo"
            ? chapterQuestions
            : chapterQuestions?.filter((question) => {
                const isInSelectedExamSet = selectedExamSets?.some((set) =>
                  set.questionIds.includes(question._id),
                );

                // Question type filter
                const questionTypeMatch =
                  selectedQuestionTypes.length === 0 ||
                  selectedQuestionTypes.includes(question.type);

                const typeMatch =
                  selectedTypes.length === 0 ||
                  selectedTypes.some((type) => {
                    const normalizedType = type.toLowerCase();
                    return (
                      question.type?.toLowerCase() === normalizedType ||
                      question.searchType?.some(
                        (st) => st.toLowerCase() === normalizedType,
                      )
                    );
                  });

                const levelMatch =
                  selectedLevels.length === 0 ||
                  selectedLevels.includes(question.questionLevel);

                const matchesSearch = [
                  question.type,
                  question.questionName,
                  question.option1,
                  question.option2,
                  question.option3,
                  question.option4,
                  question.boardExamList,
                  question.schoolExamInfo,
                  question.correctAnswer,
                ].some((field) =>
                  field?.toLowerCase?.().includes(searchKeyword?.toLowerCase()),
                );

                const schoolMatch =
                  selectedSchools.length === 0 ||
                  selectedSchools.some((selectedSchool) => {
                    const questionSchool = question.schoolExamInfo
                      ?.trim()
                      .replace(/\s+/g, " ");
                    return questionSchool === selectedSchool;
                  });

                const boardYearMatches = (question.boardExamList || []).some(
                  (entry) => {
                    const [board, year] = entry
                      .split("-")
                      .map((str) => str?.trim());
                    const boardOk =
                      selectedBoards.length === 0 ||
                      selectedBoards.includes(board);
                    const yearOk =
                      selectedYears.length === 0 ||
                      selectedYears.includes(year);
                    return boardOk && yearOk;
                  },
                );

                const shouldExcludeByTopic =
                  selectedTopics.length > 0 &&
                  question.topic &&
                  selectedTopics.some((t) => norm(t) === norm(question.topic));

                return (
                  !isInSelectedExamSet &&
                  questionTypeMatch && // Apply question type filter
                  typeMatch &&
                  levelMatch &&
                  matchesSearch &&
                  schoolMatch &&
                  boardYearMatches &&
                  !shouldExcludeByTopic
                );
              });

        return {
          ...chapter,
          questions: selectedChapters.includes(chapter._id.toString())
            ? []
            : filteredQuestions || [],
        };
      })
      ?.filter(
        (chapter) =>
          (chapter.questions?.length || 0) > 0 ||
          selectedChapters.includes(chapter._id.toString()),
      );
  }, [
    qt,
    selectedSchools,
    selectedTypes,
    selectedLevels,
    searchKeyword,
    selectedChapters,
    selectedExamSets,
    filteredChaptersData,
    selectedBoards,
    selectedYears,
    selectedTopics,
    selectedQuestionTypes, // Add dependency
  ]);

  // ==============================================
  //               PAGINATION LOGIC
  // ==============================================
  const allQuestions = useMemo(() => {
    if (!filteredChapters) return [];

    return filteredChapters.flatMap(
      (chapter) =>
        chapter.questions?.map((question) => ({
          ...question,
          chapterId: chapter._id,
          chapterName: chapter.chapterName,
        })) || [],
    );
  }, [filteredChapters]);

  // Calculate pagination
  const totalQuestions = allQuestions.length;
  const totalPages = Math.ceil(totalQuestions / questionsPerPage);

  // Get current questions for the page
  const currentQuestions = useMemo(() => {
    const startIndex = (currentPage - 1) * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    return allQuestions.slice(startIndex, endIndex);
  }, [allQuestions, currentPage, questionsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchKeyword,
    selectedTypes,
    selectedLevels,
    selectedBoards,
    selectedYears,
    selectedSchools,
    selectedTopics,
    selectedChaptersFilter,
    selectedQuestionTypes, // Reset when question types change
  ]);

  // ==============================================
  //                 EVENT HANDLERS
  // ==============================================
  const handleTypeChange = (typeKey) => {
    setSelectedTypes((prev) =>
      prev.includes(typeKey)
        ? prev.filter((t) => t !== typeKey)
        : [...prev, typeKey],
    );
  };

  // Handle question type filter change
  const handleQuestionTypeChange = (typeKey) => {
    setSelectedQuestionTypes((prev) =>
      prev.includes(typeKey)
        ? prev.filter((t) => t !== typeKey)
        : [...prev, typeKey],
    );
  };

  const allTopics = useMemo(() => {
    if (!filteredChaptersData) return [];

    const topics = filteredChaptersData.flatMap((chapter) =>
      chapter.questions?.map((q) => {
        if (q.type === "CQ") {
          return q.cqDetails?.topic?.trim();
        } else if (q.type === "short") {
          return q.shortQusDetails?.shortQuestionTopic?.trim();
        } else if (q.type === "MCQ") {
          return q.topic?.trim();
        }
        return null;
      }),
    );

    return [...new Set(topics.filter(Boolean))];
  }, [filteredChaptersData]);

  const handleExamSetToggle = (examSetId, questionIds) => {
    setSelectedExamSets((prev) =>
      prev.some((set) => set.examSetId === examSetId)
        ? prev.filter((set) => set.examSetId !== examSetId)
        : [...prev, { examSetId, questionIds }],
    );
  };

  const handleChapterToggle = (chapterId) => {
    setSelectedChapters((prev) => {
      return prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId];
    });
  };

  useEffect(() => {
    if (!filteredChapters) return;

    const allFound = filteredChapters?.flatMap((chapter) => {
      const displayQuestions = chapter.questions
        ?.filter((question) => {
          return (
            question?.type === "short" ||
            question?.type === "CQ" ||
            question?.type === "MCQ"
          );
        })
        ?.filter((question) => {
          if (selectedTopics.length === 0) return true;

          if (question.type === "CQ") {
            const topic = question.cqDetails?.topic?.trim();
            return topic && selectedTopics.includes(topic);
          } else if (question.type === "short") {
            const topic = question.shortQusDetails?.shortQuestionTopic?.trim();
            return topic && selectedTopics.includes(topic);
          } else if (question.type === "MCQ") {
            const topic = question.topic?.trim();
            return topic && selectedTopics.includes(topic);
          }
          return false;
        })
        ?.filter((question) => {
          if (selectedTypes.length === 0) return true;
          return selectedTypes.every((type) =>
            question.searchType?.includes(type),
          );
        })
        ?.filter((question) => {
          if (selectedLevels.length === 0) return true;
          return selectedLevels.includes(question.questionLevel);
        });

      return selectedOptions.filter((id) =>
        displayQuestions?.some((q) => q._id === id),
      );
    });

    const flattenedFound = allFound.flat();
    const uniqueFound = [...new Set(flattenedFound)];
    setFoundIds(uniqueFound);
  }, [
    filteredChapters,
    selectedTopics,
    selectedTypes,
    selectedLevels,
    selectedOptions,
  ]);

  const SCHOOL_OPTIONS = useMemo(() => {
    const schools = new Set();

    filteredChaptersData?.forEach((chapter) => {
      chapter.questions?.forEach((question) => {
        if (question.schoolExamInfo?.trim()) {
          const normalizedSchool = question.schoolExamInfo
            .trim()
            .replace(/\s+/g, " ");
          schools.add(normalizedSchool);
        }
      });
    });

    return Array.from(schools)?.map((school) => ({
      key: school,
      label: school,
    }));
  }, [filteredChaptersData]);

  const handleOptionClick = (questionId) => {
    setSelectedOptions((prev) => {
      const stringId = questionId.toString();

      return prev.some((id) => id.toString() === stringId)
        ? prev?.filter((id) => id.toString() !== stringId)
        : [...prev, questionId];
    });
  };

  useEffect(() => {
    if (getUserCredentialsProfile?.examSet?.questionIds) {
      setSelectedOptions(getUserCredentialsProfile.examSet.questionIds);
    }
  }, [getUserCredentialsProfile?.examSet?.questionIds]);

  const handleMakeQuestion = async () => {
    if (selectedOptions?.length === 0) {
      Swal.fire({
        title: "আপনি কোনো অপশন সিলেক্ট করেননি",
        icon: "error",
        showCloseButton: true,
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    if (selectedOptions?.length > getUserCredentialsProfile?.examSet?.marks) {
      Swal.fire({
        title:
          "নির্ধারিত প্রশ্নের সীমা অতিক্রম হয়েছে। দয়া করে কিছু প্রশ্ন কমিয়ে নিন।",
        icon: "error",
        showCloseButton: true,
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    try {
      let res;

      if (qt === "demo") {
        res = await demoQuestionsUpdate({
          data: { questionIds: selectedOptions },
          examSetId,
        });
      } else {
        res = await questionsUpdate({
          data: { questionIds: selectedOptions },
          examSetId,
        });
      }

      if (res?.data) {
        Swal.fire({
          title: "আপনার বাছাইকৃত প্রশ্ন গুলো সেভ করা হয়েছে",
          icon: "success",
          showCloseButton: true,
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          title: res?.error?.data?.message || "একটি অজানা সমস্যা হয়েছে",
          icon: "error",
          showCloseButton: true,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      Swal.fire({
        title: error?.message || "একটি নেটওয়ার্ক সমস্যা হয়েছে",
        icon: "error",
        showCloseButton: true,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleQuestionSetPreview = () => {
    if (questionType === "view-short") {
      navigate(`/user/short-question-paper/${examSetId}`);
    } else {
      navigate(`/user/question-paper/${examSetId}`);
    }
  };

  return (
    <div
      className={` ${
        size?.width <= 600
          ? "solaimanlipi flex flex-col md:flex-row  mt-[85px] p-1 w-[380px]"
          : "solaimanlipi flex flex-col md:flex-row ms-[255px] mt-[85px] p-5 gap-5"
      }`}
    >
      <Card className="flex-1 max-h-[100vh] overflow-y-auto relative p-2 md:p-4">
        <div className="sticky top-0 z-20 bg-white p-3 flex justify-between items-center shadow-md rounded-xl">
          <div className="md:hidden">
            <Button
              onPress={() => setIsOpen(true)}
              className="bg-[#024645] text-white p-2 rounded-full shadow-lg mb-3 "
              size="icon"
              startContent={<Filter size={18} />}
            >
              {/* <p className="ms-2 text-xs">Filter</p> */}
            </Button>
          </div>

          <div>
            <Chip className="bg-[#024645] text-white" variant="shadow">
              <h3>
                Selected: {selectedOptions?.length}/
                {getUserCredentialsProfile?.examSet?.marks}
              </h3>
            </Chip>
          </div>

          <div>
            <Button
              size="sm"
              onPress={handleMakeQuestion}
              isDisabled={selectedOptions?.length === 0}
              startContent={<SaveIcon />}
              isLoading={anUserExamSetLoader}
              className="bg-[#024645] text-white"
            >
              Save
            </Button>
          </div>

          <div>
            <Tooltip
              className="solaimanlipi"
              content={
                <p className="text-base md:text-xl">
                  আপনার সংগ্রহকৃত প্রশ্নগুলো দেখুন
                </p>
              }
            >
              <Button
                size="sm"
                onPress={handleQuestionSetPreview}
                className="bg-[#024645]"
                startContent={<EyeOpenIcon size="20px" color="white" />}
              >
                <p className=" text-white">Next</p>
              </Button>
            </Tooltip>
          </div>
        </div>

        {/* Chapter Filter Info */}
        {selectedChaptersFilter.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800 font-semibold">
              দেখানো হচ্ছে: {selectedChaptersFilter.length} টি অধ্যায় -{" "}
              {availableChapters
                .filter((chap) => selectedChaptersFilter.includes(chap.key))
                .map((chap) => chap.label)
                .join(", ")}
            </p>
          </div>
        )}

        {/* Question Type Filter Info */}
        {selectedQuestionTypes.length > 0 && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-green-800 font-semibold">
              প্রশ্নের ধরন: {selectedQuestionTypes.length} টি -{" "}
              {questionTypes
                .filter((type) => selectedQuestionTypes.includes(type.key))
                .map((type) => type.label)
                .join(", ")}
            </p>
          </div>
        )}

        {/* Pagination Controls - Top */}
        {/* <div className="flex justify-between items-center mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              মোট প্রশ্ন: {totalQuestions}
            </span>
            <Select
              size="sm"
              className="w-32"
              selectedKeys={[questionsPerPage.toString()]}
              onChange={(e) => {
                setQuestionsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <SelectItem key="10">১০ প্রতি পৃষ্ঠায়</SelectItem>
              <SelectItem key="20">২০ প্রতি পৃষ্ঠায়</SelectItem>
              <SelectItem key="50">৫০ প্রতি পৃষ্ঠায়</SelectItem>
            </Select>
          </div>

          <Pagination
            total={totalPages}
            page={currentPage}
            onChange={setCurrentPage}
            size="sm"
            color="primary"
            showControls
          />
        </div> */}

        <p className="mt-3 mb-2 text-2xl font-bold">
          টাইটেল: {getUserCredentialsProfile?.examSet?.title}
        </p>

        <div className="bg-gray-200 ps-3 pe-3 rounded-lg">
          <div className="bg-gray-200 rounded-lg">
            <div className="flex flex-col overflow-hidden">
              {currentQuestions.length === 0 && (
                <div className="flex justify-center items-center py-20">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#024645] mb-4"></div>
                    <p className="text-base md:text-xl text-gray-600">
                      কোনো প্রশ্ন পাওয়া যায়নি
                    </p>
                    <p className="text-sm text-gray-500">
                      ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন
                    </p>
                  </div>
                </div>
              )}

              {currentQuestions.map((question, index) => {
                const isSelected = selectedOptions.some(
                  (id) => id.toString() === question?._id?.toString(),
                );

                return (
                  <div
                    key={question._id}
                    className={`mb-4 relative p-2 md:p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 overflow-hidden ${
                      isSelected
                        ? "border-green-600 bg-green-50 shadow-lg"
                        : "border-gray-200 bg-white shadow-md hover:shadow-lg"
                    }`}
                    onClick={() => handleOptionClick(question?._id)}
                  >
                    {/* Question Number and Main Content */}
                    <div className="flex items-start ">
                      {/* Question Number Circle */}
                      <div className="  flex items-center justify-center text-black font-medium text-base md:text-xl ">
                        {toBanglaNumber(
                          (currentPage - 1) * questionsPerPage + index + 1,
                        )}
                        .
                      </div>

                      <div className="bg-gray-100 flex items-center justify-center w-full">
                        <div className="bg-white rounded-lg ps-1 pe-1 md:ps-3 md:pe-3  w-full">
                          {/* Header Section */}
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center  pb-1 md:pb-2">
                            <div className="flex flex-col mb-4 md:mb-0">
                              <div className="text-gray-700 leading-relaxed text-base md:text-xl font-medium">
                                <LatexRenderer
                                  content={
                                    question.type === "CQ"
                                      ? question.cqDetails?.mainQuestion
                                      : question.type === "short"
                                        ? question.shortQusDetails
                                            ?.shortQuestion
                                        : question.questionName
                                  }
                                />
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {question?.boardExamList?.map((board) => (
                                <p
                                  key={board}
                                  className="text-gray-600 text-xs  md:text-base font-medium"
                                >
                                  {board}
                                </p>
                              ))}
                              {question?.searchType?.map((search) => (
                                <Chip
                                  key={search}
                                  color="secondary"
                                  variant="bordered"
                                  classNames={{
                                    base: "!p-0 !min-h-0 border-[0.5px] sm:border",
                                    content:
                                      "px-1 py-[1px] sm:px-2 text-[10px] sm:text-sm font-medium text-gray-600 leading-none",
                                  }}
                                >
                                  {search}
                                </Chip>
                              ))}
                            </div>
                          </div>

                          {/* Render different content based on question type */}
                          {question.type === "CQ" && (
                            <div className="space-y-4 mt-2 md:mt-4">
                              {/* Question ক */}
                              {question.cqDetails?.question1 && (
                                <div className="text-gray-800">
                                  <h3 className="text-base md:text-xl mb-2 flex flex-row items-center gap-1">
                                    ক.{" "}
                                    <span className="text-gray-700 leading-relaxed">
                                      <LatexRenderer
                                        content={question.cqDetails.question1}
                                      />
                                    </span>
                                  </h3>
                                </div>
                              )}

                              {/* Question খ */}
                              {question.cqDetails?.question2 && (
                                <div className="text-gray-800">
                                  <h3 className="text-base md:text-xl mb-2 flex flex-row items-center gap-1">
                                    খ.{" "}
                                    <span className="text-gray-700 leading-relaxed">
                                      <LatexRenderer
                                        content={question.cqDetails.question2}
                                      />
                                    </span>
                                  </h3>
                                </div>
                              )}

                              {/* Question গ */}
                              {question.cqDetails?.question3 && (
                                <div className="text-gray-800">
                                  <h3 className="text-base md:text-xl mb-2 flex flex-row items-center gap-1">
                                    গ.{" "}
                                    <span className="text-gray-700 leading-relaxed">
                                      <LatexRenderer
                                        content={question.cqDetails.question3}
                                      />
                                    </span>
                                  </h3>
                                </div>
                              )}

                              {/* Question ঘ */}
                              {question.cqDetails?.question4 && (
                                <div className="text-gray-800">
                                  <h3 className="text-base md:text-xl mb-2 flex flex-row items-center gap-1">
                                    ঘ.{" "}
                                    <span className="text-gray-700 leading-relaxed">
                                      <LatexRenderer
                                        content={question.cqDetails.question4}
                                      />
                                    </span>
                                  </h3>
                                </div>
                              )}
                            </div>
                          )}

                          {question.type === "short" && (
                            <div className="mt-3">
                              <Chip
                                color="warning"
                                variant="bordered"
                                className="text-base md:text-xl"
                              >
                                সংক্ষিপ্ত প্রশ্ন
                              </Chip>
                              {question.shortQusDetails
                                ?.shortQuestionAnswer && (
                                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                                  <strong>উত্তর: </strong>
                                  <LatexRenderer
                                    content={
                                      question.shortQusDetails
                                        .shortQuestionAnswer
                                    }
                                  />
                                </div>
                              )}
                            </div>
                          )}

                          {question.type === "MCQ" && (
                            <div className="mt-4">
                              <div className="grid grid-cols-2  gap-2 md:gap-4">
                                {question.option1 && (
                                  <p className="p-2 md:p-3 border rounded-md bg-gray-50 flex flex-row items-center">
                                    <strong className="me-2">ক. </strong>
                                    <span className="text-gray-700 leading-relaxed">
                                      <LatexRenderer
                                        content={question.option1}
                                      />
                                    </span>
                                  </p>
                                )}
                                {question.option2 && (
                                  <div className="p-3 border rounded-md bg-gray-50 flex flex-row items-center">
                                    <strong className="me-2">খ. </strong>
                                    <span className="text-gray-700 leading-relaxed">
                                      <LatexRenderer
                                        content={question.option2}
                                      />
                                    </span>
                                  </div>
                                )}
                                {question.option3 && (
                                  <div className="p-3 border rounded-md bg-gray-50 flex flex-row items-center">
                                    <strong className="me-2">গ. </strong>
                                    <span className="text-gray-700 leading-relaxed">
                                      <LatexRenderer
                                        content={question.option3}
                                      />
                                    </span>
                                  </div>
                                )}
                                {question.option4 && (
                                  <div className="p-3 border rounded-md bg-gray-50 flex flex-row items-center">
                                    <strong className="me-2">ঘ. </strong>
                                    <span className="text-gray-700 leading-relaxed">
                                      <LatexRenderer
                                        content={question.option4}
                                      />
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="mt-6 flex flex-wrap gap-3 justify-between items-center solaimanlipi">
                                <div className="flex flex-wrap gap-2">
                                  {/* Board Exam Info */}

                                  {/* Explanation Button */}
                                  <Tooltip
                                    content="প্রশ্নের ব্যাখ্যা দেখতে ক্লিক করুন "
                                    showArrow={true}
                                  >
                                    <Button
                                      onPress={onOpen}
                                      startContent={
                                        <IdeaIcon size="18px" color="#000000" />
                                      }
                                      size="sm"
                                      className="px-4 py-2 rounded-full text-black text-base md:text-xl font-medium shadow-md hover:shadow-lg transition-all"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setQuestionExplanation(
                                          question?.explanation,
                                        );
                                        setQuestionAnswer(
                                          question?.correctAnswer,
                                        );
                                      }}
                                    >
                                      ব্যাখ্যা
                                    </Button>
                                  </Tooltip>

                                  {/* Report Button */}
                                  <Tooltip
                                    content="প্রশ্নে ভুল থাকলে রিপোর্ট করুন"
                                    showArrow={true}
                                  >
                                    <Button
                                      startContent={
                                        <ReportIcon
                                          size="20px"
                                          color="#ffffff"
                                        />
                                      }
                                      size="sm"
                                      className="px-4 py-2 rounded-full bg-red-600 text-white text-base md:text-xl font-medium shadow-md hover:bg-red-700 transition-all"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      রিপোর্ট
                                    </Button>
                                  </Tooltip>
                                </div>

                                {/* Search Type Tags */}
                                <div className="flex flex-wrap gap-1">
                                  {question?.searchType?.map(
                                    (type, typeIndex) => (
                                      <Chip
                                        key={`${question._id}-type-${typeIndex}`}
                                        color="warning"
                                        variant="flat"
                                        size="sm"
                                        className="text-xs font-medium"
                                      >
                                        {type}
                                      </Chip>
                                    ),
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Chapter Name */}
                          {/* <div className="mb-3">
                            <Chip color="primary" variant="flat">
                              <span className="font-semibold">
                                অধ্যায়: {question.chapterName}
                              </span>
                            </Chip>
                          </div> */}

                          {/* Question Type Badge */}
                          {/* <div className="mb-3">
                            <Chip
                              color={
                                question.type === "MCQ"
                                  ? "success"
                                  : question.type === "CQ"
                                  ? "warning"
                                  : "secondary"
                              }
                              variant="solid"
                            >
                              <span className="font-semibold">
                                {question.type === "MCQ"
                                  ? "বহুনির্বাচনী"
                                  : question.type === "CQ"
                                  ? "সৃজনশীল"
                                  : "সংক্ষিপ্ত প্রশ্ন"}
                              </span>
                            </Chip>
                          </div> */}
                        </div>
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckIcon size={16} color="white" />
                      </div>
                    )}
                  </div>
                );
              })}
              <ExplainModal
                isOpen={isOpens}
                onOpenChange={onOpenChange}
                questionExplanation={questionExplanation}
                questionAnswer={questionAnswer}
              />
            </div>
          </div>
        </div>

        {/* Pagination Controls - Bottom */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 mb-4">
            <Pagination
              total={totalPages}
              page={currentPage}
              onChange={setCurrentPage}
              color="primary"
              showControls
            />
          </div>
        )}
      </Card>

      {/* Right Sidebar */}
      {(size?.width <= 600 && isOpen) ||
      (size?.width > 600 && shouldShowSidebar) ? (
        <>
          {/* Overlay for mobile only */}
          {size?.width <= 600 && (
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setIsOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div
            ref={sidebarRef}
            className={`h-screen w-[280px] md:w-[350px] bg-white shadow-lg z-50 transform transition-transform duration-500 ease-in-out
        ${
          size?.width <= 600
            ? "translate-x-0 fixed top-0 right-0"
            : "translate-x-0"
        }`}
          >
            {/* Close button for mobile only */}
            {size?.width <= 600 && (
              // <Button
              //   onPress={() => setIsOpen(false)}
              //   isIconOnly
              //   className="absolute top-2 right-2 text-gray-600 hover:text-black"
              // >
              //   ✕
              // </Button>
               <div className="flex justify-between items-center p-4 border-b bg-[#024645] text-white">
                            <h2 className="text-xl font-bold">ফিল্টার</h2>
                            <Button
                              onPress={() => setIsOpen(false)}
                              className="bg-white text-[#024645] rounded-full min-w-8 h-8 p-0"
                            >
                              ✕
                            </Button>
                          </div>
            )}

            {/* Single content section - same for both mobile and desktop */}
            <div className="p-5 overflow-y-auto h-full">
              <h2 className="text-xl font-bold mb-4">
                অ্যাডভান্স ফিল্টার মেনু
              </h2>

              <div className="mt-5 flex flex-row gap-2">
                <Input
                  size="lg"
                  radius="sm"
                  className="text-3xl w-full"
                  placeholder="সার্চ করুন"
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <Button
                  onPress={() => setSearchKeyword("")}
                  className="bg-[#024645]"
                  radius="sm"
                  isIconOnly
                  size="lg"
                >
                  {searchKeyword ? (
                    <ClearIcon size="20px" color="#ffffff" />
                  ) : (
                    <SearchIcon className="text-xl" />
                  )}
                </Button>
              </div>

              <div className="mt-6 mb-4 border-1 border-[#024645] rounded-lg p-5 bg-[#dbfce7] text-black">
                <p className="text-3xl font-bold text-center">
                  স্মার্ট ফিল্টার
                </p>
                <p className="text-center text-xl mt-2">
                  পৃথক প্রশ্ন সৃষ্টি করুন। পূর্বের প্রশ্ন বাদ দিয়ে নতুন প্রশ্ন
                  তৈরি করুন।
                </p>
                {getAnUserExamSets?.examSets
                  ?.slice(-3)
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 3)
                  ?.map((examSet) => (
                    <div key={examSet?._id} className="mt-3 mb-3">
                      <Checkbox
                        lineThrough
                        className="mt-3 mb-3"
                        color="success"
                        classNames={{
                          base: cn(
                            "inline-flex w-full max-w-md bg-content1",
                            "hover:bg-content2 items-center justify-start",
                            "cursor-pointer rounded-lg gap-2 p-4 border-1 border-transparent",
                            "data-[selected=true]:border-[#024645]",
                          ),
                          label: "w-full",
                        }}
                        isSelected={selectedExamSets.some(
                          (set) => set.examSetId === examSet._id,
                        )}
                        onValueChange={() =>
                          handleExamSetToggle(examSet._id, examSet.questionIds)
                        }
                      >
                        <div className="w-full flex justify-between gap-2">
                          <div className="flex flex-col items-end gap-1">
                            <span className="solaimanlipi text-md text-default-700">
                              {examSet.title}
                            </span>
                          </div>
                        </div>
                      </Checkbox>
                    </div>
                  ))}
              </div>


    <p className="text-xl font-bold">সার্চ টাইপ</p>
              <div className="mt-2 mb-2 border-1 border-[#024645] rounded-lg text-black">
                {searchType?.map((type) => {
                  return (
                    <div key={type.key}>
                      <Checkbox
                        color="success"
                        isSelected={selectedTypes.includes(type.key)}
                        onChange={() => handleTypeChange(type.key)}
                      >
                        <p className="text-xl">{type.label}</p>
                      </Checkbox>
                    </div>
                  );
                })}
              </div>


              {/* Question Type Filter Section */}
              <div className="">
                <p className="text-xl font-bold">প্রশ্নের ধরন</p>
                <div className="mb-2 border-1 border-[#024645] rounded-lg text-black p-3">
                  {questionTypes.map((type) => (
                    <div key={type.key} className="mb-2">
                      <Checkbox
                        color="success"
                        isSelected={selectedQuestionTypes.includes(type.key)}
                        onChange={() => handleQuestionTypeChange(type.key)}
                      >
                        <p className="text-xl">{type.label}</p>
                      </Checkbox>
                    </div>
                  ))}
                  {selectedQuestionTypes.length > 0 && (
                    <Button
                      size="sm"
                      color="warning"
                      variant="flat"
                      className="mt-2 w-full"
                      onPress={() => setSelectedQuestionTypes([])}
                    >
                      সব ধরনের প্রশ্ন দেখুন
                    </Button>
                  )}
                </div>
              </div>

               <div>
                <p className="text-xl mt-3 font-bold">
                  অধ্যায় ভিত্তিক ফিল্টারিং প্রশ্ন
                </p>

                {filteredChapters?.map((chapter) => (
                  <div
                    key={chapter?._id}
                    className="mt-2 mb-2 border-1 border-[#024645] rounded-lg text-black"
                  >
                    <div>
                      <Checkbox
                        color="success"
                        isSelected={selectedChapters.includes(
                          chapter._id.toString(),
                        )}
                        onChange={() =>
                          handleChapterToggle(chapter._id.toString())
                        }
                      >
                        <p className="text-xl">{chapter?.chapterName}</p>
                      </Checkbox>
                    </div>
                  </div>
                ))}
              </div>
                  <p className="text-xl font-bold">টপিক অনুযায়ী ফিল্টার</p>
              <div className="mt-2 mb-2 border-1 border-[#024645] rounded-lg text-black">
                {allTopics?.length > 0 ? (
                  <Select
                    label="Select Topics"
                    placeholder="Choose topics"
                    selectionMode="multiple"
                    selectedKeys={selectedTopics}
                    onSelectionChange={(keys) => setSelectedTopics([...keys])}
                    className="w-full"
                    color="success"
                  >
                    {allTopics.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                  </Select>
                ) : (
                  <p className="p-2 text-gray-500">কোন টপিক পাওয়া যায়নি</p>
                )}
              </div>
              <div>
                <p className="text-xl mt-3 font-bold">বোর্ড প্রশ্ন</p>
                <div className="ps-3 pe-3 mt-2 mb-2 border-1 border-[#024645] rounded-lg text-black">
                  <Select
                    mode="multiple"
                    placeholder="সাল সিলেক্ট করুন"
                    className="solaimanlipi text-xl"
                    items={years}
                    selectedKeys={selectedYears}
                    onSelectionChange={(keys) =>
                      setSelectedYears(Array.from(keys))
                    }
                    style={{
                      width: "100%",
                      marginTop: "20px",
                      fontFamily: "SolaimanLipi",
                      fontSize: "20px",
                      padding: "10px",
                      borderRadius: "5px",
                    }}
                    size="large"
                  >
                    {(year) => (
                      <SelectItem key={year.key} textValue={year.label}>
                        <p className="solaimanlipi text-xl">{year.label}</p>
                      </SelectItem>
                    )}
                  </Select>

                  <div className="flex flex-col">
                    {allBoard?.map((board) => (
                      <div key={board.key}>
                        <Checkbox
                          color="success"
                          isSelected={selectedBoards.includes(board.key)}
                          onChange={() =>
                            setSelectedBoards((prev) =>
                              prev.includes(board.key)
                                ? prev?.filter((b) => b !== board.key)
                                : [...prev, board.key],
                            )
                          }
                        >
                          <p className="text-xl">{board.label}</p>
                        </Checkbox>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
             

          

          

             

            
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
