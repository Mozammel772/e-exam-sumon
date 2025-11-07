import { useEffect, useState } from "react";
import {
  Button,
  Card,
  cn,
  Switch,
  Tooltip,
  Textarea,
  RadioGroup,
  Radio,
} from "@heroui/react";
import SettingsIcon from "../../../../assets/SettingsIcon";
import ChangeIcon from "../../../../assets/ChangeIcon";
import AddIcon from "../../../../assets/AddIcon";
import { useGetAnExamSetsQuery } from "../../../../redux/api/slices/examSetSlice";
import ClientLoader from "../../../../utils/loader/ClientLoader";
import {
  useGetAUserProfileByEmailQuery,
  useGetAUserProfileQuery,
} from "../../../../redux/api/slices/authSlice";
import { useGetAllClassesQuery } from "../../../../redux/api/slices/classSlice";
import { useGetAllSubjectsQuery } from "../../../../redux/api/slices/subjectSlice";
import { useGetAllExamsQuery } from "../../../../redux/api/slices/examSlice";
import { useNavigate } from "react-router";
import Latex from "react-latex";
import "katex/dist/katex.min.css";
import { useWindowSize } from "@uidotdev/usehooks";
import axios from "axios";

const toBanglaNumber = (number) => {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return number?.toString().replace(/\d/g, (digit) => banglaDigits[digit]);
};

