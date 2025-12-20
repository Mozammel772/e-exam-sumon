import { useEffect, useMemo, useState } from "react";
import { MathJaxContext, MathJax } from "better-react-mathjax";
import {
  Alert,
  Button,
  Card,
  Tooltip,
  useDisclosure,
  Pagination,
  Chip,
} from "@heroui/react";
import SaveIcon from "../../../../assets/SaveIcon";
import ReportIcon from "../../../../assets/ReportIcon";
import IdeaIcon from "../../../../assets/IdeaIcon";
import QuestionIcon from "../../../../assets/QuestionIcon";
import { useNavigate } from "react-router-dom";
import { useGetAllExamsQuery } from "../../../../redux/api/slices/examSlice";
import { useGetAllDesireQuestionsQuery } from "../../../../redux/api/slices/chapterSlice";
import { useWindowSize } from "@uidotdev/usehooks";
import sanitizeHtml from "sanitize-html";
import Swal from "sweetalert2";

import {
  useDemoQuestionsUpdateMutation,
  useGetExamSetsAnUserQuery,
  useGetExamSetWithCredentialsQuery,
  useQuestionsUpdateMutation,
} from "../../../../redux/api/slices/examSetSlice";

import { useSearchParams } from "react-router-dom";
import EyeOpenIcon from "../../../../assets/EyeOpenIcon";
import { CheckIcon } from "lucide-react";
import FilterCard from "./filterCard/FilterCard";

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

