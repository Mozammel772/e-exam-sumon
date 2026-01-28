import {
  Button,
  Card,
  cn,
  Radio,
  RadioGroup,
  Switch,
  Textarea,
  Tooltip,
} from "@heroui/react";
import { useWindowSize } from "@uidotdev/usehooks";
import axios from "axios";
import { useEffect, useState } from "react";
import Latex from "react-latex-next";
import { useNavigate } from "react-router";
import sanitizeHtml from "sanitize-html";
import AddIcon from "../../../../assets/AddIcon";
import ChangeIcon from "../../../../assets/ChangeIcon";
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

const toBanglaNumber = (number) => {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return number?.toString().replace(/\d/g, (digit) => banglaDigits[digit]);
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

const renderLatexContent = (content) => {
  if (!content) return null;

  // Decode HTML entities
  const decoded = content
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

  // Sanitize but allow table & image tags
  const safeHTML = sanitizeHtml(decoded, sanitizeConfig);

  // Enhanced LaTeX detection
  const hasLatex =
    /\\\(.*?\\\)|\$.*?\$|\\\[.*?\\\]|`.*?`|\\sqrt|\\frac|\\sum|\\int|\\alpha|\\beta|\\gamma|\\delta/.test(
      safeHTML,
    );

  if (hasLatex) {
    return (
      <span className="math-content">
        <Latex>{safeHTML}</Latex>
      </span>
    );
  }

  return <div dangerouslySetInnerHTML={{ __html: safeHTML }} />;
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
        "data-[selected=true]:border-[#024645]",
      ),
      wrapper: "p-0 h-4 overflow-visible",
      thumb: cn(
        "w-6 h-6 border-2 shadow-lg",
        "group-data-[hover=true]:border-[#024645]",
        "group-data-[selected=true]:ms-6",
        "group-data-[pressed=true]:w-7",
        "group-data-[selected]:group-data-[pressed]:ms-4",
      ),
    }}
  >
    <div className="flex flex-col gap-1">
      <p className="text-xl">{label}</p>
    </div>
  </Switch>
);

// const OptionStyleButtons = ({ options, currentStyle, onChange }) => (
//   <div className="flex gap-2">
//     {options?.map((option, index) => (
//       <button
//         key={index}
//         className={`w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg text-xl font-bold transition-all ${
//           currentStyle === option
//             ? "bg-green-700 text-white border-green-700"
//             : "bg-white hover:bg-gray-200"
//         }`}
//         onClick={() => onChange(option)}
//       >
//         {option}
//       </button>
//     ))}
//   </div>
// );

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

