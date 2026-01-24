import { Button, Tooltip } from "@heroui/react";
import axios from "axios";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import sanitizeHtml from "sanitize-html";
import LatexRenderer from "../../../../../utils/LatexRenderer";
import AddIcon from "../../../../assets/AddIcon";
import SettingsIcon from "../../../../assets/SettingsIcon";
import {
  useGetAUserProfileByEmailQuery,
  useGetAUserProfileQuery,
} from "../../../../redux/api/slices/authSlice";
import { useGetAllClassesQuery } from "../../../../redux/api/slices/classSlice";
import { useGetAnExamSetsQuery } from "../../../../redux/api/slices/examSetSlice";
import { useGetAllExamsQuery } from "../../../../redux/api/slices/examSlice";
import { useGetAllSubjectsQuery } from "../../../../redux/api/slices/subjectSlice";
import ClientLoader from "../../../../utils/loader/ClientLoader";
import RightSidebar from "./utils/rightSidebar/RightSidebar";

const toBanglaNumber = (number) => {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return number?.toString().replace(/\d/g, (digit) => banglaDigits[digit]);
};

// Configure MathJax
// const mathjaxConfig = {
//   loader: { load: ["input/tex", "output/chtml"] },
//   tex: {
//     inlineMath: [
//       ["$", "$"],
//       ["\\(", "\\)"],
//     ],
//     displayMath: [
//       ["$$", "$$"],
//       ["\\[", "\\]"],
//     ],
//     processEscapes: true,
//   },
//   asciimath: {
//     delimiters: [["`", "`"]],
//   },
//   options: {
//     enableMenu: false,
//   },
//   chtml: {
//     scale: 1.1,
//   },
// };

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
  },
  chtml: {
    scale: 1, // 🔴 MUST be 1
  },
};

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

const formatDateToBangla = () => {
  const banglaMonths = [
    "জানুয়ারি",
    "ফেব্রুয়ারি",
    "মার্চ",
    "এপ্রিল",
    "মে",
    "জুন",
    "জুলাই",
    "আগস্ট",
    "সেপ্টেম্বর",
    "অক্টোবর",
    "নভেম্বর",
    "ডিসেম্বর",
  ];

  const today = new Date();
  const day = toBanglaNumber(today.getDate());
  const month = banglaMonths[today.getMonth()];
  const year = toBanglaNumber(today.getFullYear());

  return `${day} ${month} ${year}`;
};

