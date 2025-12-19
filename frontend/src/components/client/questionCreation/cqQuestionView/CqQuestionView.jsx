import { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Chip,
  cn,
  Tooltip,
  Select,
  SelectItem,
} from "@heroui/react";
import SaveIcon from "../../../../assets/SaveIcon";
import ClearIcon from "../../../../assets/ClearIcon";
import { Input } from "@heroui/input";
import SearchIcon from "../../../../assets/SearchIcon";
import { useNavigate } from "react-router-dom";
import { useGetAllExamsQuery } from "../../../../redux/api/slices/examSlice";
import { useGetAllDesireQuestionsQuery } from "../../../../redux/api/slices/chapterSlice";
import Swal from "sweetalert2";
import Latex from "react-latex";
import "katex/dist/katex.min.css";
import {
  useDemoQuestionsUpdateMutation,
  useGetExamSetsAnUserQuery,
  useGetExamSetWithCredentialsQuery,
  useQuestionsUpdateMutation,
} from "../../../../redux/api/slices/examSetSlice";

import { useSearchParams } from "react-router-dom";
import EyeOpenIcon from "../../../../assets/EyeOpenIcon";
import { CheckIcon, FilterIcon, X } from "lucide-react";

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

// Helper function to render LaTeX content
const renderLatexContent = (content) => {
  if (!content) return null;

  // Decode HTML entities
  const decodedContent = content
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

  // Whitelist allowed tags (table + image related)
  const allowedTags = [
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "caption",
    "img",
  ];

  // Remove all tags except allowed ones
  const cleanContent = decodedContent
    .replace(
      new RegExp(`<(?!/?(${allowedTags.join("|")})(\\s|>|/))[^>]*>`, "gi"),
      " "
    )
    .replace(/\s+/g, " ") // collapse extra spaces
    .trim();

  // Check for LaTeX expressions
  const hasLatex = /\\\(.*?\\\)|\$.*?\$|\\\[.*?\\\]|`.*?`/.test(cleanContent);

  if (hasLatex) {
    return <Latex>{cleanContent}</Latex>;
  }

  // Safe rendering (optional sanitization to prevent XSS)
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: cleanContent,
      }}
    />
  );
};

