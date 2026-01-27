import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/react";
import { useGetAllClassesQuery } from "../../../redux/api/slices/classSlice";
import { useGetAllExamsQuery } from "../../../redux/api/slices/examSlice";
import { useGetAllSubjectsQuery } from "../../../redux/api/slices/subjectSlice";
import ClientLoader from "../../../utils/loader/ClientLoader";

import { useNavigate, useSearchParams } from "react-router-dom";

import { useGetExamSetWithCredentialsQuery } from "../../../redux/api/slices/examSetSlice";

export default function QuestionCreation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const qt = searchParams.get("qt");
  const pathParts = location.pathname.split("/");
  const examSetId = pathParts[4];
  const email = localStorage?.getItem("email");
  const { data: getAllSubjectsData, isLoading: allSubjectsLoader } =
    useGetAllSubjectsQuery();
  const { data: getAllClassData, isLoading: allClassLoader } =
    useGetAllClassesQuery();

  const { data: getAllExamData, isLoading: examLoader } = useGetAllExamsQuery();

  const {
    data: getExamSetWithAnUserCredentials,
    isLoading: credentialsLoader,
  } = useGetExamSetWithCredentialsQuery({ email, examSetId });

  const getSubject = getAllSubjectsData?.filter(
    (sub) => sub?._id === getExamSetWithAnUserCredentials?.examSet?.subjectName
  );

  const getClass = getAllClassData?.filter(
    (sub) => sub?._id === getExamSetWithAnUserCredentials?.examSet?.className
  );

  const getExam = getAllExamData?.filter(
    (sub) => sub?._id === getExamSetWithAnUserCredentials?.examSet?.examCategory
  );

  const handleClick = () => {
    const url = qt
      ? `/user/view-question/${examSetId}?qt=demo`
      : `/user/view-question/${examSetId}?qt=demo`;
    navigate(url);
  };
  const handleCqQuestion = () => {
    const url = qt
      ? `/user/view-cq/${examSetId}?qt=${qt}`
      : `/user/view-cq/${examSetId}`;
    navigate(url);
  };
  const handleShortQuestion = () => {
    const url = qt
      ? `/user/view-short/${examSetId}?qt=${qt}`
      : `/user/view-short/${examSetId}`;
    navigate(url);
  };

  if (allSubjectsLoader || allClassLoader || examLoader || credentialsLoader) {
    return <ClientLoader />;
  }
  return (
    <div className="solaimanlipi md:ms-[265px] md:me-[20px] flex justify-center items-center h-screen p-2">
      <Card className="w-full md:w-[550px] lg:w-[950px] ">
        <CardBody className="flex justify-center items-center pt-5 ps-3 pe-3 pb-5">
          <p className="text-xl md:text-2xl font-bold">
            {
              getExamSetWithAnUserCredentials?.userProfile?.addresses
                ?.organizations
            }
          </p>

          {getClass?.map((sub) => (
            <p key={sub?._id} className="text-xl md:text-2xl font-bold">
              {sub?.className} শ্রেণী
            </p>
          ))}
          <p className="text-base md:text-xl font-light">
            {getExamSetWithAnUserCredentials?.examSet?.examType}
          </p>
          {getSubject?.map((sub) => (
            <p key={sub?._id} className="text-base md:text-xl font-light">
              {sub?.subjectName}
            </p>
          ))}
          {getExam?.map((sub) => (
            <p key={sub?._id} className="text-base md:text-xl font-bold">
              {sub?.examName}
            </p>
          ))}
          <div className="flex justify-between w-full mt-1 mb-1">
            <p className="text-base md:text-xl font-light">সময়: ০০ মিনিট</p>
            <p className="text-base md:text-xl font-light">পূর্ণমাণ: ০০</p>
          </div>
          <Divider />
          <p className="text-base md:text-xl font-light mt-1 mb-1">
            প্রশ্নপত্রে কোনো প্রকার দাগ/চিহ্ন দেয়া যাবেনা।
          </p>
          <div className="mt-20 mb-20 flex justify-center items-center flex-col">
            <p className="text-center text-3xl font-bold text-[#024645]">
              ✔প্রশ্নসেট তৈরী হয়েছে!
            </p>
            <p className="text-center text-base md:text-xl font-lighter">
              নিচের বাটনে ক্লিক করে ডেটাবেজ থেকে প্রশ্ন যুক্ত করুন
            </p>
            {getExam?.map(
              (sub) =>
                sub?.examName === "বহুনির্বাচনি" && (
                  <Button
                    key={sub?._id}
                    className="bg-[#024645] text-white text-xl md:text-2xl mt-5 mb-5"
                    size="lg"
                    onPress={handleClick}
                    radius="full"
                  >
                    প্রশ্ন তৈরি করুন{" "}
                  </Button>
                )
            )}
            {getExam?.map(
              (sub) =>
                sub?.examName === "সৃজনশীল" && (
                  <Button
                    color="secondary"
                    key={sub?._id}
                    className="text-white text-xl md:text-2xl mt-5 mb-5"
                    size="lg"
                    onPress={handleCqQuestion}
                    radius="full"
                  >
                    প্রশ্ন তৈরি করুন{" "}
                  </Button>
                )
            )}
            {getExam?.map(
              (sub) =>
                sub?.examIdentifier === "short" && (
                  <Button
                    color="warning"
                    key={sub?._id}
                    className="text-white text-xl md:text-2xl mt-5 mb-5"
                    size="lg"
                    onPress={handleShortQuestion}
                    radius="full"
                  >
                    প্রশ্ন তৈরি করুন{" "}
                  </Button>
                )
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