export default function ShortQuestionPaper() {
  const navigate = useNavigate();
  const size = useWindowSize();
  const token = localStorage?.getItem("token");
  const email = localStorage?.getItem("email");
  const pathParts = location.pathname.split("/");
  const examSetId = pathParts[3];

  const [layout, setLayout] = useState("a4");

  // State management
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
  const [isWaterMarkImage, setIsWaterMarkImage] = useState(false);
  const [imageSize, setImageSize] = useState(50);
  const [opacity, setOpacity] = useState(0.5);
  const [imageUrl, setImageUrl] = useState(
    localStorage.getItem("waterMarkImage") || "",
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

  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const cqQuestions = shuffledQuestions?.filter((t) => t?.type === "CQ");
  const shortQuestions = shuffledQuestions?.filter((t) => t?.type === "short");
  const mcqQuestions = shuffledQuestions?.filter((t) => t?.type === "MCQ");

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
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 right-4 text-gray-600"
            >
              ✕
            </button>

            <div className="space-y-4">
              <Button
                startContent={<SettingsIcon />}
                className="p-5 text-2xl"
                radius="none"
                variant="bordered"
              >
                প্রশ্ন এডিট
              </Button>

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
                        <p className="text-sm text-blue-500 mt-1">
                          Uploading...
                        </p>
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
            {findExam?.examName === "সংক্ষিপ্ত প্রশ্ন" ? (
              <>
                <Button
                  isIconOnly
                  className="bg-[#024544]"
                  onPress={() => navigate(`/user/view-short/${examSetId}`)}
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
          {size?.width < 600 ? (
            <Tooltip className="solaimanlipi print:hidden">
              <Button
                isIconOnly
                onPress={() => setIsSidebarOpen(true)}
                className="bg-[#024544] text-white p-4 rounded-full shadow-lg"
              >
                <SettingsIcon className="w-6 h-6" />{" "}
              </Button>
            </Tooltip>
          ) : (
            ""
          )}
        </div>
        {/* Header Information */}
        <div
          className={`text-center ${sheetMode ? "mb-2 print-colored" : "mb-2"}`}
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
              {exam?.examName === "সংক্ষিপ্ত প্রশ্ন" &&
                "সমন্বিত প্রশ্ন (সং. প্রশ্ন + সৃ. প্রশ্ন + বহু. প্রশ্ন)"}
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
                {/* সময়:{" "}
                {toBanglaNumber(
                  getASingleAllQuestionSets?.questionIds?.length * 15
                )}{" "}
                মিনিট */}
              </p>

              {setCodeInfo && (
                <p
                  className="text-lg text-center font-bold"
                  contentEditable={editingMode}
                >
                  সেট: <span contentEditable={editingMode}>ক</span>
                </p>
              )}

              <p className="text-md font-light">
                {/* পূর্ণমাণ:{" "}
                {toBanglaNumber(
                  getASingleAllQuestionSets?.questionIds?.length * 10
                )} */}
              </p>
            </div>

            {/* Instructions */}
            {direction && (
              <div className="text-center">
                <p
                  className="text-lg font-bold italic mt-1 mb-1"
                  contentEditable={editingMode}
                >
                  প্রশ্নপত্রে কোনো দাগ/চিহ্ন দেওয়া যাবে না।
                </p>
              </div>
            )}
          </>
        )}

        {/* Questions Section */}
        {/* Questions Section */}
        <div
          className="relative grid gap-4 px-2"
          style={{
            gridTemplateColumns: `repeat(${columnNumber}, minmax(0, 1fr))`,
          }}
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
                  width: `${size}%`,
                  maxWidth: "80%",
                  maxHeight: "80%",
                }}
              />
            </div>
          )}

          {mcqQuestions?.length > 0 && (
           <p className="col-span-full font-semibold text-md flex justify-between">
              <span>বহুনির্বাচনি প্রশ্ন: মান - </span>
              <span>
                {toBanglaNumber(mcqQuestions?.length)} x ১ ={" "}
                {toBanglaNumber(mcqQuestions?.length * 1)}
              </span>
            </p>
          )}

          {mcqQuestions?.map((question, index) => (
            <div
              key={question._id}
              className="relative z-10 w-full h-full ps-2 solaimanlipi question-container print-safe break-inside-avoid"
            >




              
              <div className="flex items-start gap-3 text-md font-light leading-relaxed">
  {/* Question number */}
  <span className="shrink-0">
    {toBanglaNumber(index + 1)}.
  </span>

  {/* Question content */}
  <div className="prose max-w-none whitespace-pre-line">
    {renderLatexContent(
      sanitizeHtml(
        (question?.questionName || "")
          .replace(/i\./g, "\ni.")
          .replace(/ii\./g, "\nii.")
          .replace(/iii\./g, "\niii.")
          .replace(/iv\./g, "\niv."),
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
            "br",
          ],
          allowedAttributes: {
            img: ["src", "alt", "width", "height", "loading"],
            "*": ["style"],
          },
        }
      )
    )}
  </div>
</div>






              {/* <div className="text-md font-light flex items-baseline gap-0">
                <span className="shrink-0 me-3">
                  {toBanglaNumber(index + 1)}.
                </span>

                {renderLatexContent(
                  sanitizeHtml(question?.questionName || "", {
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
                      img: ["src", "alt", "width", "height", "loading"],
                      "*": ["style"],
                    },
                  }),
                )}
              </div> */}

              {/* Options */}
              <div className="grid grid-cols-2 gap-y-2 mt-2 text-md ms-5">
                {[
                  { label: "ক", text: question?.option1 },
                  { label: "খ", text: question?.option2 },
                  { label: "গ", text: question?.option3 },
                  { label: "ঘ", text: question?.option4 },
                ].map((option, i) => (
                  <div key={i} className="break-inside-avoid text-md">
                    <p className="flex items-center">
                      <span className="flex items-center justify-center w-4 h-4 me-2 border border-black rounded-full">
                        {option.label}
                      </span>
                      {renderLatexContent(
                        sanitizeHtml(
                          (option.text || "").replace(/\n/g, "<br/>"),
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
                                "style",
                              ],
                              "*": ["style"],
                            },
                          },
                        ),
                      )}
                    </p>
                  </div>
                ))}
              </div>

              {/* Answer and Explanation */}
              {(isAnserShow || isDetailsShow) && (
                <div className="space-y-1 mt-1">
                  {isAnserShow && (
                    <div className="flex items-baseline gap-0">
                      <span className="solaimanlipi text-xl font-semibold shrink-0 me-1.5">
                        উত্তরঃ
                      </span>
                      {renderLatexContent(
                        sanitizeHtml(question.correctAnswer || "", {
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
                              "style",
                            ],
                            "*": ["style"],
                          },
                        }),
                      )}
                    </div>
                  )}

                  {isDetailsShow && (
                    <div className="flex items-baseline gap-0">
                      <span className="solaimanlipi text-xl font-semibold shrink-0">
                        ব্যাখ্যা:
                      </span>
                      <span className="ms-2">
                        {renderLatexContent(
                          sanitizeHtml(question.explanation || "", {
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
                                "style",
                              ],
                              "*": ["style"],
                            },
                          }),
                        )}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {shortQuestions?.length > 0 && (
            <p className="font-semibold text-md flex flex-row justify-between">
              <span>সংক্ষিপ্ত প্রশ্ন: মান - </span>
              <span>
                {toBanglaNumber(shortQuestions?.length)} x ২ ={" "}
                {toBanglaNumber(shortQuestions?.length * 2)}
              </span>
            </p>
          )}

          {shortQuestions?.map((short, id) => (
            <div key={short?._id}>
              <p className="text-lg flex flex-row items-center gap-2">
                {toBanglaNumber(++id)}.
                {renderLatexContent(short.shortQusDetails.shortQuestion)}
              </p>

              {isAnserShow && (
                <p className="flex flex-row gap-2">
                  <span className="font-semibold">উত্তর:</span>
                  {renderLatexContent(
                    short.shortQusDetails.shortQuestionAnswer,
                  )}
                </p>
              )}
            </div>
          ))}

          {cqQuestions?.length > 0 && (
            <p className="font-semibold text-md flex flex-row justify-between">
              সৃজনশীল প্রশ্ন: মান -{" "}
              <span>
                {toBanglaNumber(cqQuestions?.length)} x ১০ ={" "}
                {toBanglaNumber(cqQuestions?.length * 10)}
              </span>
            </p>
          )}

          {cqQuestions?.map((question, index) => (
            <div
              key={question._id}
              className="relative z-10 w-full h-full ps-2 solaimanlipi question-container print-safe break-inside-avoid"
            >
              {/* Question Text */}
              <div className="text-xl font-light flex items-baseline gap-0">
                <span className="shrink-0">{toBanglaNumber(index + 1)}.</span>
                <span className="ms-2">
                  {renderLatexContent(question.cqDetails.mainQuestion)}
                </span>
              </div>

              {/* Sub-questions */}
              <div className="space-y-4" contentEditable={editingMode}>
                {/* Question 1 */}
                {question.cqDetails.question1 && (
                  <div className="flex justify-between items-start text-gray-800 ms-5">
                    <span className="text-lg sm:text-xl flex flex-row items-center gap-1">
                      ক. {renderLatexContent(question.cqDetails.question1)}
                    </span>
                    <span className="text-lg sm:text-xl font-medium ml-4">
                      {question.cqDetails.question4
                        ? toBanglaNumber(1)
                        : toBanglaNumber(2)}
                    </span>
                  </div>
                )}

                {/* Question 2 */}
                {question.cqDetails.question2 && (
                  <div className="flex justify-between items-start text-gray-800 ms-5">
                    <span className="text-lg sm:text-xl flex flex-row items-center gap-1">
                      খ.{" "}
                      <span className="">
                        {renderLatexContent(question.cqDetails.question2)}
                      </span>
                    </span>
                    <span className="text-lg sm:text-xl font-medium ml-4">
                      {question.cqDetails.question4
                        ? toBanglaNumber(2)
                        : toBanglaNumber(4)}
                    </span>
                  </div>
                )}

                {/* Question 3 */}
                {question.cqDetails.question3 && (
                  <div className="flex justify-between items-start text-gray-800 ms-5">
                    <span className="text-lg sm:text-xl flex flex-row items-center gap-1">
                      গ. {renderLatexContent(question.cqDetails.question3)}
                    </span>
                    <span className="text-lg sm:text-xl font-medium ml-4">
                      {question.cqDetails.question4
                        ? toBanglaNumber(3)
                        : toBanglaNumber(4)}
                    </span>
                  </div>
                )}

                {/* Question 4 */}
                {question.cqDetails.question4 && (
                  <div className="flex justify-between items-start text-gray-800 ms-5">
                    <span className="text-lg sm:text-xl flex flex-row items-center gap-1">
                      ঘ. {renderLatexContent(question.cqDetails.question4)}
                    </span>
                    <span className="text-lg sm:text-xl font-medium ml-4">
                      {toBanglaNumber(4)}
                    </span>
                  </div>
                )}
              </div>

              {/* Answers */}
              {(isAnserShow || isDetailsShow) && (
                <div className="space-y-1 mt-1" contentEditable={editingMode}>
                  {isAnserShow && (
                    <div
                      className="flex flex-col items-baseline gap-0"
                      contentEditable={editingMode}
                    >
                      <p className="text-xl font-bold underline underline-offset-1">
                        উত্তরপত্র ({toBanglaNumber(index + 1)}নং প্রশ্ন: উ:)
                      </p>

                      {["answer1", "answer2", "answer3", "answer4"].map(
                        (ansKey, i) =>
                          question.cqDetails[ansKey] && (
                            <div
                              key={ansKey}
                              className="text-lg sm:text-xl flex flex-row gap-1 mt-3"
                              contentEditable={editingMode}
                            >
                              <p className="border-1 rounded-full ps-2 pe-2 border-black bg-black text-white flex flex-col gap-2 items-center justify-center">
                                <span className="font-bold">
                                  {["ক", "খ", "গ", "ঘ"][i]}
                                </span>
                                <span>নং</span>
                                <span>উ:</span>
                              </p>
                              <span className="text-black ms-1 text-wrap">
                                {renderLatexContent(question.cqDetails[ansKey])}
                              </span>
                            </div>
                          ),
                      )}
                    </div>
                  )}

                  {/* Explanation */}
                  {isDetailsShow && (
                    <div className="flex items-baseline gap-0">
                      <span className="solaimanlipi text-xl font-semibold shrink-0">
                        ব্যাখ্যা:
                      </span>
                      <span className="ms-2">
                        {renderLatexContent(question.explanation || "")}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
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
              onPress={() => {
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

          {/* <CustomSwitch
            label="ব্যাখ্যা"
            isSelected={isDetailsShow}
            onValueChange={setIsDetailsShow}
          /> */}

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

          <CustomSwitch
            label="ঠিকানা"
            isSelected={isShowAddress}
            onValueChange={setIsShowAddress}
          />
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