export default function CqQuestionView() {
  const email = localStorage?.getItem("email");
  const navigate = useNavigate();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedBoards, setSelectedBoards] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedSchools, setSelectedSchools] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [shouldShowSidebar, setShouldShowSidebar] = useState(true); // Desktop state
  const sidebarRef = useRef(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const pathParts = location.pathname.split("/");
  const examSetId = pathParts[3];
  const questionType = pathParts[2];
  const [searchParams] = useSearchParams();
  const qt = searchParams.get("qt");

  // State Management
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedExamSets, setSelectedExamSets] = useState([]);
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [foundIds, setFoundIds] = useState([]);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar when clicking outside (mobile only)
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        if (windowSize.width <= 768) {
          setIsSidebarOpen(false);
        }
      }
    }

    if (isSidebarOpen && windowSize.width <= 768) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen, windowSize.width]);

  // API Hooks
  const [questionsUpdate] = useQuestionsUpdateMutation();
  const [demoQuestionsUpdate] = useDemoQuestionsUpdateMutation();
  const { data: getAnUserExamSets, isLoading: anUserExamSetLoader } =
    useGetExamSetsAnUserQuery(email);

  const { data: getAllExamData } = useGetAllExamsQuery();
  const { data: getUserCredentialsProfile } = useGetExamSetWithCredentialsQuery(
    { email, examSetId }
  );

  const filterExamType = getAllExamData?.filter(
    (exam) => exam?._id === getUserCredentialsProfile?.examSet?.examCategory
  );

  // Question operations
  const { data: getDesireQuestionsData } = useGetAllDesireQuestionsQuery({
    email,
    subjectClassName: getUserCredentialsProfile?.examSet?.className,
    subjectName: getUserCredentialsProfile?.examSet?.subjectName,
    examType: filterExamType?.[0]?.examIdentifier || "",
    chapterId: Array.isArray(getUserCredentialsProfile?.examSet?.chapterId)
      ? getUserCredentialsProfile?.examSet?.chapterId?.flatMap((item) =>
        item.split(",")
      )
      : [],
  });

  // Event Handlers
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
        ?.filter((q) => q.type === "CQ" && (q.cqDetails?.topic || q.topic))
        ?.map((q) =>
          q.type === "CQ" ? q.cqDetails?.topic?.trim() : q.topic?.trim()
        )
    );

    return [...new Set(topics.filter(Boolean))];
  }, [getDesireQuestionsData]);

  const handleExamSetToggle = (examSetId, questionIds) => {
    setSelectedExamSets((prev) =>
      prev.some((set) => set.examSetId === examSetId)
        ? prev.filter((set) => set.examSetId !== examSetId)
        : [...prev, { examSetId, questionIds }]
    );
  };

  const handleChapterToggle = (chapterId) => {
    setSelectedChapters((prev) => {
      return prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId];
    });
  };

  // FIXED: Proper chapter filtering logic
  const filteredChapters = useMemo(() => {
    if (!getDesireQuestionsData?.chapters) {
      return [];
    }

    // First, filter chapters based on selectedChapters
    const chaptersToShow =
      selectedChapters.length > 0
        ? getDesireQuestionsData.chapters.filter((chapter) =>
          selectedChapters.includes(chapter._id.toString())
        )
        : getDesireQuestionsData.chapters;

    // Then, filter questions within each chapter
    return chaptersToShow.map((chapter) => {
      const filteredQuestions =
        chapter.questions?.filter((question) => {
          // Check if question is in selected exam sets
          const isInSelectedExamSet = selectedExamSets?.some((set) =>
            set.questionIds.includes(question._id)
          );

          // Check question type match
          const typeMatch =
            selectedTypes.length === 0 ||
            selectedTypes.some((type) => {
              const normalizedType = type.toLowerCase();
              return (
                question.type?.toLowerCase() === normalizedType ||
                question.searchType?.some(
                  (st) => st.toLowerCase() === normalizedType
                )
              );
            });

          // Check question level match
          const levelMatch =
            selectedLevels.length === 0 ||
            selectedLevels.includes(question.questionLevel);

          // Check search keyword match
          const matchesSearch = searchKeyword
            ? [
              question.type,
              question.questionName,
              question.option1,
              question.option2,
              question.option3,
              question.option4,
              question.boardExamList,
              question.schoolExamInfo,
              question.correctAnswer,
              question?.cqDetails?.mainQuestion || null,
              question?.cqDetails?.question1 || null,
              question?.cqDetails?.question2 || null,
              question?.cqDetails?.question3 || null,
              question?.cqDetails?.question4 || null,
            ].some((field) =>
              field?.toLowerCase?.().includes(searchKeyword?.toLowerCase())
            )
            : true;

          // Check school match
          const schoolMatch =
            selectedSchools.length === 0 ||
            selectedSchools.some((selectedSchool) => {
              const questionSchool = question.schoolExamInfo
                ?.trim()
                .replace(/\s+/g, " ");
              return questionSchool === selectedSchool;
            });

          // Check board and year matches
          const boardYearMatches = (question.boardExamList || []).some(
            (entry) => {
              const [board, year] = entry.split("-").map((str) => str?.trim());
              const boardOk =
                selectedBoards.length === 0 || selectedBoards.includes(board);
              const yearOk =
                selectedYears.length === 0 || selectedYears.includes(year);
              return boardOk && yearOk;
            }
          );

          // Check topic match
          const topicMatch =
            selectedTopics.length === 0 ||
            (question.topic && selectedTopics.includes(question.topic));

          return (
            !isInSelectedExamSet &&
            typeMatch &&
            levelMatch &&
            matchesSearch &&
            schoolMatch &&
            boardYearMatches &&
            topicMatch
          );
        }) || [];

      return {
        ...chapter,
        questions: filteredQuestions,
      };
    });
  }, [
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

  // Rest of your existing handlers and effects
  useEffect(() => {
    if (!filteredChapters) return;

    const allFound = filteredChapters.flatMap((chapter) => {
      const displayQuestions = chapter.questions || [];
      return selectedOptions.filter((id) =>
        displayQuestions?.some((q) => q._id === id)
      );
    });

    const uniqueFound = [...new Set(allFound)];
    setFoundIds(uniqueFound);
  }, [filteredChapters, selectedOptions]);

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
    if (questionType === "view-cq") {
      navigate(`/user/cq-question-paper/${examSetId}`);
    } else {
      navigate(`/user/question-paper/${examSetId}`);
    }
  };

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, "").trim();
  };

  // Determine if sidebar should be visible
  const isSidebarVisible =
    (windowSize.width <= 768 && isSidebarOpen) ||
    (windowSize.width > 768 && shouldShowSidebar);

  return (
    <div className="solaimanlipi flex flex-col md:flex-row ms-0 md:ms-[255px] mt-[85px] me-0 md:me-[20px] p-4 md:p-5 gap-4 md:gap-5">
      {/* Main content (left side) */}
      <Card
        className={`flex-1 max-h-[100vh] overflow-y-auto relative p-4 transition-all duration-300 bg-transparent shadow-none ${isSidebarVisible ? "md:me-[350px]" : "md:me-0"
          }`}
      >
        {/* FIXED: Button alignment - all buttons in same row */}
        <div className="sticky top-0 z-20 p-3 flex flex-row justify-between items-center gap-3 shadow-md rounded-xl backdrop-blur-lg">
          <div className="flex items-center gap-3">
            <Chip className="bg-[#024645] text-white" variant="shadow">
              <h3 className="text-sm sm:text-base">
                Selected: {foundIds?.length}/
                {getUserCredentialsProfile?.examSet?.marks}
              </h3>
            </Chip>

            {/* Filter button for mobile */}
            <Button
              isIconOnly
              onClick={() => setIsSidebarOpen(true)}
              className="bg-[#024645] text-white sm:hidden"
              size="sm"
            >
              <FilterIcon size={16} />
            </Button>
          </div>


          <div className="flex items-center gap-2">
            {/* Filter button for desktop */}
            <Button
              size="sm"
              onClick={() => setShouldShowSidebar(!shouldShowSidebar)}
              startContent={<FilterIcon className="size-4" />}
              className="bg-[#024645] text-white"
            >
              Filter
            </Button>
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
                <p className="text-white">Next</p>
              </Button>
            </Tooltip>
          </div>
        </div>

        <p className="mt-3 mb-2 text-xl sm:text-2xl font-bold">
          টাইটেল: {getUserCredentialsProfile?.examSet?.title}
        </p>

        <div className="">
          <div className="flex flex-col overflow-hidden">
            {(!filteredChapters || filteredChapters.length === 0) && (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#024645]"></div>
              </div>
            )}

            {filteredChapters?.map((chapter) => {
              const displayQuestions = chapter.questions || [];

              const searchQuestion = displayQuestions?.filter((q) =>
                stripHtml(q?.cqDetails?.mainQuestion || null)
                  .toLowerCase()
                  .includes(searchKeyword?.toLowerCase())
              );

              return (
                <div key={chapter._id} className="mb-6 sm:mb-10">
                  <h2 className="text-base sm:text-xl mb-3 sm:mb-4">
                    অধ্যায়: {chapter?.chapterName}
                  </h2>

                  {searchQuestion?.length === 0 ? (
                    <div className="text-center py-6 sm:py-8 px-4 sm:px-5 border rounded-lg bg-red-50 border-red-200 animate-fade-in">
                      <h3 className="text-lg sm:text-xl font-semibold text-red-700 mb-2">
                        {selectedTopics.length > 0
                          ? "😔 মিলে এমন প্রশ্ন পাওয়া যায়নি"
                          : "😔 প্রশ্ন পাওয়া যায়নি"}
                      </h3>
                      <p className="text-sm sm:text-base text-red-600">
                        <span className="font-bold">{chapter.chapterName}</span>{" "}
                        অধ্যায়ের জন্য
                        {selectedTopics.length > 0
                          ? ` "${selectedTopics.join(", ")}" টপিকের`
                          : ""}{" "}
                        কোনো সৃজনশীল প্রশ্ন পাওয়া যায়নি।
                      </p>
                    </div>
                  ) : (
                    searchQuestion?.map((question, index) => {
                      const isSelected = selectedOptions.some(
                        (id) => id.toString() === question?._id?.toString()
                      );

                      return (
                        <div
                          key={question._id}
                          className={`relative p-4 sm:p-6 rounded-md border mb-2 cursor-pointer transition-all duration-300 overflow-hidden shadow-md ${isSelected
                            ? "border-green-600 bg-green-50 shadow-lg"
                            : "border-gray-200 bg-white"
                            }`}
                          onClick={() => handleOptionClick(question?._id)}
                        >
                          {/* Question Number and Main Content */}
                          <div className="flex items-start">
                            {/* Question Number Circle */}
                            <div className="text-[1.25em]">
                              {toBanglaNumber(index + 1)}.
                            </div>

                            <div className="w-full text-xl ms-1">
                              {/* Header Section */}
                              <div className="flex flex-col justify-between items-start">
                                <div className="flex flex-col w-full">
                                  <div className="leading-relaxed text-xl">
                                    {renderLatexContent(
                                      question?.cqDetails?.mainQuestion ||
                                      null
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Questions Section */}
                              <div className="space-y-3 mr-1 mt-3">
                                {/* Question ক */}
                                <div className="">
                                  <h3 className="flex flex-row items-start gap-1">
                                    <span className="flex-shrink-0">ক.</span>
                                    <span className="flex-1">
                                      {renderLatexContent(
                                        question?.cqDetails?.question1 || null
                                      )}
                                    </span>
                                  </h3>
                                </div>

                                {/* Question খ */}
                                <div className="">
                                  <h3 className="flex flex-row items-start gap-1">
                                    <span className="flex-shrink-0">খ.</span>
                                    <span className="flex-1">
                                      {renderLatexContent(
                                        question?.cqDetails?.question2 || null
                                      )}
                                    </span>
                                  </h3>
                                </div>

                                {question?.cqDetails?.question3 && (
                                  <div className="">
                                    <h3 className="flex flex-row items-start gap-1">
                                      <span className="flex-shrink-0">
                                        গ.
                                      </span>
                                      <span className="flex-1">
                                        {renderLatexContent(
                                          question?.cqDetails?.question3 ||
                                          null
                                        )}
                                      </span>
                                    </h3>
                                  </div>
                                )}

                                {question?.cqDetails?.question4 && (
                                  <div className="">
                                    <h3 className="flex flex-row items-start gap-1">
                                      <span className="flex-shrink-0">
                                        ঘ.
                                      </span>
                                      <span className="flex-1">
                                        {renderLatexContent(
                                          question?.cqDetails?.question4 ||
                                          null
                                        )}
                                      </span>
                                    </h3>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                            {question?.searchType?.map((search) => (
                              <Chip
                                key={search}
                                className=""
                                color="black"
                                variant="bordered"
                                size="sm"
                              >
                                {search}
                              </Chip>
                            ))}
                          </div>
                          <div className="absolute right-4 bottom-4 flex items-end justify-end">
                            {question?.boardExamList?.map((entry) => {
                              // entry like "ঢাকা বোর্ড-২০২৪"
                              const [boardPart = "", yearPart = ""] = entry
                                .split("-")
                                .map((s) => s.trim());
                              const abbreviatedBoard = boardPart
                                .split(/\s+/)
                                .filter(Boolean)
                                .map((word) => {
                                  // take first two unicode characters safely
                                  const chars = Array.from(word);
                                  return chars.slice(0, 2).join("") + ".";
                                })
                                .join(" ");
                              return (
                                <span key={entry} className="mr-2 text-sm">
                                  {abbreviatedBoard}
                                  {yearPart ? " " + yearPart : ""}
                                </span>
                              );
                            })}
                          </div>

                          {/* Selection Indicator */}
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckIcon size={12} sm:size={16} color="white" />
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Sidebar - Conditionally rendered based on screen size */}
      {isSidebarVisible && (
        <>
          {/* Mobile overlay */}
          {windowSize.width <= 768 && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div
            ref={sidebarRef}
            className={`fixed right-0 top-0 h-full bg-white border-l border-gray-300 shadow-lg p-4 z-50 overflow-y-auto transition-transform duration-300 ${windowSize.width <= 768
              ? "w-full sm:w-[350px] transform translate-x-0"
              : "w-[350px]"
              } ${windowSize.width > 768 && !shouldShowSidebar
                ? "translate-x-full"
                : "translate-x-0"
              }`}
          >
            {/* Close button */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">অ্যাডভান্স ফিল্টার মেনু</h2>
              <Button
                isIconOnly
                onClick={() =>
                  windowSize.width <= 768
                    ? setIsSidebarOpen(false)
                    : setShouldShowSidebar(false)
                }
                className="bg-[#024645] text-white"
                size="sm"
              >
                <X size={16} />
              </Button>
            </div>

            <div className="mt-4 flex flex-row gap-2">
              <Input
                size="lg"
                radius="sm"
                className="text-xl w-full"
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

            {/* Rest of your sidebar content */}
            <div className="mt-4 mb-4 border-1 border-[#024645] rounded-lg p-4 bg-[#dbfce7] text-black">
              <p className="text-xl font-bold text-center">স্মার্ট ফিল্টার</p>
              <p className="text-center text-base mt-2">
                পৃথক প্রশ্ন সৃষ্টি করুন। পূর্বের প্রশ্ন বাদ দিয়ে নতুন প্রশ্ন
                তৈরি করুন।
              </p>
              {getAnUserExamSets?.examSets
                ?.slice(-3)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 3)
                ?.map((examSet) => (
                  <div key={examSet?._id} className="mt-2 mb-2">
                    <Checkbox
                      lineThrough
                      className="mt-2 mb-2"
                      color="success"
                      classNames={{
                        base: cn(
                          "inline-flex w-full max-w-md bg-content1",
                          "hover:bg-content2 items-center justify-start",
                          "cursor-pointer rounded-lg gap-2 p-3 border-1 border-transparent",
                          "data-[selected=true]:border-[#024645]"
                        ),
                        label: "w-full",
                      }}
                      isSelected={selectedExamSets.some(
                        (set) => set.examSetId === examSet._id
                      )}
                      onValueChange={() =>
                        handleExamSetToggle(examSet._id, examSet.questionIds)
                      }
                    >
                      <div className="w-full flex justify-between gap-2">
                        <div className="flex flex-col items-end gap-1">
                          <span className="solaimanlipi text-sm text-default-700">
                            {examSet.title}
                          </span>
                        </div>
                      </div>
                    </Checkbox>
                  </div>
                ))}
            </div>

            {/* Other filter sections */}
            <p className="text-lg font-bold">টপিক অনুযায়ী ফিল্টার</p>
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
                <p className="p-2 text-gray-500 text-sm">
                  কোন টপিক পাওয়া যায়নি
                </p>
              )}
            </div>

            <p className="text-lg font-bold">স্মার্ট অনুসন্ধান</p>
            <div className="mt-2 mb-2 border-1 border-[#024645] rounded-lg text-black">
              {searchType?.map((type) => {
                return (
                  <div key={type.key}>
                    <Checkbox
                      color="success"
                      isSelected={selectedTypes.includes(type.key)}
                      onChange={() => handleTypeChange(type.key)}
                    >
                      <p className="text-base">{type.label}</p>
                    </Checkbox>
                  </div>
                );
              })}
            </div>

            {/* FIXED: Chapter filtering section */}
            <div>
              <p className="text-lg mt-3 font-bold">
                অধ্যায় ভিত্তিক ফিল্টারিং প্রশ্ন
              </p>
              {getDesireQuestionsData?.chapters?.map((chapter) => (
                <div
                  key={chapter?._id}
                  className="mt-2 mb-2 border-1 border-[#024645] rounded-lg text-black"
                >
                  <div>
                    <Checkbox
                      color="success"
                      isSelected={selectedChapters.includes(
                        chapter._id.toString()
                      )}
                      onChange={() =>
                        handleChapterToggle(chapter._id.toString())
                      }
                    >
                      <p className="text-base">{chapter?.chapterName}</p>
                    </Checkbox>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <p className="text-lg mt-3 font-bold">বোর্ড প্রশ্ন</p>
              <div className="ps-2 pe-2 mt-2 mb-2 border-1 border-[#024645] rounded-lg text-black">
                <Select
                  mode="multiple"
                  placeholder="সাল সিলেক্ট করুন"
                  className="solaimanlipi text-base"
                  items={years}
                  selectedKeys={selectedYears}
                  onSelectionChange={(keys) =>
                    setSelectedYears(Array.from(keys))
                  }
                  style={{
                    width: "100%",
                    marginTop: "10px",
                    fontFamily: "SolaimanLipi",
                    fontSize: "16px",
                    padding: "8px",
                    borderRadius: "5px",
                  }}
                  size="large"
                >
                  {(year) => (
                    <SelectItem key={year.key} textValue={year.label}>
                      <p className="solaimanlipi text-base">{year.label}</p>
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
                              : [...prev, board.key]
                          )
                        }
                      >
                        <p className="text-base">{board.label}</p>
                      </Checkbox>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="text-lg mt-3 font-bold">শীর্ষস্থানীয় স্কুল</p>
              <div className="ps-2 pe-2 mt-2 mb-2 border-1 border-[#024645] rounded-lg text-black">
                {SCHOOL_OPTIONS.map((school) => (
                  <div key={school.key}>
                    <Checkbox
                      color="success"
                      isSelected={selectedSchools?.includes(school.key)}
                      onChange={() =>
                        setSelectedSchools((prev) =>
                          prev?.includes(school.key)
                            ? prev?.filter((s) => s !== school.key)
                            : [...prev, school.key]
                        )
                      }
                    >
                      <p className="text-base">{school.label}</p>
                    </Checkbox>
                  </div>
                ))}

                {SCHOOL_OPTIONS.length === 0 && (
                  <p className="text-gray-500 text-center py-2 text-sm">
                    কোনো স্কুলের তথ্য পাওয়া যায়নি
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
