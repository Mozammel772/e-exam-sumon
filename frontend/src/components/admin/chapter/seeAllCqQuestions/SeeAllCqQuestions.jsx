import {
  useGetAChapterQuery,
  useQuestionDeleteMutation,
} from "../../../../redux/api/slices/chapterSlice";

import { Button } from "@heroui/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import LatexRenderer from "../../../../../utils/LatexRenderer";
import DeleteIcon from "../../../../assets/DeleteIcon";
import EditIcon from "../../../../assets/EditIcon";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

export default function SeeAllCqQuestions() {
  const pathParts = location.pathname.split("/");
  const chapterId = pathParts[5];
  const navigate = useNavigate();
  const token = localStorage?.getItem("token");

  const { data: getAChapterData, isLoading: getAChapterDataLoader } =
    useGetAChapterQuery(chapterId);
  const [questionDelete, { isLoading: deleteLoader }] =
    useQuestionDeleteMutation();

  const handleDeleteQuestion = async (questionId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this question?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result?.isConfirmed) {
      try {
        const res = await questionDelete({ chapterId, questionId, token });

        if (res?.data) {
          Swal.fire({
            title: res?.data?.msg,
            icon: "success",
            showCloseButton: true,
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            title: res?.error?.data?.msg || "Something went wrong",
            icon: "error",
            showCloseButton: true,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error?.message || "Something went wrong",
          icon: "error",
          showCloseButton: true,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };

  const handleQuestionUpdate = async (questionId) => {
    navigate(`/admin/chapter/cq/update/${chapterId}/question/${questionId}`);
  };

  // Function to organize and structure CQ content
  const organizeCQContent = (cqDetails) => {
    if (!cqDetails) return null;

    const organizedData = {
      mainQuestion: cqDetails.mainQuestion || "",
      subQuestions: [],
    };

    // Organize sub-questions and answers
    for (let i = 1; i <= 4; i++) {
      const question = cqDetails[`question${i}`];
      const answer = cqDetails[`answer${i}`];

      if (question || answer) {
        organizedData.subQuestions.push({
          number: i,
          question: question || "",
          answer: answer || "",
        });
      }
    }

    return organizedData;
  };

  const cqQuestions = (getAChapterData?.questions || [])
    .filter((qus) => qus?.type === "CQ")
    .map((qus, idx) => ({
      ...qus,
      sn: idx + 1,
      organizedData: organizeCQContent(qus?.cqDetails),
    }));

  return (
    <div className="ms-[270px] mt-24 me-3">
      <p className="text-center font-bold solaimanlipi text-4xl mt-3 mb-5">
        {getAChapterData?.chapterName}{" "}
        <span className="text-blue-600">
          ({getAChapterData?.questions?.filter((q) => q?.type === "CQ")?.length}{" "}
          CQ Questions)
        </span>
      </p>

      <div className="flex gap-3 flex-row mb-6">
        <Button
          color="primary"
          variant="solid"
          className="mb-4"
          onPress={() =>
            navigate(`/admin/see-all-questions/chapter/${chapterId}`)
          }
        >
          See MCQ Questions
        </Button>
        <Button
          color="secondary"
          variant="solid"
          className="mb-4"
          onPress={() =>
            navigate(`/admin/see-all-questions/short/chapter/${chapterId}`)
          }
        >
          See Short Questions
        </Button>
        <Button
          color="success"
          variant="solid"
          className="mb-4"
          onPress={() => navigate(-1)}
        >
          Go Back
        </Button>
      </div>

      <Table aria-label="CQ Questions Table" className="shadow-lg">
        <TableHeader>
          <TableColumn className="text-center">S.N</TableColumn>
          <TableColumn className="text-center">Main Question</TableColumn>
          <TableColumn className="text-center">
            Sub Questions & Answers
          </TableColumn>
          <TableColumn className="text-center">Topic</TableColumn>
          <TableColumn className="text-center">Board Exams</TableColumn>
          <TableColumn className="text-center">School Info</TableColumn>
          <TableColumn className="text-center">Search Type</TableColumn>
          <TableColumn className="text-center">Actions</TableColumn>
        </TableHeader>
        <TableBody
          isLoading={getAChapterDataLoader}
          items={cqQuestions}
          isEmpty={cqQuestions.length === 0}
          emptyContent={
            <div className="text-center text-gray-500 font-semibold py-6 text-xl">
              No CQ questions available in this chapter.
            </div>
          }
        >
          {(qus) => (
            <TableRow key={qus._id} className="hover:bg-gray-50">
              <TableCell className="text-center font-bold text-lg">
                {qus.sn}
              </TableCell>

              {/* Main Question */}
              <TableCell className="solaimanlipi text-lg min-w-[300px]">
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                  <div className="font-semibold text-blue-700 mb-2">
                    Main Question:
                  </div>
                  <LatexRenderer
                    content={qus?.organizedData?.mainQuestion}
                    className="text-gray-800 leading-relaxed"
                  />
                </div>
              </TableCell>

              {/* Sub Questions & Answers */}
              <TableCell className="solaimanlipi text-lg min-w-[400px]">
                <div className="space-y-4">
                  {qus?.organizedData?.subQuestions?.map((subQ, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 bg-white shadow-sm border-l-4 border-blue-500"
                    >
                      <div className="font-semibold text-green-700 mb-2 flex items-start">
                        <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2 mt-1">
                          {subQ.number}
                        </span>
                        <span>Question:</span>
                      </div>
                      <div className="mb-3 text-gray-800">
                        <LatexRenderer content={subQ.question} />
                      </div>

                      {subQ.answer && (
                        <>
                          <div className="font-semibold text-green-700 mb-2">
                            Answer:
                          </div>
                          <div className="border-l-3 border-green-500 pl-3 ml-1 bg-green-50 py-2 px-3 rounded">
                            <LatexRenderer content={subQ.answer} />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </TableCell>

              {/* Other table cells remain the same */}
              <TableCell className="text-center">
                {qus?.cqDetails?.topic ? (
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {qus.cqDetails.topic}
                  </span>
                ) : (
                  <span className="text-gray-400 text-sm">N/A</span>
                )}
              </TableCell>

              <TableCell className="solaimanlipi text-md">
                <div className="max-h-40 overflow-y-auto">
                  {qus?.boardExamList?.length > 0 ? (
                    <ul className="space-y-1">
                      {qus.boardExamList.map((item, idx) => (
                        <li
                          key={idx}
                          className="bg-yellow-50 text-yellow-800 px-2 py-1 rounded text-sm border border-yellow-200"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400 text-sm">
                      No board exams
                    </span>
                  )}
                </div>
              </TableCell>

              <TableCell className="solaimanlipi text-md">
                {qus?.schoolExamInfo ? (
                  <div className="bg-green-50 text-green-800 px-3 py-2 rounded border border-green-200">
                    {qus.schoolExamInfo}
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">N/A</span>
                )}
              </TableCell>

              <TableCell className="solaimanlipi text-md">
                <div className="space-y-1">
                  {qus?.searchType?.map((type, i) => (
                    <span
                      key={i}
                      className="block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm text-center"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </TableCell>

              <TableCell>
                <div className="flex gap-2 items-center justify-center">
                  <Button
                    isLoading={deleteLoader}
                    onPress={() => handleDeleteQuestion(qus?._id)}
                    color="danger"
                    isIconOnly
                    size="sm"
                    className="shadow"
                  >
                    <DeleteIcon size="18px" color="#ffffff" />
                  </Button>
                  <Button
                    onPress={() => handleQuestionUpdate(qus?._id)}
                    color="primary"
                    isIconOnly
                    size="sm"
                    className="shadow"
                  >
                    <EditIcon size="18px" color="#ffffff" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Add custom styles for LaTeX rendering */}
      <style jsx>{`
        .math-display {
          display: block;
          text-align: center;
          margin: 1rem 0;
          padding: 1rem;
          background-color: #f8f9fa;
          border-radius: 6px;
          overflow-x: auto;
        }
        .math-inline {
          display: inline;
          padding: 0.1rem 0.3rem;
          background-color: #e9ecef;
          border-radius: 3px;
          margin: 0 0.1rem;
        }
      `}</style>
    </div>
  );
}