export const years = [
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

export const questionTypes = [
  { key: "বহুনির্বাচনী", label: "বহুনির্বাচনী" },
  { key: "সৃজনশীল", label: "সৃজনশীল" },
  { key: "সংক্ষিপ্ত প্রশ্ন", label: "সংক্ষিপ্ত প্রশ্ন" },
]
// Configure MathJax
const mathjaxConfig = {
  loader: { load: ["input/tex", "output/chtml"] },
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
  chtml: {
    scale: 1.1,
  },
};

export default function QuestionView() {
  const email = localStorage?.getItem("email");
  const size = useWindowSize();

  const navigate = useNavigate();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedBoards, setSelectedBoards] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedSchools, setSelectedSchools] = useState([]);

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
  const [questionExplanation, setQuestionExplanation] = useState("");
  const [questionAnswer, setQuestionAnswer] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [foundIds, setFoundIds] = useState([]);

  // ==============================================
  //               PAGINATION STATE
  // ==============================================
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 20;

  // ==============================================
  //                 API HOOKS
  // ==============================================

  // Exam data queries
  const { data: getUserCredentialsProfile } = useGetExamSetWithCredentialsQuery(
    { email, examSetId }
  );

  const [questionsUpdate] = useQuestionsUpdateMutation();
  const [demoQuestionsUpdate] = useDemoQuestionsUpdateMutation();
  const { data: getAnUserExamSets, isLoading: anUserExamSetLoader } =
    useGetExamSetsAnUserQuery(email);

  const { data: getAllExamData } = useGetAllExamsQuery();
  const filterExamType = getAllExamData?.filter(
    (exam) => exam?._id === getUserCredentialsProfile?.examSet?.examCategory
  );

  // Question operations
  const { data: getDesireQuestionsData } = useGetAllDesireQuestionsQuery({
    email,
    subjectClassName: getUserCredentialsProfile?.examSet?.className,
    subjectName: getUserCredentialsProfile?.examSet?.subjectName,
    examType: filterExamType?.[0]?.examIdentifier || "",
    // subscription: getUserCredentialsProfile?.userProfile?.subscription,
    chapterId: Array.isArray(getUserCredentialsProfile?.examSet?.chapterId)
      ? getUserCredentialsProfile?.examSet?.chapterId?.flatMap((item) =>
        item.split(",")
      )
      : [],
  });

  console.log("getDesireQuestionsData", getDesireQuestionsData);

  // ==============================================
  //                 EVENT HANDLERS
  // ==============================================

  const handleTypeChange = (typeKey) => {
    setSelectedTypes((prev) =>
      prev.includes(typeKey)
        ? prev.filter((t) => t !== typeKey)
        : [...prev, typeKey]
    );
  };

  const allTopics = useMemo(() => {
    if (!getDesireQuestionsData?.chapters) return [];

    const topics = getDesireQuestionsData.chapters.flatMap((chapter) =>
      chapter.questions
        ?.filter((q) => q.type === "MCQ" && q.topic?.trim())
        ?.map((q) => q.topic.trim())
    );

    return [...new Set(topics)];
  }, [getDesireQuestionsData]);

  const handleExamSetToggle = (examSetId, questionIds) => {
    setSelectedExamSets((prev) =>
      prev.some((set) => set.examSetId === examSetId)
        ? prev.filter((set) => set.examSetId !== examSetId)
        : [...prev, { examSetId, questionIds }]
    );
  };

  // Add this handler for checkbox changes
  const handleChapterToggle = (chapterId) => {
    setSelectedChapters((prev) => {
      return prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId];
    });
  };

  const filteredChapters = useMemo(() => {
    if (!getDesireQuestionsData?.chapters) {
      return [];
    }

    // helper to normalize for safe comparisons
    const norm = (s) => (s ?? "").toString().trim().toLowerCase();

    return getDesireQuestionsData?.chapters
      ?.map((chapter) => {
        const chapterQuestions = chapter.questions || [];
        const isChapterSelected = selectedChapters.includes(
          chapter._id.toString()
        );

        // If chapter is selected, apply only search filtering to show all questions from that chapter
        if (isChapterSelected) {
          const filteredQuestions = chapterQuestions.filter((question) => {
            // Only apply search filter for selected chapters
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
              field?.toLowerCase?.().includes(searchKeyword?.toLowerCase())
            );

            return matchesSearch;
          });

          return {
            ...chapter,
            questions: filteredQuestions || [],
          };
        }

        // For non-selected chapters, apply the normal filtering
        const filteredQuestions =
          qt === "demo"
            ? chapterQuestions
            : chapterQuestions?.filter((question) => {
              const isInSelectedExamSet = selectedExamSets?.some((set) =>
                set.questionIds.includes(question._id)
              );

              // MODIFIED: Allow both MCQ and CQ types
              const typeMatch =
                selectedTypes.length === 0 ||
                selectedTypes.some(
                  (type) =>
                    question.searchType?.includes(type) ||
                    question.type?.includes(type)
                );

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
                field?.toLowerCase?.().includes(searchKeyword?.toLowerCase())
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
                }
              );

              // Exclude if matches selected topics
              const shouldExcludeByTopic =
                selectedTopics.length > 0 &&
                question.topic &&
                selectedTopics.some((t) => norm(t) === norm(question.topic));

              return (
                !isInSelectedExamSet &&
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
          questions: filteredQuestions || [],
        };
      })
      ?.filter(
        (chapter) =>
          (chapter.questions?.length || 0) > 0 ||
          selectedChapters.includes(chapter._id.toString())
      );
  }, [
    qt,
    selectedSchools,
    selectedTypes,
    selectedLevels,
    searchKeyword,
    selectedChapters,
    selectedExamSets,
    getDesireQuestionsData,
    selectedBoards,
    selectedYears,
    selectedTopics,
  ]);

  // ==============================================
  //               PAGINATION LOGIC
  // ==============================================

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, "").trim();
  };

  // Get all questions for pagination
  const allQuestions = useMemo(() => {
    if (!filteredChapters) return [];

    const questions = [];
    filteredChapters.forEach((chapter) => {
      const displayQuestions = chapter.questions
        ?.filter((question) => {
          if (questionType === "view-question") {
            return question?.type === "MCQ";
          }
          return false;
        })
        ?.filter(
          (question) =>
            selectedTopics.length === 0 ||
            selectedTopics.includes(
              question.type === "CQ"
                ? question.cqDetails?.topic
                : question.topic
            )
        )
        ?.filter((question) => {
          if (!question.boardExamList || question.boardExamList.length === 0) {
            return selectedBoards.length === 0 && selectedYears.length === 0;
          }

          return question.boardExamList.some((entry) => {
            const [boardName, year] = entry.split("-").map((s) => s.trim());
            const boardMatch =
              selectedBoards.length === 0 || selectedBoards.includes(boardName);
            const yearMatch =
              selectedYears.length === 0 || selectedYears.includes(year);
            return boardMatch && yearMatch;
          });
        })
        ?.filter((question) =>
          selectedTypes.every((type) => question.searchType?.includes(type))
        )
        ?.filter(
          (question) =>
            selectedLevels.length === 0 ||
            selectedLevels.includes(question.questionLevel)
        );

      const searchQuestion = displayQuestions?.filter((q) =>
        stripHtml(q?.questionName)
          .toLowerCase()
          .includes(searchKeyword?.toLowerCase())
      );

      if (searchQuestion && searchQuestion.length > 0) {
        questions.push({
          chapter,
          questions: searchQuestion,
        });
      }
    });

    return questions;
  }, [
    filteredChapters,
    questionType,
    selectedTopics,
    selectedBoards,
    selectedYears,
    selectedTypes,
    selectedLevels,
    searchKeyword,
  ]);

  // Flatten all questions for pagination
  const flattenedQuestions = useMemo(() => {
    const all = [];
    allQuestions.forEach((chapterData) => {
      chapterData.questions.forEach((question, index) => {
        all.push({
          ...question,
          chapter: chapterData.chapter,
          displayIndex: index + 1, // Local index within chapter
        });
      });
    });
    return all;
  }, [allQuestions]);

  // Calculate pagination values
  const totalQuestions = flattenedQuestions.length;
  const totalPages = Math.ceil(totalQuestions / questionsPerPage);

  // Get current page questions
  const currentQuestions = useMemo(() => {
    const startIndex = (currentPage - 1) * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    return flattenedQuestions.slice(startIndex, endIndex);
  }, [flattenedQuestions, currentPage, questionsPerPage]);

  // Group current questions by chapter for display
  const currentQuestionsByChapter = useMemo(() => {
    const grouped = {};

    currentQuestions.forEach((question) => {
      const chapterId = question.chapter._id;
      if (!grouped[chapterId]) {
        grouped[chapterId] = {
          chapter: question.chapter,
          questions: [],
        };
      }
      grouped[chapterId].questions.push(question);
    });

    return Object.values(grouped);
  }, [currentQuestions]);

  // Reset to page 1 when filters change
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
    selectedChapters,
  ]);

  useEffect(() => {
    if (!filteredChapters) return;

    // Collect foundIds across all chapters
    const allFound = filteredChapters.flatMap((chapter) => {
      const displayQuestions = chapter.questions
        ?.filter((question) => {
          if (questionType === "view-question") {
            return question?.type === "MCQ";
          }
          return false;
        })
        ?.filter(
          (question) =>
            selectedTopics.length === 0 ||
            (question.topic && selectedTopics.includes(question.topic))
        )
        ?.filter((question) =>
          selectedTypes.every((type) => question.searchType?.includes(type))
        )
        ?.filter(
          (question) =>
            selectedLevels.length === 0 ||
            selectedLevels.includes(question.questionLevel)
        );

      // Return IDs that match in this chapter
      return selectedOptions.filter((id) =>
        displayQuestions?.some((q) => q._id === id)
      );
    });

    // Remove duplicates
    const uniqueFound = [...new Set(allFound)];
    setFoundIds(uniqueFound);
  }, [
    filteredChapters,
    questionType,
    selectedTopics,
    selectedTypes,
    selectedLevels,
    selectedOptions,
  ]);

  const SCHOOL_OPTIONS = useMemo(() => {
    const schools = new Set();

    getDesireQuestionsData?.chapters?.forEach((chapter) => {
      chapter.questions?.forEach((question) => {
        if (question.schoolExamInfo?.trim()) {
          const normalizedSchool = question.schoolExamInfo
            .trim()
            .replace(/\s+/g, " ");
          schools.add(normalizedSchool);
        }
      });
    });

    return Array.from(schools).map((school) => ({
      key: school,
      label: school,
    }));
  }, [getDesireQuestionsData]);

  const handleOptionClick = (questionId) => {
    setSelectedOptions((prev) => {
      const stringId = questionId.toString();

      return prev.some((id) => id.toString() === stringId)
        ? prev?.filter((id) => id.toString() !== stringId)
        : [...prev, questionId];
    });
  };

  // ==============================================
  //               INITIALIZE SELECTED OPTIONS
  // ==============================================
  const sanitizeConfig = {
    allowedTags: [
      "img",
      "math",
      "mrow",
      "mi",
      "mo",
      "mn",
      "msup",
      "msub",
      "mfrac",
      "br",
      "table",
      "thead",
      "tbody",
      "tfoot",
      "tr",
      "th",
      "td",
      "caption",
      "colgroup",
      "col",
    ],
    allowedAttributes: {
      img: ["src", "alt", "width", "height", "loading", "style"],
      math: ["xmlns", "display"],
      mrow: ["data-mjx-tex-class"],
      mi: ["mathvariant"],
      mo: ["fence", "separator"],
      table: ["border", "cellpadding", "cellspacing", "width", "style"],
      th: ["rowspan", "colspan", "align", "style"],
      td: ["rowspan", "colspan", "align", "style"],
      col: ["span", "width", "style"],
    },
    allowedClasses: {
      "*": ["MJX_*", "MathJax_*", "mjx-*"],
    },
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
    navigate(`/user/question-paper/${examSetId}`);
  };

  const filteringChapters = filteredChapters?.filter((chapters) =>
    selectedChapters?.includes(chapters?._id)
  );

  return (
    <div
      className={`me-3 ${size?.width <= 600
        ? "solaimanlipi flex flex-col md:flex-row mt-[120px] me-[20px] p-5 gap-5"
        : "solaimanlipi flex flex-col md:flex-row ms-[255px] mt-[85px] me-[20px] p-5 gap-5"
        }`}
    >
      {/* Main content (left side) */}
      <Card className="flex-1 max-h-[100vh] overflow-y-auto relative p-4">
        <div className="sticky top-0 z-20 bg-white p-3 flex justify-between items-center shadow-md rounded-xl">
          <div>
            <Chip className="bg-[#024645] text-white" variant="shadow">
              <h3>
                Selected: {foundIds?.length}/
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
                <p className="text-lg">আপনার সংগ্রহকৃত প্রশ্নগুলো দেখুন</p>
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

        <p className="mt-3 mb-2 text-2xl font-bold">
          টাইটেল: {getUserCredentialsProfile?.examSet?.title}
        </p>
        {/* <p className=" mb-2 text-xl font-light text-center">
          অধ্যায়ভিত্তিক প্রশ্নসংখ্যা বাড়ানো হচ্ছে – ৫০০+ বহুনির্বাচনী ও ৫০+
          সৃজনশীল প্রশ্ন প্রতিটি অধ্যায়ে।
        </p> */}

        {/* Pagination Info */}
        <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-medium">
            মোট প্রশ্ন: {toBanglaNumber(totalQuestions)}
          </div>
          <div className="text-lg font-medium">
            পৃষ্ঠা {toBanglaNumber(currentPage)} এর {toBanglaNumber(totalPages)}
          </div>
        </div>

        {filteringChapters?.length > 0 ? (
          <div className="bg-gray-200 p-5 rounded-lg">
            <div className="bg-gray-200 p-5 rounded-lg">
              <div className="flex flex-col overflow-hidden">
                {(!filteringChapters || filteringChapters.length === 0) && (
                  <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#024645]"></div>
                  </div>
                )}

                {/* Render current page questions */}
                {currentQuestionsByChapter.map((chapterData) => (
                  <div key={chapterData.chapter._id} className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-[#024645]">
                      অধ্যায়: {chapterData.chapter?.chapterName}
                    </h2>

                    {chapterData.questions?.length === 0 ? (
                      <div className="text-center py-8 px-5 border rounded-lg bg-red-50 border-red-200 animate-fade-in">
                        <h3 className="text-xl font-semibold text-red-700 mb-2">
                          {selectedTopics.length > 0
                            ? "😔 মিলে এমন প্রশ্ন পাওয়া যায়নি"
                            : "😔 প্রশ্ন পাওয়া যায়নি"}
                        </h3>
                        <p className="text-base text-red-600">
                          <span className="font-bold">
                            {chapterData.chapter.chapterName}
                          </span>{" "}
                          অধ্যায়ের জন্য
                          {selectedTopics.length > 0
                            ? ` "${selectedTopics.join(", ")}" টপিকের`
                            : ""}{" "}
                          কোনো বহুনির্বাচনী প্রশ্ন পাওয়া যায়নি।
                        </p>
                      </div>
                    ) : (
                      chapterData.questions?.map((question, index) => {
                        const isSelected = selectedOptions.some(
                          (id) => id.toString() === question?._id?.toString()
                        );

                        return (
                          <div
                            key={question._id}
                            className={`mb-6 relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 overflow-hidden ${isSelected
                              ? "border-green-600 bg-green-50 shadow-lg"
                              : "border-gray-200 bg-white shadow-md hover:shadow-lg"
                              }`}
                            onClick={() => handleOptionClick(question?._id)}
                          >
                            {/* Question Number and Main Content */}
                            <div className="flex items-start gap-4">
                              {/* Question Number Circle */}
                              <div className="">
                                {toBanglaNumber(
                                  (currentPage - 1) * questionsPerPage +
                                  index +
                                  1
                                )}
                              </div>

                              {/* Main Question Content */}
                              <div className="flex-1">
                                {/* Question Header */}
                                <div className="flex justify-between items-start gap-4 mb-4">
                                  <div className="text-xl text-gray-800">
                                    <MathJaxContext config={mathjaxConfig}>
                                      <MathJax dynamic>
                                        <div
                                          dangerouslySetInnerHTML={{
                                            __html: sanitizeHtml(
                                              question?.questionName || "",
                                              sanitizeConfig
                                            ),
                                          }}
                                        />
                                      </MathJax>
                                    </MathJaxContext>
                                  </div>

                                  {/* Badges */}
                                  <div className="flex flex-col items-end gap-2">
                                    <Chip
                                      color="warning"
                                      variant="shadow"
                                      className="text-sm font-medium"
                                    >
                                      {question?.questionLevel}
                                    </Chip>
                                    {question.topic && (
                                      <Chip
                                        color="primary"
                                        variant="dot"
                                        size="sm"
                                        className="text-xs"
                                      >
                                        {question.topic}
                                      </Chip>
                                    )}
                                  </div>
                                </div>

                                {/* MCQ Options - Without Answers */}
                                <div className="grid lg:grid-cols-2 gap-1 mt-4">
                                  {[
                                    "option1",
                                    "option2",
                                    "option3",
                                    "option4",
                                  ].map(
                                    (optKey, optIndex) =>
                                      question[optKey] && (
                                        <div key={optKey} className="w-full">
                                          <Alert
                                            variant="bordered"
                                            color="default"
                                            className="border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors"
                                            title={
                                              <div className="flex items-center gap-3">
                                                <p className="w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-xl font-medium">
                                                  {
                                                    ["ক", "খ", "গ", "ঘ"][
                                                    optIndex
                                                    ]
                                                  }
                                                </p>
                                                <MathJaxContext
                                                  config={mathjaxConfig}
                                                >
                                                  <MathJax dynamic>
                                                    <div
                                                      className="text-gray-700 text-xl"
                                                      dangerouslySetInnerHTML={{
                                                        __html: sanitizeHtml(
                                                          question[optKey],
                                                          sanitizeConfig
                                                        ),
                                                      }}
                                                    />
                                                  </MathJax>
                                                </MathJaxContext>
                                              </div>
                                            }
                                            hideIcon
                                          />
                                        </div>
                                      )
                                  )}
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-6 flex flex-wrap gap-3 justify-between items-center solaimanlipi">
                                  <div className="flex flex-wrap gap-2">
                                    {/* Board Exam Info */}
                                    {question?.boardExamList?.length > 0 && (
                                      <Tooltip
                                        content="বোর্ড প্রশ্ন"
                                        showArrow={true}
                                      >
                                        <Button
                                          startContent={
                                            <QuestionIcon
                                              size="18px"
                                              color="#ffffff"
                                            />
                                          }
                                          size="sm"
                                          className="px-4 py-2 rounded-full text-black text-sm font-medium shadow-md hover:shadow-lg transition-all"
                                        >
                                          <span className="text-lg">
                                            {question.boardExamList.join(", ")}
                                          </span>
                                        </Button>
                                      </Tooltip>
                                    )}

                                    {/* Explanation Button */}
                                    <Tooltip
                                      content="প্রশ্নের ব্যাখ্যা দেখতে ক্লিক করুন"
                                      showArrow={true}
                                    >
                                      <Button
                                        onPress={onOpen}
                                        startContent={
                                          <IdeaIcon
                                            size="18px"
                                            color="#000000"
                                          />
                                        }
                                        size="sm"
                                        className="px-4 py-2 rounded-full text-black text-xl font-medium shadow-md hover:shadow-lg transition-all"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setQuestionExplanation(
                                            question?.explanation
                                          );
                                          setQuestionAnswer(
                                            question?.correctAnswer
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
                                        className="px-4 py-2 rounded-full bg-red-600 text-white text-xl font-medium shadow-md hover:bg-red-700 transition-all"
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
                                      )
                                    )}
                                  </div>
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
                      })
                    )}
                  </div>
                ))}

                <ExplainModal
                  isOpen={isOpen}
                  onOpenChange={onOpenChange}
                  questionExplanation={questionExplanation}
                  questionAnswer={questionAnswer}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col overflow-y-auto">
            {totalQuestions === 0 ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#024645] mb-4"></div>
                  <p className="text-lg text-gray-600">
                    কোন প্রশ্ন পাওয়া যায়নি
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Render current page questions */}
                {currentQuestionsByChapter.map((chapterData) => (
                  <div key={chapterData.chapter._id} className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-[#024645]">
                      অধ্যায়: {chapterData.chapter?.chapterName}
                    </h2>

                    {chapterData.questions?.length === 0 ? (
                      <div className="text-center py-8 px-5 border rounded-lg bg-red-50 border-red-200 animate-fade-in">
                        <h3 className="text-xl font-semibold text-red-700 mb-2">
                          {selectedTopics.length > 0
                            ? "😔 মিলে এমন প্রশ্ন পাওয়া যায়নি"
                            : "😔 প্রশ্ন পাওয়া যায়নি"}
                        </h3>
                        <p className="text-base text-red-600">
                          <span className="font-bold">
                            {chapterData.chapter.chapterName}
                          </span>{" "}
                          অধ্যায়ের জন্য
                          {selectedTopics.length > 0
                            ? ` "${selectedTopics.join(", ")}" টপিকের`
                            : ""}{" "}
                          কোনো বহুনির্বাচনী প্রশ্ন পাওয়া যায়নি।
                        </p>
                      </div>
                    ) : (
                      chapterData.questions?.map((question, index) => {
                        const isSelected = selectedOptions.some(
                          (id) => id.toString() === question?._id?.toString()
                        );

                        return (
                          <div
                            key={question._id}
                            className={`mb-6 relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 overflow-hidden ${isSelected
                              ? "border-green-600 bg-green-50 shadow-lg"
                              : "border-gray-200 bg-white shadow-md hover:shadow-lg"
                              }`}
                            onClick={() => handleOptionClick(question?._id)}
                          >
                            {/* Question Number and Main Content */}
                            <div className="flex items-start gap-1">
                              {/* Question Number Circle */}
                              <div className="text-xl">
                                {toBanglaNumber(
                                  (currentPage - 1) * questionsPerPage +
                                  index +
                                  1
                                )}.
                              </div>

                              {/* Main Question Content */}
                              <div className="flex-1">
                                {/* Question Header */}
                                <div className="flex justify-between items-start gap-4 mb-4">
                                  <div className="text-xl text-gray-800">
                                    <MathJaxContext config={mathjaxConfig}>
                                      <MathJax dynamic>
                                        <div
                                          dangerouslySetInnerHTML={{
                                            __html: sanitizeHtml(
                                              question?.questionName || "",
                                              sanitizeConfig
                                            ),
                                          }}
                                        />
                                      </MathJax>
                                    </MathJaxContext>
                                  </div>

                                  {/* Badges */}
                                  <div className="flex flex-col items-end gap-2">
                                    {question?.questionLevel && (
                                      <Chip
                                        color="success"
                                        variant="shadow"
                                        className="text-sm font-medium"
                                      >
                                        {question?.questionLevel}
                                      </Chip>
                                    )}
                                    {question.topic && (
                                      <Chip
                                        color="primary"
                                        variant="dot"
                                        size="sm"
                                        className="text-xs"
                                      >
                                        {question.topic}
                                      </Chip>
                                    )}
                                  </div>
                                </div>

                                {/* MCQ Options - Without Answers */}
                                <div className="grid lg:grid-cols-2 gap-1 mt-4">
                                  {[
                                    "option1",
                                    "option2",
                                    "option3",
                                    "option4",
                                  ].map(
                                    (optKey, optIndex) =>
                                      question[optKey] && (
                                        <div key={optKey} className="w-full">
                                          <Alert
                                            variant="bordered"
                                            color="default"
                                            className="bg-gray-100 transition-colors p-0 border-none"
                                            title={
                                              <div className="flex items-center gap-3">
                                                <p className="size-6 border border-gray-600 rounded-full flex items-center justify-center text-xl font-medium">
                                                  {
                                                    ["ক", "খ", "গ", "ঘ"][
                                                    optIndex
                                                    ]
                                                  }
                                                </p>
                                                <MathJaxContext
                                                  config={mathjaxConfig}
                                                >
                                                  <MathJax dynamic>
                                                    <div
                                                      className="text-gray-800 text-xl"
                                                      dangerouslySetInnerHTML={{
                                                        __html: sanitizeHtml(
                                                          question[optKey],
                                                          sanitizeConfig
                                                        ),
                                                      }}
                                                    />
                                                  </MathJax>
                                                </MathJaxContext>
                                              </div>
                                            }
                                            hideIcon
                                          />
                                        </div>
                                      )
                                  )}
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-6 flex flex-wrap gap-3 justify-between items-center">
                                  <div className="flex flex-wrap gap-2">

                                    {/* Explanation Button */}
                                    <Tooltip
                                      content="প্রশ্নের ব্যাখ্যা দেখতে ক্লিক করুন"
                                      showArrow={true}
                                    >
                                      <Button
                                        onPress={onOpen}
                                        startContent={
                                          <IdeaIcon
                                            size="18px"
                                            color="#000000"
                                          />
                                        }
                                        size="sm"
                                        className="px-4 py-2 rounded-full text-black text-xl font-medium shadow-md hover:shadow-lg transition-all"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setQuestionExplanation(
                                            question?.explanation
                                          );
                                          setQuestionAnswer(
                                            question?.correctAnswer
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
                                        className="px-4 py-2 rounded-full bg-red-600 text-white text-xl font-medium shadow-md hover:bg-red-700 transition-all"
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
                                      )
                                    )}
                                    {/* Board Exam Info */}
                                    {question?.boardExamList?.length > 0 && (
                                      <small>{question.boardExamList.join(", ")}</small>
                                    )}
                                  </div>
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
                      })
                    )}
                  </div>
                ))}
              </>
            )}

            <ExplainModal
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              questionExplanation={questionExplanation}
              questionAnswer={questionAnswer}
            />
          </div>
        )}

        {/* Pagination Controls */}
        {totalQuestions > questionsPerPage && (
          <div className="flex justify-center mt-8 mb-4">
            <Pagination
              total={totalPages}
              page={currentPage}
              onChange={setCurrentPage}
              color="primary"
              size="lg"
              showControls
              classNames={{
                cursor: "bg-[#024645]",
              }}
            />
          </div>
        )}
      </Card>

      {/* Right Sidebar (sticky) */}
      <FilterCard
        questionTypes={questionTypes}
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        getAnUserExamSets={getAnUserExamSets}
        selectedExamSets={selectedExamSets}
        handleExamSetToggle={handleExamSetToggle}
        allTopics={allTopics}
        selectedTopics={selectedTopics}
        setSelectedTopics={setSelectedTopics}
        searchType={searchType}
        selectedTypes={selectedTypes}
        handleTypeChange={handleTypeChange}
        filteredChapters={filteredChapters}
        selectedChapters={selectedChapters}
        handleChapterToggle={handleChapterToggle}
        years={years}
        selectedYears={selectedYears}
        setSelectedYears={setSelectedYears}
        allBoard={allBoard}
        selectedBoards={selectedBoards}
        setSelectedBoards={setSelectedBoards}
        SCHOOL_OPTIONS={SCHOOL_OPTIONS}
        selectedSchools={selectedSchools}
        setSelectedSchools={setSelectedSchools}
      />
    </div>
  );
}