export default function QuestionPaper() {
  const navigate = useNavigate();
  const token = localStorage?.getItem("token");
  const email = localStorage?.getItem("email");
  const pathParts = location.pathname.split("/");
  const examSetId = pathParts[3];

  const [layout, setLayout] = useState("a4");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // All your existing state variables...
  const [setName, setSetName] = useState("ক");
  const [isAnserShow, setIsAnswerShow] = useState(false);
  const [isDetailsShow, setIsDetailsShow] = useState(false);
  const [optionsStyle, setOptionsStyle] = useState("○");
  const [columnNumber, setColumnNumber] = useState(2);
  const [isShowAddress, setIsShowAddress] = useState(false);
  const [isWaterMark, setIsWaterMark] = useState(false);
  const [direction, setDirection] = useState(true);
  const [questionSubjectName, setQuestionSubjectName] = useState(true);
  const [chapterName, setChapterName] = useState(false);
  const [setCodeInfo, setSetCodeInfo] = useState(true);
  const [editingMode, setEditingMode] = useState(false);
  const [sheetMode, setSheetMode] = useState(false);
  const [waterMarkText, setWaterMarkText] = useState("");
  const [isWaterMarkImage, setIsWaterMarkImage] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [size, setSize] = useState(50);
  const [opacity, setOpacity] = useState(0.5);
  const [imageUrl, setImageUrl] = useState(
    localStorage.getItem("waterMarkImage") || "",
  );
  const [uploading, setUploading] = useState(false);

  // Sheet controlling hooks
  const getInitialSetting = (key, fallback) => {
    const stored = localStorage.getItem("sheetSettings");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed[key] !== undefined ? parsed[key] : fallback;
    }
    return fallback;
  };

  const [instructorNameToggle, setInstructorNameToggole] = useState(() =>
    getInitialSetting("instructorNameToggle", false),
  );
  const [instructorProfileToggle, setInstructorProfileToggole] = useState(() =>
    getInitialSetting("instructorProfileToggle", false),
  );
  const [lectureNumberToggle, setLectureNumberToggle] = useState(() =>
    getInitialSetting("lectureNumberToggle", 1),
  );
  const [lectureTopicToggle, setLectureTopicToggle] = useState(() =>
    getInitialSetting("lectureTopicToggle", false),
  );
  const [dataToggle, setDataToggle] = useState(() =>
    getInitialSetting("dataToggle", true),
  );
  const [bgColor, setBgColor] = useState(() =>
    getInitialSetting("bgColor", "#ffffff"),
  );
  const [textColor, setTextColor] = useState(() =>
    getInitialSetting("textColor", "#000000"),
  );

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Auto-close sidebar on resize to larger screens if needed
      if (window.innerWidth > 600 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen]);

  const isMobile = windowWidth <= 600;

  // Cloudinary upload function
  const cloudName = "dhojflhbx";
  const uploadPreset = "unsigned_images";

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
      );

      const uploadedUrl = res.data.secure_url;
      setImageUrl(uploadedUrl);
      localStorage.setItem("waterMarkImage", uploadedUrl);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  // Print function
  const handlePrint = () => {
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        @page {
          size: ${layout};
        }
      }
    `;
    document.head.appendChild(style);

    window.print();

    setTimeout(() => {
      document.head.removeChild(style);
    }, 1000);
  };

  // Keep all your existing useEffect hooks and API calls...
  // ... (all your existing useEffect hooks and API queries remain the same)

  const {
    data: getASingleAllQuestionSets,
    isLoading: singleUserAllQSetLoader,
  } = useGetAnExamSetsQuery(examSetId);

  const { data: getAnUserQuestionSets, isLoading: userProfileLoader } =
    useGetAUserProfileQuery(token);
  const { data: getAnUserProfileWithEmail } =
    useGetAUserProfileByEmailQuery(email);
  const { data: getAllClasses, isLoading: classLoader } =
    useGetAllClassesQuery();
  const { data: getAllSubjects, isLoading: subjectLoader } =
    useGetAllSubjectsQuery();
  const { data: getAllExamData, isLoading: examLoader } = useGetAllExamsQuery();
  const { data: getAnUserProfileData } = useGetAUserProfileQuery(token);

  // State initialization
  useEffect(() => {
    if (getAnUserQuestionSets?.user?.addresses?.organizations) {
      setWaterMarkText(getAnUserQuestionSets.user.addresses.organizations);
    }
  }, [getAnUserQuestionSets]);

  useEffect(() => {
    const matched = getASingleAllQuestionSets?.matchedQuestions || [];
    if (matched.length > 0) {
      setShuffledQuestions([...matched]);
    }
  }, [getASingleAllQuestionSets?.matchedQuestions]);

  // Derived data
  const getClass = getAllClasses?.filter(
    (cls) => cls?._id === getASingleAllQuestionSets?.className,
  );

  const getSubject = getAllSubjects?.filter(
    (sub) => sub?._id === getASingleAllQuestionSets?.subjectName,
  );

  const getExam = getAllExamData?.filter(
    (sub) => sub?._id === getASingleAllQuestionSets?.examCategory,
  );

  const findExam = getAllExamData?.find(
    (sub) => sub?._id === getASingleAllQuestionSets?.examCategory,
  );

  // Handlers
  const handleShuffleQuestions = () => {
    setShuffledQuestions((prev) => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });

    const setNames = ["ক", "খ", "গ", "ঘ"];
    const randomName = setNames[Math.floor(Math.random() * setNames.length)];
    setSetName(randomName);
  };

  // Loading state
  if (
    singleUserAllQSetLoader ||
    userProfileLoader ||
    classLoader ||
    subjectLoader ||
    examLoader
  ) {
    return <ClientLoader />;
  }

  const mcqTypeQuestions = shuffledQuestions?.filter((t) => t?.type === "MCQ");

  return (
    <div className="solaimanlipi flex flex-col md:flex-row print:items-center print:justify-center print:mx-auto mt-[85px] print:mt-0  gap-5 relative px-2">
      {/* Settings Toggle Button for Mobile */}
      {isMobile && (
        <Button
          className="fixed top-4 left-16 z-40 bg-[#024544] text-white shadow-lg"
          onPress={() => setIsSidebarOpen(!isSidebarOpen)}
          startContent={<SettingsIcon />}
        >
          <p className="ms-1">সেটিংস</p>
        </Button>
      )}

      {/* Main content */}

      <div
        id="question-paper"
        className={`w-full transition-all duration-300
    ${isMobile ? "" : "ms-[255px]"}
    print:ms-0 print:mx-auto print:block
  `}
      >
        {/* Add Question Button */}
        <div className="print:hidden">
          <Tooltip
            content="আরো প্রশ্ন যুক্ত করুন"
            className="solaimanlipi print:hidden"
          >
            {findExam?.examName === "সৃজনশীল" ? (
              <Button
                isIconOnly
                className="bg-[#024544]"
                onPress={() => navigate(`/user/view-cq/${examSetId}`)}
              >
                <AddIcon size="20px" color="#ffffff" />
              </Button>
            ) : (
              <Button
                isIconOnly
                className="bg-[#024544]"
                onPress={() =>
                  navigate(`/user/view-question/${examSetId}?qt=demo`)
                }
              >
                <AddIcon size="20px" color="#ffffff" />
              </Button>
            )}
          </Tooltip>
        </div>

        {/* Header Section */}
        <div
          className={`text-center p-2 ${
            sheetMode ? "mb-2 print-colored" : "mb-3"
          }`}
          style={
            sheetMode
              ? {
                  backgroundColor: bgColor || "transparent",
                  color: textColor || "#000000",
                  ["--bg-color"]: bgColor,
                  ["--text-color"]: textColor,
                }
              : {}
          }
        >
          {sheetMode ? (
            <div className="relative w-full h-[25px] ">
              {lectureNumberToggle && (
                <p className="absolute left-0 top-0 text-xl">লেকচার: ১</p>
              )}

              <p className="text-xl font-bold text-center absolute left-1/2 top-0 transform -translate-x-1/2">
                {getAnUserQuestionSets?.user?.addresses?.organizations ||
                  getAnUserProfileWithEmail?.user?.addresses?.organizations ||
                  "প্রতিষ্ঠানের নাম"}
              </p>

              {dataToggle && (
                <p className="absolute right-0 top-0 text-xl">
                  তারিখ: {formatDateToBangla()}
                </p>
              )}
            </div>
          ) : (
            <p className="text-xl font-bold" contentEditable={editingMode}>
              {getAnUserQuestionSets?.user?.addresses?.organizations ||
                getAnUserProfileWithEmail?.user?.addresses?.organizations ||
                "প্রতিষ্ঠানের নাম"}
            </p>
          )}

          {isShowAddress && (
            <p className="text-xl font-bold">
              {getAnUserQuestionSets?.user?.addresses?.districts ||
                getAnUserProfileWithEmail?.user?.addresses?.districts ||
                "জেলার নাম"}
              ,{" "}
              {getAnUserQuestionSets?.user?.addresses?.divisions ||
                getAnUserProfileWithEmail?.user?.addresses?.divisions ||
                "বিভাগের নাম"}
            </p>
          )}

          {getClass?.map((cls) => (
            <p key={cls?._id} className="text-xl font-light">
              {cls?.className} শ্রেণী
            </p>
          ))}

          <p className="text-xl font-light" contentEditable={editingMode}>
            {getASingleAllQuestionSets?.examType}
          </p>

          {questionSubjectName &&
            getSubject?.map((sub) => (
              <p
                key={sub?._id}
                className="text-lg font-light"
                contentEditable={editingMode}
              >
                {sub?.subjectName}
              </p>
            ))}

          {chapterName && (
            <p className="text-lg font-light" contentEditable={editingMode}>
              অধ্যায়:{" "}
              {getASingleAllQuestionSets?.chapterId
                ?.map((chap) => chap?.chapterName)
                .join(", ")}
            </p>
          )}

          {sheetMode && instructorNameToggle && (
            <p className="text-lg font-light" contentEditable={editingMode}>
              ইন্সট্রাক্টর:{" "}
              {getAnUserProfileData?.user?.userName ||
                getAnUserProfileWithEmail?.user?.userName}
            </p>
          )}

          {sheetMode && instructorProfileToggle && (
            <p className="text-lg font-light" contentEditable>
              ইন্সট্রাক্টর প্রোফাইল লিখুন
            </p>
          )}

          {getExam?.map((exam) => (
            <p
              key={exam?._id}
              className="text-lg font-light"
              contentEditable={editingMode}
            >
              {exam?.examName}
            </p>
          ))}

          {sheetMode && lectureTopicToggle && (
            <p className="text-lg font-light" contentEditable>
              লেকচার টপিকস: {getASingleAllQuestionSets?.title}
            </p>
          )}
        </div>

        {/* Time and Instruction Section */}
        {sheetMode ? (
          <div className="border-1 border-gray-300 mt-2"></div>
        ) : (
          <>
            <div className="flex justify-between w-full border-b-1 border-gray-700 ps-2">
              <p className="text-md font-light">
                সময়: {toBanglaNumber(mcqTypeQuestions?.length)} মিনিট
              </p>

              {setCodeInfo && (
                <p className="text-lg font-bold" contentEditable={editingMode}>
                  সেট: {setName}
                </p>
              )}

              <p className="text-md font-light">
                পূর্ণমাণ: {toBanglaNumber(mcqTypeQuestions?.length)}
              </p>
            </div>

            {direction && (
              <div className="text-center">
                <p className="text-md italic" contentEditable={editingMode}>
                  দ্রষ্টব্যঃ সরবরাহকৃত নৈর্ব্যত্তিক অভীক্ষার উত্তরপত্রে প্রশ্নের
                  ক্রমিক নম্বরের বিপরীতে প্রদত্ত বর্ণসম্বলিত বৃত্ত সমুহ হতে সঠিক
                  উত্তরের বৃত্তটি (
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 512 512"
                    className="inline-block"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"></path>
                  </svg>
                  ) বল পয়েন্ট কলম দ্বারা সম্পুর্ণ ভরাট করো। প্রতিটি প্রশ্নের মান
                  ১।
                </p>
                <p className="text-md font-bold" contentEditable={editingMode}>
                  প্রশ্নপত্রে কোনো প্রকার দাগ/চিহ্ন দেয়া যাবেনা ।
                </p>
              </div>
            )}
          </>
        )}

        {/* Main Question Section */}
        <div className="solaimanlipi" contentEditable={editingMode}>
          {[1, 2, 3].includes(columnNumber) && (
            <div
              className={`${
                columnNumber === 1
                  ? "columns-1"
                  : columnNumber === 2
                    ? "columns-2"
                    : "columns-3"
              } gap-4 relative`}
            >
              {/* Watermark Text */}
              {isWaterMark && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <h1 className="text-7xl font-bold text-gray-300 opacity-100 select-none">
                    {waterMarkText}
                  </h1>
                </div>
              )}

              {/* Watermark Image */}
              {isWaterMarkImage && imageUrl && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <img
                    src={imageUrl}
                    alt="Watermark"
                    className="object-contain select-none"
                    style={{
                      opacity: opacity,
                      width: `${size}%`,
                      maxWidth: "80%",
                      maxHeight: "80%",
                    }}
                  />
                </div>
              )}

              {/* Questions */}

              <div className="w-full divide-x-1.5 solaimanlipi ps-2">
                {mcqTypeQuestions?.map((question, index) => (
                  <div
                    key={question._id}
                    className="relative z-10 w-full h-full ps-2 solaimanlipi question-container print-safe"
                  >
                    {/* Question Text */}
                    <div className="text-md font-light flex items-baseline gap-0">
                      <span className="shrink-0 me-3">
                        {toBanglaNumber(index + 1)}.
                      </span>

                      <LatexRenderer
                        content={sanitizeHtml(question?.questionName || "", {
                          allowedTags: [
                            "p",
                            "img",
                            "span",
                            "b",
                            "i",
                            "u",
                            "strong",
                            "em",
                            "table",
                          ],
                          allowedAttributes: {
                            img: ["src", "alt", "width", "height", "loading"],
                            "*": ["style"],
                          },
                        })}
                      />
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-2 gap-y-1 mt-2 text-md">
                      {[
                        { label: "ক", text: question?.option1 },
                        { label: "খ", text: question?.option2 },
                        { label: "গ", text: question?.option3 },
                        { label: "ঘ", text: question?.option4 },
                      ]?.map((option, i) => (
                        <div
                          key={i}
                          className="break-inside-avoid text-md ms-6"
                        >
                          <p className="flex items-center">
                            <span className="mr-1 text-lg">
                              {optionsStyle === "○" ? (
                                <span className="inline-flex items-center justify-center w-4 h-4 border border-gray-500 rounded-full">
                                  {option.label}
                                </span>
                              ) : optionsStyle === "." ? (
                                `${option.label}.`
                              ) : optionsStyle === "( )" ? (
                                `(${option.label})`
                              ) : (
                                `${option.label})`
                              )}
                            </span>

                            <MathJaxContext config={mathjaxConfig}>
                              <MathJax dynamic>
                                <div
                                  className="text-gray-700 text-md"
                                  dangerouslySetInnerHTML={{
                                    __html: sanitizeHtml(
                                      (option.text || "").replace(
                                        /\n/g,
                                        "<br/>",
                                      ),
                                      sanitizeConfig,
                                    ),
                                  }}
                                />
                              </MathJax>
                            </MathJaxContext>
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Answer & Explanation */}
                    {(isAnserShow || isDetailsShow) && (
                      <div className="space-y-1 mt-1">
                        {isAnserShow && (
                          <div className="flex items-baseline gap-0">
                            <span className="solaimanlipi text-xl font-semibold shrink-0 me-1.5">
                              উত্তরঃ
                            </span>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: sanitizeHtml(
                                  question.correctAnswer || "",
                                  {
                                    allowedTags: [
                                      "p",
                                      "img",
                                      "span",
                                      "b",
                                      "i",
                                      "u",
                                      "strong",
                                      "em",
                                    ],
                                    allowedAttributes: {
                                      img: [
                                        "src",
                                        "alt",
                                        "width",
                                        "height",
                                        "loading",
                                      ],
                                      "*": ["style"],
                                    },
                                  },
                                ),
                              }}
                            />
                          </div>
                        )}

                        {isDetailsShow && (
                          <div className="flex items-baseline gap-0">
                            <span className="solaimanlipi text-xl font-semibold shrink-0">
                              ব্যাখ্যা:
                            </span>
                            <span
                              className="ms-2"
                              dangerouslySetInnerHTML={{
                                __html: sanitizeHtml(
                                  question.explanation || "",
                                  {
                                    allowedTags: [
                                      "p",
                                      "img",
                                      "span",
                                      "b",
                                      "i",
                                      "u",
                                      "strong",
                                      "em",
                                    ],
                                    allowedAttributes: {
                                      img: [
                                        "src",
                                        "alt",
                                        "width",
                                        "height",
                                        "loading",
                                      ],
                                      "*": ["style"],
                                    },
                                  },
                                ),
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      {(!isMobile || isSidebarOpen) && (
        <div
          className={`
          ${
            isMobile
              ? "fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300"
              : "static"
          }
          ${isMobile && !isSidebarOpen ? "translate-x-full" : "translate-x-0"}
        `}
        >
          <RightSidebar
            // Pass all props
            layout={layout}
            setLayout={setLayout}
            isAnserShow={isAnserShow}
            setIsAnswerShow={setIsAnswerShow}
            isDetailsShow={isDetailsShow}
            setIsDetailsShow={setIsDetailsShow}
            editingMode={editingMode}
            setEditingMode={setEditingMode}
            sheetMode={sheetMode}
            setSheetMode={setSheetMode}
            handleShuffleQuestions={handleShuffleQuestions}
            optionsStyle={optionsStyle}
            setOptionsStyle={setOptionsStyle}
            columnNumber={columnNumber}
            setColumnNumber={setColumnNumber}
            isShowAddress={isShowAddress}
            setIsShowAddress={setIsShowAddress}
            isWaterMark={isWaterMark}
            setIsWaterMark={setIsWaterMark}
            waterMarkText={waterMarkText}
            setWaterMarkText={setWaterMarkText}
            isWaterMarkImage={isWaterMarkImage}
            setIsWaterMarkImage={setIsWaterMarkImage}
            direction={direction}
            setDirection={setDirection}
            questionSubjectName={questionSubjectName}
            setQuestionSubjectName={setQuestionSubjectName}
            chapterName={chapterName}
            setChapterName={setChapterName}
            setCodeInfo={setCodeInfo}
            setSetCodeInfo={setSetCodeInfo}
            instructorNameToggle={instructorNameToggle}
            setInstructorNameToggole={setInstructorNameToggole}
            instructorProfileToggle={instructorProfileToggle}
            setInstructorProfileToggole={setInstructorProfileToggole}
            lectureNumberToggle={lectureNumberToggle}
            setLectureNumberToggle={setLectureNumberToggle}
            lectureTopicToggle={lectureTopicToggle}
            setLectureTopicToggle={setLectureTopicToggle}
            dataToggle={dataToggle}
            setDataToggle={setDataToggle}
            bgColor={bgColor}
            setBgColor={setBgColor}
            textColor={textColor}
            setTextColor={setTextColor}
            size={size}
            setSize={setSize}
            opacity={opacity}
            setOpacity={setOpacity}
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            uploading={uploading}
            setUploading={setUploading}
            handleImageUpload={handleImageUpload}
            handlePrint={handlePrint}
          />
        </div>
      )}

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
