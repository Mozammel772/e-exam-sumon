import { useState, useEffect } from "react";
import { Card, Checkbox, cn, Input, Select, SelectItem } from "@heroui/react";
import { Button } from "@heroui/react";
import { Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ClearIcon from "../../../../../assets/ClearIcon";
import SearchIcon from "../../../../../assets/SearchIcon";

export default function FilterCard({
  searchKeyword,
  setSearchKeyword,
  getAnUserExamSets,
  selectedExamSets,
  handleExamSetToggle,
  allTopics,
  selectedTopics,
  setSelectedTopics,
  searchType,
  selectedTypes,
  handleTypeChange,
  filteredChapters,
  selectedChapters,
  handleChapterToggle,
  years,
  selectedYears,
  setSelectedYears,
  allBoard,
  selectedBoards,
  setSelectedBoards,
  SCHOOL_OPTIONS,
  selectedSchools,
  setSelectedSchools,
  questionTypes,
}) {
  const [width, setWidth] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setWidth(window.innerWidth);
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  console.log("questionTypes", questionTypes);

  const cardContent = (
    <Card className="w-full md:w-[300px] lg:w-[350px] bg-white shadow-lg p-5 h-[calc(100vh-40px)] overflow-y-auto scrollbar-hide hover:scrollbar-thin hover:scrollbar-thumb-gray-500 hover:scrollbar-track-gray-200">
      <Button className="p-5 text-2xl" radius="none" variant="bordered">
        অ্যাডভান্স ফিল্টার মেনু
      </Button>

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
        <p className="text-3xl font-bold text-center">স্মার্ট ফিল্টার</p>
        <p className="text-center text-xl mt-2">
          পূর্বের প্রশ্ন বাদ দিয়ে নতুন প্রশ্ন তৈরি করুন
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
                    <span className="solaimanlipi text-md text-default-700">
                      {examSet.title}
                    </span>
                  </div>
                </div>
              </Checkbox>
            </div>
          ))}
      </div>

      <p className="text-xl font-bold">টপিক অনুযায়ী ফিল্টার</p>
      <div className="mt-2 mb-2 border-1 border-[#024645] rounded-lg text-black">
        {allTopics?.length > 0 ? (
          <Select
            label={<p className="text-lg">একটি টপিকস নির্বাচন করুন</p>}
            selectionMode="multiple" // allows multiple selections like your checkboxes
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

      <p className="text-xl font-bold">স্মার্ট অনুসন্ধান</p>
      <div className="mt-2 mb-2 border-1 border-[#024645] rounded-lg text-black">
        {searchType?.map((type) => {
          return (
            <div key={type.key}>
              <Checkbox
                color="success"
                isSelected={selectedTypes?.includes(type.key)}
                onChange={() => handleTypeChange(type.key)}
              >
                <p className="text-xl">{type.label}</p>
              </Checkbox>
            </div>
          );
        })}
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
                isSelected={selectedChapters.includes(chapter._id.toString())}
                onChange={() => handleChapterToggle(chapter._id.toString())}
              >
                <p className="text-xl">{chapter?.chapterName}</p>
              </Checkbox>
            </div>
          </div>
        ))}
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
            onSelectionChange={(keys) => setSelectedYears(Array.from(keys))}
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
                        : [...prev, board.key]
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

      <div>
        <p className="text-xl mt-3 font-bold">শীর্ষস্থানীয় স্কুল</p>
        <div className="ps-3 pe-3 mt-2 mb-2 border-1 border-[#024645] rounded-lg text-black">
          {SCHOOL_OPTIONS?.map((school) => (
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
                <p className="text-xl">{school.label}</p>
              </Checkbox>
            </div>
          ))}

          {SCHOOL_OPTIONS?.length === 0 && (
            <p className="text-gray-500 text-center py-2">
              কোনো স্কুলের তথ্য পাওয়া যায়নি
            </p>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <>
      {/* Desktop view */}
      {width > 600 && <div className="sticky top-5">{cardContent}</div>}

      {/* Mobile button */}
      {width <= 600 && (
        <div className="fixed top-24 left-5 z-50 mb-3">
          <Button
            onClick={() => setOpen(true)}
            className="bg-[#024645] text-white p-2 rounded-full shadow-lg mb-3"
            size="icon"
            startContent={<Filter size={24} />}
          >
            {/* <p className="ms-2">Filter</p> */}
          </Button>
        </div>
      )}

      {/* Mobile panel */}
      <AnimatePresence>
        {open && width <= 600 && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed top-0 right-0 h-full w-4/5 sm:w-[350px] bg-white shadow-2xl z-50 overflow-y-auto"
          >
            <div className="flex justify-end p-3">
              <Button
                onClick={() => setOpen(false)}
                variant="ghost"
                className="rounded-full"
                size="icon"
              >
                ✕
              </Button>
            </div>
            {cardContent}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
