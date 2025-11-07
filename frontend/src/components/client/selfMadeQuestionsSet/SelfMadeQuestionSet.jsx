import { useGetAllClassesQuery } from "../../../redux/api/slices/classSlice";
import {
  useExamSetDeleteMutation,
  useGetExamSetsAnUserQuery,
} from "../../../redux/api/slices/examSetSlice";
import { useGetAllExamsQuery } from "../../../redux/api/slices/examSlice";
import { useGetAllSubjectsQuery } from "../../../redux/api/slices/subjectSlice";
import ClientLoader from "../../../utils/loader/ClientLoader";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";

import { Chip } from "@heroui/chip";
import { Button } from "@heroui/react";

import EyeOpenIcon from "../../../assets/EyeOpenIcon";
import DeleteIcon from "../../../assets/DeleteIcon";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useWindowSize } from "@uidotdev/usehooks";

export default function SelfMadeQuestionSet() {
  const size = useWindowSize();

  const navigate = useNavigate();
  const email = localStorage?.getItem("email");
  const {
    data: getAnUserAllMadeQuestions,
    isLoading: singleUserQuestionsLoader,
  } = useGetExamSetsAnUserQuery(email);
  const { data: getAllClass } = useGetAllClassesQuery();
  // const { data: getSubjectsData, isLoading: subjectLoader } =
  //   useGetAllSubjectsQuery();
  const { data: getSubjectsData } = useGetAllSubjectsQuery();
  const { data: getAllExamData } = useGetAllExamsQuery();

  const [examSetDelete, { isLoading: deleteLoader }] =
    useExamSetDeleteMutation();

  const handleQuestionSetDelete = async (examSetId) => {
    const confirmResult = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "আপনি এই প্রশ্ন সেটটি ডিলিট করতে চান?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, ডিলিট করুন!",
      cancelButtonText: "না",
      reverseButtons: true,
    });

    if (confirmResult.isConfirmed) {
      try {
        const res = await examSetDelete(examSetId);

        if (res?.data) {
          Swal.fire({
            title: "প্রশ্ন সেট ডিলিট হয়েছে",
            icon: "success",
            showCloseButton: true,
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            title: res?.error?.data?.message || "কিছু ভুল হয়েছে",
            icon: "error",
            showCloseButton: true,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } catch (error) {
        Swal.fire({
          title: error?.message || "ডিলিট করতে ব্যর্থ হয়েছে",
          icon: "error",
          showCloseButton: true,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };

  if (singleUserQuestionsLoader) {
    return <ClientLoader />;
  }
  return (
    <div
      className={`mt-24 me-3 solaimanlipi ${
        size?.width <= 600 ? "ms-3" : "ms-[270px]"
      }`}
    >
      <p className="pt-8 mb-5 solaimanlipi text-5xl text-center font-bold">
        আমার তৈরি প্রশ্নসমূহ
      </p>
      <Table aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>
            <p className="text-lg">টাইটেল</p>
          </TableColumn>
          <TableColumn>
            <p className="text-lg">ক্লাস</p>
          </TableColumn>
          <TableColumn>
            <p className="text-lg">সাবজেক্ট</p>
          </TableColumn>
          <TableColumn>
            <p className="text-lg">চ্যাপ্টার</p>
          </TableColumn>
          <TableColumn>
            <p className="text-lg">ধরণ</p>
          </TableColumn>
          <TableColumn>
            <p className="text-lg">অ্যাকশনস</p>
          </TableColumn>
        </TableHeader>
        <TableBody isLoading={singleUserQuestionsLoader}>
          {getAnUserAllMadeQuestions?.examSets?.map((qus) => {
            const matchedClass = getAllClass?.find(
              (cls) => cls?._id === qus?.className
            );
            const matchedSubject = getSubjectsData?.find(
              (sub) => sub?._id === qus?.subjectName
            );

            const matchedExam = getAllExamData?.find(
              (exam) => exam?._id === qus?.examCategory
            );

            return (
              <TableRow key={qus?._id}>
                <TableCell className="text-lg">{qus?.title}</TableCell>
                <TableCell className="text-xl">
                  {matchedClass?.className || "N/A"}
                </TableCell>
                <TableCell className="text-xl">
                  {matchedSubject?.subjectName || "N/A"}
                </TableCell>
                <TableCell className="text-xl">
                  {qus?.chapterId
                    ?.map(
                      (chapter, index) =>
                        `${index + 1}. ${chapter?.chapterName}`
                    )
                    ?.join(", ")}
                </TableCell>

                <TableCell>
                  {matchedExam?.examIdentifier === "mcq" ? (
                    <Chip className="text-lg" color="success">
                      বহুনির্বাচনি
                    </Chip>
                  ) : matchedExam?.examIdentifier === "short" ? (
                    <Chip className="text-lg" color="warning">
                      সংক্ষিপ্ত প্রশ্ন
                    </Chip>
                  ) : (
                    <Chip className="text-lg" color="secondary">
                      সৃজনশীল
                    </Chip>
                  )}
                </TableCell>

                <TableCell className="flex gap-3">
                  {matchedExam?.examIdentifier === "mcq" && (
                    <Button
                      isIconOnly
                      color="success"
                      onPress={() =>
                        navigate(`/user/question-paper/${qus?._id}`)
                      }
                    >
                      <EyeOpenIcon size="20px" color="#000000"></EyeOpenIcon>
                    </Button>
                  )}
                  {matchedExam?.examIdentifier === "cq" && (
                    <Button
                      isIconOnly
                      color="secondary"
                      onPress={() =>
                        navigate(`/user/cq-question-paper/${qus?._id}`)
                      }
                    >
                      <EyeOpenIcon size="20px" color="#ffffff"></EyeOpenIcon>
                    </Button>
                  )}
                  {matchedExam?.examIdentifier === "short" && (
                    <Button
                      isIconOnly
                      color="warning"
                      onPress={() =>
                        navigate(`/user/short-question-paper/${qus?._id}`)
                      }
                    >
                      <EyeOpenIcon size="20px" color="#ffffff"></EyeOpenIcon>
                    </Button>
                  )}

                  <Button
                    isLoading={deleteLoader}
                    isIconOnly
                    color="danger"
                    onClick={() => handleQuestionSetDelete(qus?._id)}
                  >
                    <DeleteIcon size="20px" color="#ffffff"></DeleteIcon>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
