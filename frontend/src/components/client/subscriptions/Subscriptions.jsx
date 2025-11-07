import { cn } from "@heroui/react";
import { Checkbox } from "@heroui/checkbox";
import { Badge, Card } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useGetAllSubjectsQuery } from "../../../redux/api/slices/subjectSlice";
import ClientLoader from "../../../utils/loader/ClientLoader";
import { ReactTyped } from "react-typed";
import { useLocation } from "react-router-dom";
import { SubscriptionForm } from "./subscriptionForm/SubscriptionForm";
import { useGetASubscriptionInfoOfAnUserQuery } from "../../../redux/api/slices/subscriptionSlice";

//this price will be used for class 9 to 12
const GROUP_PRICES = {
  science: 399,
  general: 399,
  arts: 699,
  commerce: 399,
};

//this price will be used for class 6 to 8
const lowerClassPriceList = {
  general: 799,
};

export default function Subscriptions() {
  const email = localStorage?.getItem("email");
  const location = useLocation();
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [items, setItems] = useState([]);

  const GLOBAL_PRICE = 5000;

  const finalPrice = useMemo(() => {
    if (items.length === 3) {
      return 1799;
    }
    if (items.length === 4) {
      return 1799;
    }
    // default fallback
    return GLOBAL_PRICE;
  }, [items]);

  const [isGlobalSelected, setIsGlobalSelected] = useState(false);
  const [previousSelection, setPreviousSelection] = useState([]);

  const classNamesInBangla = {
    1: "প্রথম",
    2: "দ্বিতীয়",
    3: "তৃতীয়",
    4: "চতুর্থ",
    5: "পঞ্চম",
    6: "ষষ্ঠ",
    7: "সপ্তম",
    8: "অষ্টম",
    9: "নবম",
    10: "দশম",
    11: "একাদশ",
    12: "দ্বাদশ",
  };

  // Helper function to convert Bengali class names to numbers
  const convertBengaliToNumber = (bengaliClassName) => {
    const englishToBengali = {
      1: "প্রথম",
      2: "দ্বিতীয়",
      3: "তৃতীয়",
      4: "চতুর্থ",
      5: "পঞ্চম",
      6: "ষষ্ঠ",
      7: "সপ্তম",
      8: "অষ্টম",
      9: "নবম",
      10: "দশম",
      11: "একাদশ",
      12: "দ্বাদশ",
    };

    // Reverse the mapping to go from Bengali to English
    const bengaliToEnglish = Object.fromEntries(
      Object.entries(englishToBengali).map(([num, bengali]) => [
        bengali,
        parseInt(num),
      ])
    );

    // Check for direct match
    if (bengaliToEnglish[bengaliClassName]) {
      return bengaliToEnglish[bengaliClassName];
    }

    // Handle combined classes like "নবম, দশম"
    for (const [bengali, num] of Object.entries(bengaliToEnglish)) {
      if (bengaliClassName.includes(bengali)) {
        return num;
      }
    }

    return 0;
  };

  const { data: getAllSubjectsData, isLoading: subjectsLoader } =
    useGetAllSubjectsQuery();

  const { data: getASingleUserData, isLoading: singleUserLoader } =
    useGetASubscriptionInfoOfAnUserQuery(email);

  const purchasedPackageIds = getASingleUserData?.subscription?.packages || [];

  useEffect(() => {
    if (purchasedPackageIds.length > 0) {
      setSelectedSubjects(purchasedPackageIds);
    }
  }, [getASingleUserData]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const itemsParam = queryParams.get("class");
    if (itemsParam) {
      const itemsArray = itemsParam.split(",").map(Number);
      setItems(itemsArray);
    }
  }, [location.search]);

  // Global selection handler
  useEffect(() => {
    if (isGlobalSelected) {
      setPreviousSelection(selectedSubjects);
      const allIds = filteredSubjectsData?.map((s) => s._id) || [];
      setSelectedSubjects(allIds);
    } else if (!isGlobalSelected && previousSelection.length > 0) {
      setSelectedSubjects(previousSelection);
    }
  }, [isGlobalSelected]);

  const selectedClassNames = items.map((item) => classNamesInBangla[item]);
  const filteredSubjectsData = getAllSubjectsData?.filter((subject) =>
    selectedClassNames.includes(subject?.subjectClassName?.className)
  );

  // Grouping logic remains same
  const groupedSubjects = {};

  const nineTenSubjects = filteredSubjectsData?.filter(
    (s) =>
      s?.subjectClassName?.className === "নবম" ||
      s?.subjectClassName?.className === "দশম"
  );

  if (nineTenSubjects?.length) {
    groupedSubjects["নবম, দশম"] = nineTenSubjects.reduce((acc, curr) => {
      const group = curr.groupName;
      if (!acc[group]) acc[group] = [];
      acc[group].push(curr);
      return acc;
    }, {});
  }

  const otherClassSubjects = filteredSubjectsData?.filter(
    (s) =>
      s?.subjectClassName?.className !== "নবম" &&
      s?.subjectClassName?.className !== "দশম"
  );

  const otherClassGrouped = otherClassSubjects?.reduce((acc, curr) => {
    const className = curr.subjectClassName?.className;
    if (!acc[className]) acc[className] = {};
    const group = curr.groupName;
    if (!acc[className][group]) acc[className][group] = [];
    acc[className][group].push(curr);
    return acc;
  }, {});

  Object.assign(groupedSubjects, otherClassGrouped);

  const groupNameMap = {
    science: "বিজ্ঞান বিভাগ",
    general: "সাধারণ বিভাগ",
    arts: "মানবিক বিভাগ",
    commerce: "ব্যবসা বিভাগ",
  };

  const handleCheckboxChange = (id, isSelected) => {
    if (isGlobalSelected || purchasedPackageIds.includes(id)) return;
    setSelectedSubjects((prev) =>
      isSelected ? [...prev, id] : prev.filter((subjectId) => subjectId !== id)
    );
  };

  const handleGroupSelectAll = (subjectList, isSelected) => {
    if (isGlobalSelected) return;
    setSelectedSubjects((prev) => {
      const groupIds = subjectList.map((sub) => sub._id);
      // Filter out purchased subjects from group selection
      const nonPurchasedGroupIds = groupIds.filter(
        (id) => !purchasedPackageIds.includes(id)
      );
      return isSelected
        ? [...new Set([...prev, ...nonPurchasedGroupIds])]
        : prev.filter((id) => !nonPurchasedGroupIds.includes(id));
    });
  };

  const isGroupAllSelected = (subjectList) => {
    const nonPurchased = subjectList.filter(
      (s) => !purchasedPackageIds.includes(s._id)
    );
    return (
      nonPurchased.length > 0 &&
      nonPurchased.every((s) => selectedSubjects.includes(s._id))
    );
  };

  const toBengaliNumber = (number) => {
    return number.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);
  };

  const getClassBasePrice = (className) => {
    const classNum = convertBengaliToNumber(className);
    return classNum >= 6 && classNum <= 8 ? 150 : 199;
  };

  const calculateBaseAmount = () => {
    if (isGlobalSelected) return finalPrice;

    const selectedNonPurchased = selectedSubjects.filter(
      (id) => !purchasedPackageIds.includes(id)
    );

    let total = 0;

    selectedNonPurchased.forEach((id) => {
      const subject = filteredSubjectsData.find((s) => s._id === id);
      if (subject) {
        const className = subject.subjectClassName?.className;
        total += getClassBasePrice(className);
      }
    });
    Object.entries(groupedSubjects || {}).forEach(([classGroup, groups]) => {
      const classNum = convertBengaliToNumber(classGroup);

      Object.entries(groups).forEach(([groupName, subjects]) => {
        const nonPurchasedSubjects = subjects.filter(
          (s) => !purchasedPackageIds.includes(s._id)
        );

        if (
          nonPurchasedSubjects.length > 0 &&
          nonPurchasedSubjects.every((s) => selectedSubjects.includes(s._id))
        ) {
          const isLowerClass = classNum >= 6 && classNum <= 8;

          if (isLowerClass) {
            total -=
              nonPurchasedSubjects.length * getClassBasePrice(classGroup);
            total +=
              lowerClassPriceList[groupName] ||
              nonPurchasedSubjects.length * 150;
          } else {
            const groupPrice =
              GROUP_PRICES[groupName] || nonPurchasedSubjects.length * 199;
            const normalPrice = nonPurchasedSubjects.length * 199;
            total += groupPrice - normalPrice;
          }
        }
      });
    });

    return total;
  };

  const currentAmount = calculateBaseAmount();

  if (subjectsLoader || singleUserLoader) return <ClientLoader />;

  return (
    <div className="mt-32 container mx-auto solaimanlipi">
      <Badge.Ribbon
        text="নতুন সংস্করণ"
        style={{
          backgroundColor: "#e26062",
          fontFamily: "solaimanlipi",
          fontSize: "20px",
        }}
      >
        <Card className="mt-5 flex flex-col items-center text-center p-5 border-1 border-[#024645]">
          <p className="text-5xl solaimanlipi font-bold text-black">
            <span className="pil">SSC, HSC</span> সহ সকল শ্রেণীর জন্য{" "}
            <ReactTyped
              backSpeed={50}
              loop
              className="text-green-500"
              strings={[
                "প্রশ্ন তৈরী করুন!",
                " ডিজিটাল প্রশ্নব্যাংক",
                "বিষয়ভিত্তিক প্রশ্নব্যাংক",
                "স্মার্ট এক্সাম প্রিপারেশন ব্যাংক",
              ]}
              typeSpeed={40}
            />
          </p>

          <p className="solaimanlipi text-2xl font-bold text-black">
            সকল বিষয় এখানেই
          </p>
          <p className="solaimanlipi text-4xl font-bold text-[#ed1c24] mb-5">
            বিজ্ঞান, মানবিক, ব্যবসায় বিভাগ!
          </p>
        </Card>
      </Badge.Ribbon>

      <p className="solaimanlipi text-center mt-5 text-5xl font-bold text-blue-900 flex flex-wrap justify-center gap-y-3 leading-snug">
        {items.map((item, index) => (
          <span
            key={index}
            className="solaimanlipi text-5xl font-bold text-blue-800 flex items-center"
          >
            {classNamesInBangla[item] || `অজানা (${item})`}
            {index !== items.length - 1 && (
              <span className="mx-2 text-gray-400 text-4xl">-</span>
            )}
          </span>
        ))}

        <span className="solaimanlipi text-5xl font-bold text-red-600 ml-2">
          শ্রেণির সকল বিষয়সমূহ
        </span>
      </p>
      <p className="solaimanlipi text-2xl md:text-3xl font-semibold text-white bg-gradient-to-r from-red-600 to-red-400 px-4 py-2 rounded-xl shadow-md inline-block text-center">
        মেয়াদ: ৩৬৫ দিন
      </p>

      {/* Global Select All Checkbox */}
      <div className="my-8 p-4 bg-white rounded-xl border border-blue-200 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),_0_4px_6px_rgba(0,0,0,0.1)] transition-all duration-300">
        <Checkbox
          color="primary"
          isSelected={isGlobalSelected}
          onValueChange={setIsGlobalSelected}
          classNames={{
            base: cn(
              "inline-flex w-full max-w-full items-center justify-start",
              "cursor-pointer rounded-lg gap-3 px-5 py-4",
              "bg-gradient-to-br from-white via-blue-50 to-blue-100",
              "hover:from-blue-50 hover:to-white",
              "border border-blue-300 shadow-md",
              "transition-all duration-300 ease-in-out",
              "data-[selected=true]:ring-2 data-[selected=true]:ring-blue-500/50"
            ),
            label: "w-full",
          }}
        >
          <div className="w-full flex justify-between items-center gap-2 solaimanlipi text-xl">
            <p className="text-2xl font-bold text-blue-900">
              সকল বিষয় একসাথে নিন (বিশেষ ছাড়!)
            </p>
            <p className="solaimanlipi text-2xl font-bold text-red-600">
              {toBengaliNumber(finalPrice)} টাকা
            </p>
          </div>
        </Checkbox>
      </div>

      <div className="mt-10">
        {Object.entries(groupedSubjects || {})?.map(
          ([classGroup, groupSubjects]) => (
            <div
              key={classGroup}
              className="grid lg:grid-cols-1 md:grid-cols-1 sm:grid-cols-1 gap-10 w-full"
            >
              {Object?.entries(groupSubjects).map(([groupName, subjects]) => (
                <Card key={groupName} className="bg-[#dbfce7] mb-10 w-full">
                  <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold solaimanlipi">
                      {groupNameMap[groupName]}
                    </p>

                    <h2 className="solaimanlipi text-xl font-bold text-center">
                      ({classGroup} শ্রেণী)
                    </h2>

                    <Badge className="solaimanlipi text-xl" count="১০% ছাড়!">
                      <Checkbox
                        color="secondary"
                        isSelected={isGroupAllSelected(subjects)}
                        onValueChange={(val) =>
                          handleGroupSelectAll(subjects, val)
                        }
                        className="border-1 border-[#000000] rounded-lg bg-green-300"
                        isDisabled={isGlobalSelected}
                      >
                        {["ষষ্ঠ", "সপ্তম", "অষ্টম"].includes(classGroup) ? (
                          <p className="solaimanlipi text-xl font-bold">
                            সবগুলো{" "}
                            {toBengaliNumber(
                              lowerClassPriceList[groupName] ||
                                subjects.length * 150
                            )}{" "}
                            টাকা
                          </p>
                        ) : (
                          <p className="solaimanlipi text-xl font-bold">
                            সবগুলো{" "}
                            {toBengaliNumber(
                              GROUP_PRICES[groupName] || subjects.length * 199
                            )}{" "}
                            টাকা
                          </p>
                        )}
                      </Checkbox>
                    </Badge>
                  </div>

                  {subjects?.map((subject) => (
                    <div key={subject._id} className="mt-3">
                      <Checkbox
                        color="success"
                        isSelected={selectedSubjects.includes(subject._id)}
                        isDisabled={purchasedPackageIds.includes(subject._id)}
                        onValueChange={(val) =>
                          handleCheckboxChange(subject._id, val)
                        }
                        classNames={{
                          base: cn(
                            "inline-flex w-full max-w-full bg-content1",
                            "hover:bg-content2 items-center justify-start",
                            "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                            "data-[selected=true]:border-success"
                          ),
                          label: "w-full",
                        }}
                      >
                        <div className="w-full flex justify-between gap-2 solaimanlipi text-xl">
                          <p>{subject.subjectName}</p>
                          <p className="solaimanlipi text-xl">
                            {toBengaliNumber(
                              ["ষষ্ঠ", "সপ্তম", "অষ্টম"].includes(
                                subject.subjectClassName?.className
                              )
                                ? 150
                                : 199
                            )}{" "}
                            টাকা
                          </p>
                        </div>
                      </Checkbox>
                    </div>
                  ))}
                </Card>
              ))}
            </div>
          )
        )}
      </div>

      {/* Payment Section */}
      <SubscriptionForm
        selectedCount={selectedSubjects.length}
        selectedSubjects={selectedSubjects}
        currentAmount={currentAmount}
      />
    </div>
  );
}