// Helper function to render LaTeX content
const renderLatexContent = (content) => {
  if (!content) return null;

  // Decode HTML entities first
  const decodedContent = content
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

  // Remove ALL HTML tags and clean up whitespace
  const cleanContent = decodedContent
    .replace(/<[^>]*>/g, " ") // Replace tags with spaces
    .replace(/\s+/g, " ") // Collapse multiple spaces
    .trim();

  // Check for LaTeX or chemical equations
  const hasLatex = /\\\(.*\\\)|\$.*\$|\\\[.*\\\]|`.*`/.test(cleanContent);
  const hasChemical = /[A-Z][a-z]?\d*\+[A-Z][a-z]?\d*→[A-Z][a-z]?\d*/.test(
    cleanContent
  );

  if (hasLatex || hasChemical) {
    // Convert chemical equations to LaTeX format
    let processedContent = cleanContent
      .replace(/→/g, "\\to ")
      .replace(/H2/g, "H_2")
      .replace(/O2/g, "O_2")
      .replace(/H2O/g, "H_2O")
      .replace(/√(\d+)/g, "\\\\sqrt{$1}");

    return <Latex>{processedContent}</Latex>;
  }

  return <div>{cleanContent}</div>;
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

const printStyles = `
  @media print {
    .katex {
      font-size: 1em !important;
    }
    .katex-display {
      margin: 0.2em 0 !important;
    }
    .katex-html {
      line-height: 1.2 !important;
    }
    .katex .sqrt {
      transform: scale(0.9);
      transform-origin: left center;
    }
  }
`;

const CustomSwitch = ({ label, isSelected, onValueChange }) => (
  <Switch
    name={label}
    isSelected={isSelected}
    onValueChange={onValueChange}
    color="success"
    classNames={{
      base: cn(
        "inline-flex flex-row-reverse w-full max-w-md bg-[#dbfce7] hover:bg-content2 items-center",
        "justify-between cursor-pointer rounded-lg gap-2 p-2 border-2 border-transparent",
        "data-[selected=true]:border-[#024645]"
      ),
      wrapper: "p-0 h-4 overflow-visible",
      thumb: cn(
        "w-6 h-6 border-2 shadow-lg",
        "group-data-[hover=true]:border-[#024645]",
        "group-data-[selected=true]:ms-6",
        "group-data-[pressed=true]:w-7",
        "group-data-[selected]:group-data-[pressed]:ms-4"
      ),
    }}
  >
    <div className="flex flex-col gap-1">
      <p className="text-xl">{label}</p>
    </div>
  </Switch>
);

const OptionStyleButtons = ({ options, currentStyle, onChange }) => (
  <div className="flex gap-2">
    {options?.map((option, index) => (
      <button
        key={index}
        className={`w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg text-xl font-bold transition-all ${
          currentStyle === option
            ? "bg-green-700 text-white border-green-700"
            : "bg-white hover:bg-gray-200"
        }`}
        onClick={() => onChange(option)}
      >
        {option}
      </button>
    ))}
  </div>
);

export default function CqQuestionPaper() {
  const navigate = useNavigate();
  const size = useWindowSize();
  const token = localStorage?.getItem("token");
  const email = localStorage?.getItem("email");
  const pathParts = location.pathname.split("/");
  const examSetId = pathParts[3];

  const [layout, setLayout] = useState("a4");

  // State management
  const [setName, setSetName] = useState("ক");
  const [isAnserShow, setIsAnswerShow] = useState(false);
  const [isDetailsShow, setIsDetailsShow] = useState(false);
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
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isWaterMarkImage, setIsWaterMarkImage] = useState(false);
  const [imageSize, setImageSize] = useState(50);
  const [opacity, setOpacity] = useState(0.5);
  const [imageUrl, setImageUrl] = useState(
    localStorage.getItem("waterMarkImage") || ""
  );
  const [uploading, setUploading] = useState(false);

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
        formData
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

  const getInitialSetting = (key, fallback) => {
    const stored = localStorage.getItem("sheetSettings");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed[key] !== undefined ? parsed[key] : fallback;
    }
    return fallback;
  };

  const [instructorNameToggle, setInstructorNameToggole] = useState(() =>
    getInitialSetting("instructorNameToggle", false)
  );
  const [instructorProfileToggle, setInstructorProfileToggole] = useState(() =>
    getInitialSetting("instructorProfileToggle", false)
  );
  const [lectureNumberToggle, setLectureNumberToggle] = useState(() =>
    getInitialSetting("lectureNumberToggle", 1)
  );
  const [lectureTopicToggle, setLectureTopicToggle] = useState(() =>
    getInitialSetting("lectureTopicToggle", false)
  );
  const [dataToggle, setDataToggle] = useState(() =>
    getInitialSetting("dataToggle", true)
  );
  const [bgColor, setBgColor] = useState(() =>
    getInitialSetting("bgColor", "#ffffff")
  );
  const [textColor, setTextColor] = useState(() =>
    getInitialSetting("textColor", "#000000")
  );
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = printStyles;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);
  useEffect(() => {
    const settings = {
      instructorNameToggle,
      instructorProfileToggle,
      lectureNumberToggle,
      lectureTopicToggle,
      dataToggle,
      bgColor,
      textColor,
    };

    localStorage.setItem("sheetSettings", JSON.stringify(settings));
  }, [
    instructorNameToggle,
    instructorProfileToggle,
    lectureNumberToggle,
    lectureTopicToggle,
    dataToggle,
    bgColor,
    textColor,
  ]);

  // API Queries
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
    (cls) => cls?._id === getASingleAllQuestionSets?.className
  );

  const getSubject = getAllSubjects?.filter(
    (sub) => sub?._id === getASingleAllQuestionSets?.subjectName
  );

  const getExam = getAllExamData?.filter(
    (sub) => sub?._id === getASingleAllQuestionSets?.examCategory
  );

  const findExam = getAllExamData?.find(
    (sub) => sub?._id === getASingleAllQuestionSets?.examCategory
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

    // ✅ Randomly pick one set name (ক, খ, গ, ঘ)
    const setNames = ["ক", "খ", "গ", "ঘ"];
    const randomName = setNames[Math.floor(Math.random() * setNames.length)];
    setSetName(randomName);
  };

  // Constants
  const columnOptions = [1, 2, 3];

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

  const cqTypeQuestions = shuffledQuestions?.filter((t) => t?.type === "CQ");

  console.log("cqTypeQuestions", cqTypeQuestions);

  return (
    <div
      className={`solaimanlipi flex flex-col md:flex-row print:ms-0 mt-[85px] print:mt-0 me-[20px] print:me-0 gap-5
        ${size?.width > 600 ? "ms-[255px]" : ""}
      `}
    >
      {/* Mobile Sidebar Drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end print:hidden">
          <div className="w-72 bg-white h-full p-5 overflow-y-auto shadow-lg">
            {/* Close button */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 right-4 text-gray-600"
            >
              ✕
            </button>

            {/* Put your existing sidebar content here */}
            <div className="space-y-4">
              <Button
                startContent={<SettingsIcon />}
                className="p-5 text-2xl"
                radius="none"
                variant="bordered"
              >
                প্রশ্ন এডিট
              </Button>

              {/* Print Layout Selection Section */}
              <div className="bg-[#dbfce7] rounded-lg p-4">
                <p className="text-xl font-light mb-2">
                  প্রিন্ট লেআউট নির্বাচন করুন
                </p>
                <RadioGroup
                  orientation="vertical"
                  value={layout}
                  onValueChange={setLayout}
                  className="space-y-1"
                >
                  <Radio value="a4">A4</Radio>
                  <Radio value="letter">Letter</Radio>
                  <Radio value="legal">Legal</Radio>
                  <Radio value="a5">A5</Radio>
                </RadioGroup>

                <Button
                  onClick={() => {
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
                  }}
                  className="text-lg bg-[#024544] text-white w-full"
                >
                  প্রিন্ট করুন
                </Button>
              </div>

              <CustomSwitch
                label="উত্তরপত্র"
                isSelected={isAnserShow}
                onValueChange={setIsAnswerShow}
              />

              <CustomSwitch
                label="ব্যাখ্যা"
                isSelected={isDetailsShow}
                onValueChange={setIsDetailsShow}
              />

              <CustomSwitch
                label="এডিটিং মুড"
                isSelected={editingMode}
                onValueChange={setEditingMode}
              />

              <CustomSwitch
                label="শীট"
                isSelected={sheetMode}
                onValueChange={setSheetMode}
              />

              {sheetMode && (
                <div className="mt-4 space-y-4 border border-dashed border-blue-500 rounded-lg p-3">
                  <p className="text-sm text-center text-gray-700">
                    শীট তৈরির সেটিংসগুলো অটোমেটিক সেট থাকবে সবসময়।
                  </p>

                  {/* All other switches and inputs */}
                  <CustomSwitch
                    label="ইন্ট্রাক্টরের নাম"
                    isSelected={instructorNameToggle}
                    onValueChange={setInstructorNameToggole}
                  />
                  <CustomSwitch
                    label="ইন্ট্রাক্টরের প্রোফাইল"
                    isSelected={instructorProfileToggle}
                    onValueChange={setInstructorProfileToggole}
                  />
                  <CustomSwitch
                    label="লেকচার নম্বর"
                    isSelected={lectureNumberToggle}
                    onValueChange={setLectureNumberToggle}
                  />
                  <CustomSwitch
                    label="লেকচার টপিক"
                    isSelected={lectureTopicToggle}
                    onValueChange={setLectureTopicToggle}
                  />
                  <CustomSwitch
                    label="তারিখ"
                    isSelected={dataToggle}
                    onValueChange={setDataToggle}
                  />

                  <div>
                    <label className="block mb-1">
                      ব্যাকগ্রাউন্ড কালার পছন্দ করুন
                    </label>
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-full h-10 border"
                    />
                  </div>

                  <div>
                    <label className="block mb-1">
                      টেক্সট কালার পছন্দ করুন
                    </label>
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-full h-10 border"
                    />
                  </div>
                </div>
              )}

              <div
                onClick={handleShuffleQuestions}
                className="flex flex-row justify-between items-center bg-[#dbfce7] rounded-lg p-3 cursor-pointer"
              >
                <p className="solaimanlipi text-xl">শ্যাফেল</p>
                <Button
                  isIconOnly
                  className="bg-[#024544]"
                  onPress={handleShuffleQuestions}
                >
                  <ChangeIcon />
                </Button>
              </div>

              <div className="bg-[#dbfce7] rounded-lg p-4">
                <p className="text-xl font-light mb-2">কলাম সংখ্যা</p>
                <OptionStyleButtons
                  options={columnOptions}
                  currentStyle={columnNumber}
                  onChange={setColumnNumber}
                />
              </div>

              <CustomSwitch
                label="ঠিকানা"
                isSelected={isShowAddress}
                onValueChange={setIsShowAddress}
              />

              <CustomSwitch
                label="জলছাপ"
                isSelected={isWaterMark}
                onValueChange={setIsWaterMark}
              />

              {isWaterMark && (
                <Textarea
                  className="max-w-full"
                  variant="bordered"
                  placeholder="জলছাপের টেক্সট লিখুন"
                  value={waterMarkText}
                  onChange={(e) => setWaterMarkText(e.target.value)}
                />
              )}

              <CustomSwitch
                label="নির্দেশনা"
                isSelected={direction}
                onValueChange={setDirection}
              />

              <CustomSwitch
                label="বিষয়ের নাম"
                isSelected={questionSubjectName}
                onValueChange={setQuestionSubjectName}
              />

              <CustomSwitch
                label="অধ্যায়ের নাম"
                isSelected={chapterName}
                onValueChange={setChapterName}
              />

              <CustomSwitch
                label="সেট কোড"
                isSelected={setCodeInfo}
                onValueChange={setSetCodeInfo}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div id="question-paper" className="w-full">
        <div className="print:hidden">
          {/* Floating Settings Button (mobile only) */}
          <Tooltip
            content="আরো প্রশ্ন যুক্ত করুন"
            className="solaimanlipi print:hidden"
          >
            {findExam?.examName === "সৃজনশীল" ? (
              <>
                <Button
                  isIconOnly
                  className="bg-[#024544]"
                  onPress={() => navigate(`/user/view-cq/${examSetId}`)}
                >
                  <AddIcon size="20px" color="#ffffff" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  isIconOnly
                  className="bg-[#024544]"
                  onPress={() =>
                    navigate(`/user/view-question/${examSetId}?qt=demo`)
                  }
                >
                  <AddIcon size="20px" color="#ffffff" />
                </Button>
              </>
            )}
          </Tooltip>
          {size?.width <= 600 && (
            <Tooltip className="solaimanlipi print:hidden">
              <Button
                isIconOnly
                onClick={() => setIsSidebarOpen(true)}
                className="bg-[#024544] text-white p-4 rounded-full shadow-lg"
              >
                <SettingsIcon className="w-6 h-6" />{" "}
              </Button>
            </Tooltip>
          )}
        </div>
        {/* Header Information */}
        <div
          className={`text-center p-2 print-colored ${
            sheetMode ? "mb-2" : "mb-3"
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
            <div className="relative w-full h-[25px]">
              {/* Left (Lecture) */}
              {lectureNumberToggle && (
                <p className="absolute left-0 top-0 text-xl">লেকচার: ১</p>
              )}

              {/* Center (Organization Name) */}
              <p className="text-xl font-bold text-center absolute left-1/2 top-0 transform -translate-x-1/2">
                {getAnUserQuestionSets?.user?.addresses?.organizations ||
                  getAnUserProfileWithEmail?.user?.addresses?.organizations ||
                  "প্রতিষ্ঠানের নাম"}
              </p>

              {/* Right (Date) */}
              {dataToggle && (
                <p className="absolute right-0 top-0 text-xl">
                  তারিখ: {formatDateToBangla()}
                </p>
              )}
            </div>
          ) : (
            <>
              <p className="text-xl font-bold" contentEditable={editingMode}>
                {getAnUserQuestionSets?.user?.addresses?.organizations ||
                  getAnUserProfileWithEmail?.user?.addresses?.organizations ||
                  "প্রতিষ্ঠানের নাম"}
              </p>
            </>
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

          {sheetMode && (
            <>
              {instructorNameToggle && (
                <p className="text-lg font-light" contentEditable={editingMode}>
                  ইন্সট্রাক্টর:{" "}
                  {getAnUserProfileData?.user?.userName ||
                    getAnUserProfileWithEmail?.user?.userName}
                </p>
              )}
            </>
          )}
          {sheetMode && (
            <>
              {instructorProfileToggle && (
                <p className="text-lg font-light" contentEditable>
                  ইন্সট্রাক্টর প্রোফাইল লিখুন
                </p>
              )}
            </>
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

          {sheetMode && (
            <>
              {lectureTopicToggle && (
                <p className="text-lg font-light" contentEditable>
                  লেকচার টপিকস: {getASingleAllQuestionSets?.title}
                </p>
              )}
            </>
          )}
        </div>

        {sheetMode ? (
          <div className="border-1 border-gray-300 mt-2"></div>
        ) : (
          <>
            <div className="flex justify-between w-full border-b-1 border-gray-700 ps-2">
              <p className="text-md font-light">
                সময়:{" "}
                {toBanglaNumber(
                  getASingleAllQuestionSets?.questionIds?.length * 15
                )}{" "}
                মিনিট
              </p>

              {setCodeInfo && (
                <p className="text-lg font-bold" contentEditable={editingMode}>
                  সেট: {setName}
                </p>
              )}

              <p className="text-md font-light">
                পূর্ণমাণ:{" "}
                {toBanglaNumber(
                  getASingleAllQuestionSets?.questionIds?.length * 10
                )}
              </p>
            </div>

            {/* Instructions */}
            {direction && (
              <div className="text-center">
                <p className="text-md italic" contentEditable={editingMode}>
                  দ্রষ্টব্যঃ ডান পাশের সংখ্যা প্রশ্নের পুর্নমাণ জ্ঞাপক। যেকোনো
                  __ টি প্রশ্নের উত্তর দাও।
                </p>
                <p className="text-md font-bold" contentEditable={editingMode}>
                  প্রশ্নপত্রে কোনো প্রকার দাগ/চিহ্ন দেয়া যাবেনা।
                </p>
              </div>
            )}
          </>
        )}

        {/* Questions Section */}
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
              {isWaterMark && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <h1 className="text-7xl font-bold text-gray-300 opacity-100 select-none">
                    {waterMarkText}
                  </h1>
                </div>
              )}

              {isWaterMarkImage && imageUrl && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <img
                    src={imageUrl}
                    alt="Watermark"
                    className="object-contain select-none"
                    style={{
                      opacity: opacity,
                      width: `${imageSize}%`,
                      maxWidth: "80%",
                      maxHeight: "80%",
                    }}
                  />
                </div>
              )}

              <div className="w-full divide-x-1.5 solaimanlipi ps-3">
                {cqTypeQuestions?.map((question, index) => (
                  <div
                    key={question._id}
                    className="relative z-10 w-full h-full ps-2 solaimanlipi question-container print-safe"
                  >
                    {/* Question Text */}
                    <div className="text-xl font-light flex items-baseline gap-0 mb-3">
                      <span className="shrink-0 me-3">
                        {toBanglaNumber(index + 1)}.
                      </span>
                      <div
                        className="text-black leading-relaxed"
                        style={{ fontSize: "1.1rem", lineHeight: "1.6" }}
                      >
                        {renderLatexContent(question.cqDetails.mainQuestion)}
                      </div>
                    </div>

                    {/* Options */}
                    <div className="" contentEditable={editingMode}>
                      {/* Question a */}
                      <div className="flex justify-between items-start text-gray-800 mb-2 ms-6">
                        <div className="flex items-start flex-1">
                          <span className="shrink-0 me-1 text-lg">ক.</span>
                          <div
                            className="text-black leading-relaxed flex-1"
                            style={{ fontSize: "1rem", lineHeight: "1.5" }}
                          >
                            {renderLatexContent(question.cqDetails.question1)}
                          </div>
                        </div>
                        <span className="text-lg font-medium ml-4 shrink-0">
                          {question.cqDetails.question4 ? "১" : "২"}
                        </span>
                      </div>

                      {/* Question b */}
                      <div className="flex justify-between items-start text-gray-800 mb-2 ms-6">
                        <div className="flex items-start flex-1">
                          <span className="shrink-0 me-1 text-lg">খ.</span>
                          <div
                            className="text-black"
                            style={{ fontSize: "1rem", lineHeight: "1.5" }}
                          >
                            {renderLatexContent(question.cqDetails.question2)}
                          </div>
                        </div>
                        <span className="text-lg font-medium ml-4 shrink-0">
                          {question.cqDetails.question4 ? "২" : "৪"}
                        </span>
                      </div>

                      {/* Question c */}
                      {question.cqDetails.question3 && (
                        <div className="flex justify-between items-start text-gray-800 mb-2 ms-6">
                          <div className="flex items-start flex-1">
                            <span className="shrink-0 me-1 text-lg">গ.</span>
                            <div
                              className="text-black leading-relaxed flex-1"
                              style={{ fontSize: "1rem", lineHeight: "1.5" }}
                            >
                              {renderLatexContent(question.cqDetails.question3)}
                            </div>
                          </div>
                          <span className="text-lg font-medium ml-4 shrink-0">
                            {question.cqDetails.question4 ? "৩" : "৪"}
                          </span>
                        </div>
                      )}

                      {/* Question d */}
                      {question.cqDetails.question4 && (
                        <div className="flex justify-between items-start text-gray-800 mb-2 ms-6">
                          <div className="flex items-start flex-1">
                            <span className="shrink-0 me-1 text-lg">ঘ.</span>
                            <div
                              className="text-black leading-relaxed flex-1"
                              style={{ fontSize: "1rem", lineHeight: "1.5" }}
                            >
                              {renderLatexContent(question.cqDetails.question4)}
                            </div>
                          </div>
                          <span className="text-lg font-medium ml-4 shrink-0">
                            ৪
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Answer and Explanation */}
                    {(isAnserShow || isDetailsShow) && (
                      <div className="space-y-1 mt-1">
                        {isAnserShow && (
                          <div className="flex flex-col items-baseline gap-2 mt-4">
                            <p className="text-xl font-bold underline underline-offset-1">
                              উত্তরপত্র ({toBanglaNumber(index + 1)}নং প্রশ্ন:
                              উ:)
                            </p>

                            {/* Answer a */}
                            <div className="flex items-start w-full">
                              <span className="border-1 rounded-full ps-2 pe-2 border-black bg-black text-white text-sm shrink-0 mt-1">
                                ক
                              </span>
                              <div
                                className="text-black leading-relaxed ms-2 flex-1"
                                style={{
                                  fontSize: "0.95rem",
                                  lineHeight: "1.5",
                                }}
                              >
                                {renderLatexContent(question.cqDetails.answer1)}
                              </div>
                            </div>

                            {/* Answer b */}
                            <div className="flex items-start w-full mt-2">
                              <div className="border-1 rounded-full ps-2 pe-2 border-black bg-black text-white text-sm shrink-0 mt-1 flex flex-col items-center justify-center min-h-[2rem]">
                                <span className="font-bold">খ</span>
                              </div>
                              <div
                                className="text-black leading-relaxed ms-2 flex-1"
                                style={{
                                  fontSize: "0.95rem",
                                  lineHeight: "1.5",
                                }}
                              >
                                {renderLatexContent(question.cqDetails.answer2)}
                              </div>
                            </div>

                            {/* Answer c */}
                            {question.cqDetails.answer3 && (
                              <div className="flex items-start w-full mt-2">
                                <div className="border-1 rounded-full ps-2 pe-2 border-black bg-black text-white text-sm shrink-0 mt-1 flex flex-col items-center justify-center min-h-[2rem]">
                                  <span className="font-bold">গ</span>
                                </div>
                                <div
                                  className="text-black leading-relaxed ms-2 flex-1"
                                  style={{
                                    fontSize: "0.95rem",
                                    lineHeight: "1.5",
                                  }}
                                >
                                  {renderLatexContent(
                                    question.cqDetails.answer3
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Answer d */}
                            {question.cqDetails.answer4 && (
                              <div className="flex items-start w-full mt-2">
                                <div className="border-1 rounded-full ps-2 pe-2 border-black bg-black text-white text-sm shrink-0 mt-1 flex flex-col items-center justify-center min-h-[2rem]">
                                  <span className="font-bold">ঘ</span>
                                </div>
                                <div
                                  className="text-black leading-relaxed ms-2 flex-1"
                                  style={{
                                    fontSize: "0.95rem",
                                    lineHeight: "1.5",
                                  }}
                                >
                                  {renderLatexContent(
                                    question.cqDetails.answer4
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {isDetailsShow && (
                          <div className="flex items-baseline gap-0">
                            <span className="solaimanlipi text-xl font-semibold shrink-0">
                              ব্যাখ্যা:
                            </span>
                            <span className="ms-2">
                              {renderLatexContent(question.explanation)}
                            </span>
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
      <Card className="hidden md:block w-full md:w-[300px] lg:w-[350px] bg-white shadow-lg p-5 sticky top-5 h-[calc(100vh-40px)] overflow-y-auto hover:scrollbar-thin hover:scrollbar-thumb-gray-500 hover:scrollbar-track-gray-200 print:hidden">
        <div className="space-y-4">
          <Button
            startContent={<SettingsIcon />}
            className="p-5 text-2xl"
            radius="none"
            variant="bordered"
          >
            প্রশ্ন এডিট
          </Button>

          {/* Print Layout Selection Section */}
          <div className="bg-[#dbfce7] rounded-lg p-4">
            <p className="text-xl font-light mb-2">
              প্রিন্ট লেআউট নির্বাচন করুন
            </p>
            <RadioGroup
              orientation="vertical"
              value={layout}
              onValueChange={setLayout}
              className="space-y-1"
            >
              <Radio value="a4">A4</Radio>
              <Radio value="letter">Letter</Radio>
              <Radio value="legal">Legal</Radio>
              <Radio value="a5">A5</Radio>
            </RadioGroup>

            <Button
              onClick={() => {
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
              }}
              className="text-lg bg-[#024544] text-white w-full"
            >
              প্রিন্ট করুন
            </Button>
          </div>

          <CustomSwitch
            label="উত্তরপত্র"
            isSelected={isAnserShow}
            onValueChange={setIsAnswerShow}
          />

          <CustomSwitch
            label="ব্যাখ্যা"
            isSelected={isDetailsShow}
            onValueChange={setIsDetailsShow}
          />

          <CustomSwitch
            label="এডিটিং মুড"
            isSelected={editingMode}
            onValueChange={setEditingMode}
          />

          <CustomSwitch
            label="শীট"
            isSelected={sheetMode}
            onValueChange={setSheetMode}
          />

          {sheetMode && (
            <div className="mt-4 space-y-4 border border-dashed border-blue-500 rounded-lg p-3">
              <p className="text-sm text-center text-gray-700">
                শীট তৈরির সেটিংসগুলো অটোমেটিক সেট থাকবে সবসময়।
              </p>

              {/* All other switches and inputs */}
              <CustomSwitch
                label="ইন্ট্রাক্টরের নাম"
                isSelected={instructorNameToggle}
                onValueChange={setInstructorNameToggole}
              />
              <CustomSwitch
                label="ইন্ট্রাক্টরের প্রোফাইল"
                isSelected={instructorProfileToggle}
                onValueChange={setInstructorProfileToggole}
              />
              <CustomSwitch
                label="লেকচার নম্বর"
                isSelected={lectureNumberToggle}
                onValueChange={setLectureNumberToggle}
              />
              <CustomSwitch
                label="লেকচার টপিক"
                isSelected={lectureTopicToggle}
                onValueChange={setLectureTopicToggle}
              />
              <CustomSwitch
                label="তারিখ"
                isSelected={dataToggle}
                onValueChange={setDataToggle}
              />

              <div>
                <label className="block mb-1">
                  ব্যাকগ্রাউন্ড কালার পছন্দ করুন
                </label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full h-10 border"
                />
              </div>

              <div>
                <label className="block mb-1">টেক্সট কালার পছন্দ করুন</label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full h-10 border"
                />
              </div>
            </div>
          )}

          <div
            onClick={handleShuffleQuestions}
            className="flex flex-row justify-between items-center bg-[#dbfce7] rounded-lg p-3 cursor-pointer"
          >
            <p className="solaimanlipi text-xl">শ্যাফেল</p>
            <Button
              isIconOnly
              className="bg-[#024544]"
              onPress={handleShuffleQuestions}
            >
              <ChangeIcon />
            </Button>
          </div>

          <div className="bg-[#dbfce7] rounded-lg p-4">
            <p className="text-xl font-light mb-2">কলাম সংখ্যা</p>
            <OptionStyleButtons
              options={columnOptions}
              currentStyle={columnNumber}
              onChange={setColumnNumber}
            />
          </div>

          <CustomSwitch
            label="ঠিকানা"
            isSelected={isShowAddress}
            onValueChange={setIsShowAddress}
          />

          <CustomSwitch
            label="জলছাপ"
            isSelected={isWaterMark}
            onValueChange={setIsWaterMark}
          />

          <div className="">
            {/* Toggle Switch */}
            <CustomSwitch
              label="ছবি যুক্ত জলছাপ"
              isSelected={isWaterMarkImage}
              onValueChange={setIsWaterMarkImage}
            />

            {/* Watermark settings */}
            {isWaterMarkImage && (
              <div className="p-4 border-1 border-dotted rounded-xl bg-gray-50 space-y-4 mt-4">
                {/* Image Upload */}
                <div>
                  <label className="block font-medium mb-2">
                    ওয়াটারমার্ক ছবি আপলোড করুন
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="block w-full border rounded-md p-2 cursor-pointer"
                  />
                  {uploading && (
                    <p className="text-sm text-blue-500 mt-1">Uploading...</p>
                  )}
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Watermark"
                      className="mt-3 w-32 h-32 object-contain border rounded-md"
                      style={{ opacity, width: `${imageSize}%` }}
                    />
                  )}
                </div>

                {/* Size Controller */}
                <div>
                  <label className="block font-medium mb-1">
                    ছবির সাইজ: {imageSize}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={imageSize}
                    onChange={(e) => setImageSize(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Opacity Controller */}
                <div>
                  <label className="block font-medium mb-1">
                    স্বচ্ছতা (Opacity): {Math.round(opacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>

          {isWaterMark && (
            <Textarea
              className="max-w-full"
              variant="bordered"
              placeholder="জলছাপের টেক্সট লিখুন"
              value={waterMarkText}
              onChange={(e) => setWaterMarkText(e.target.value)}
            />
          )}

          <CustomSwitch
            label="নির্দেশনা"
            isSelected={direction}
            onValueChange={setDirection}
          />

          <CustomSwitch
            label="বিষয়ের নাম"
            isSelected={questionSubjectName}
            onValueChange={setQuestionSubjectName}
          />

          <CustomSwitch
            label="অধ্যায়ের নাম"
            isSelected={chapterName}
            onValueChange={setChapterName}
          />

          <CustomSwitch
            label="সেট কোড"
            isSelected={setCodeInfo}
            onValueChange={setSetCodeInfo}
          />
        </div>
      </Card>
    </div>
  );
}
