import {
  Button,
  Card,
  Switch,
  cn,
  Textarea,
  RadioGroup,
  Radio,
} from "@heroui/react";
import SettingsIcon from "../../../../../../assets/SettingsIcon";
import ChangeIcon from "../../../../../../assets/ChangeIcon";
import OptionStyleButtons from "../../utils/optionStyleButtons/OptionStyleButtons";
import CustomSwitch from "../../utils/customSwitch/CustomSwitch";

const RightSidebar = ({
  layout,
  setLayout,
  isAnserShow,
  setIsAnswerShow,
  isDetailsShow,
  setIsDetailsShow,
  editingMode,
  setEditingMode,
  sheetMode,
  setSheetMode,
  handleShuffleQuestions,
  optionsStyle,
  setOptionsStyle,
  columnNumber,
  setColumnNumber,
  isShowAddress,
  setIsShowAddress,
  isWaterMark,
  setIsWaterMark,
  waterMarkText,
  setWaterMarkText,
  isWaterMarkImage,
  setIsWaterMarkImage,
  direction,
  setDirection,
  questionSubjectName,
  setQuestionSubjectName,
  chapterName,
  setChapterName,
  setCodeInfo,
  setSetCodeInfo,
  // Sheet mode props
  instructorNameToggle,
  setInstructorNameToggole,
  instructorProfileToggle,
  setInstructorProfileToggole,
  lectureNumberToggle,
  setLectureNumberToggle,
  lectureTopicToggle,
  setLectureTopicToggle,
  dataToggle,
  setDataToggle,
  bgColor,
  setBgColor,
  textColor,
  setTextColor,
  // Watermark image props
  size,
  setSize,
  opacity,
  setOpacity,
  imageUrl,
  setImageUrl,
  uploading,
  setUploading,
  handleImageUpload,
  handlePrint,
}) => {
  const options = ["○", ".", "( )", ")"];
  const columnOptions = [1, 2, 3];

  return (
    <Card className="w-full md:w-[300px] lg:w-[350px] bg-white shadow-lg p-5 sticky top-5 h-[calc(100vh-40px)] overflow-y-auto hover:scrollbar-thin hover:scrollbar-thumb-gray-500 hover:scrollbar-track-gray-200 print:hidden">
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
          <p className="text-xl font-light mb-2">প্রিন্ট লেআউট নির্বাচন করুন</p>
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
            onClick={handlePrint}
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
          <p className="text-xl font-light mb-2">অপশন স্টাইল</p>
          <OptionStyleButtons
            options={options}
            currentStyle={optionsStyle}
            onChange={setOptionsStyle}
          />
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

        <div className="">
          <CustomSwitch
            label="ছবি যুক্ত জলছাপ"
            isSelected={isWaterMarkImage}
            onValueChange={setIsWaterMarkImage}
          />

          {isWaterMarkImage && (
            <div className="p-4 border-1 border-dotted rounded-xl bg-gray-50 space-y-4 mt-4">
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
                    style={{ opacity, width: `${size}%` }}
                  />
                )}
              </div>

              <div>
                <label className="block font-medium mb-1">
                  ছবির সাইজ: {size}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full"
                />
              </div>

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
  );
};

export default RightSidebar;
