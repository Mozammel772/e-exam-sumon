import {
  useGetAChapterQuery,
  useQuestionDeleteMutation,
} from "../../../../redux/api/slices/chapterSlice";
import Latex from "react-latex";
import "katex/dist/katex.min.css";

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
import sanitizeHtml from "sanitize-html";
import DeleteIcon from "../../../../assets/DeleteIcon";
import EditIcon from "../../../../assets/EditIcon";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import ClientLoader from "../../../../utils/loader/ClientLoader";

export default function SeeAllShortQuestion() {
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
    navigate(`/admin/chapter/short/update/${chapterId}/question/${questionId}`);
  };

  // Helper function to render LaTeX content
  const renderLatexContent = (content) => {
    if (!content) return null;

    // Check if content contains LaTeX expressions
    const hasLatex = /\\\(.*\\\)|\$.*\$|\\\[.*\\\]|`.*`/.test(content);

    if (hasLatex) {
      return <Latex>{content}</Latex>;
    }

    // If no LaTeX, render as plain HTML with sanitization
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(content, {
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
              "*": ["class", "style"],
            },
          }),
        }}
      />
    );
  };

  const shortQuestions = (getAChapterData?.questions || [])
    .filter((qus) => qus?.type === "short")
    .map((qus, idx) => ({ ...qus, sn: idx + 1 }));

  if (!shortQuestions) {
    return <ClientLoader />;
  }

  return (
    <div className="ms-[270px] mt-24 me-3">
      <p className="text-center font-bold solaimanlipi text-4xl mt-3 mb-5">
        {getAChapterData?.chapterName}
        {"-"}
        {getAChapterData?.questions?.filter((q) => q?.type === "short")?.length}
      </p>
      <div className="flex flex-row gap-3">
        <Button
          color="primary"
          className="mb-4"
          onPress={() =>
            navigate(`/admin/see-all-questions/chapter/${chapterId}`)
          }
        >
          See MCQ
        </Button>
        <Button
          color="primary"
          className="mb-4"
          onPress={() =>
            navigate(`/admin/see-all-questions/cq/chapter/${chapterId}`)
          }
        >
          See CQ
        </Button>
        <Button
          color="primary"
          className="mb-4"
          onPress={() =>
            navigate(`/admin/chapter/add-question/short/${chapterId}`)
          }
        >
          Add More Short Questions
        </Button>
      </div>

      <Table aria-label="CQ Questions Table">
        <TableHeader>
          <TableColumn>S.N</TableColumn>
          <TableColumn>Main Question</TableColumn>
          <TableColumn>Answer</TableColumn>
          <TableColumn>Topics</TableColumn>
          <TableColumn>Board Exam Info</TableColumn>
          <TableColumn>School Exam Info</TableColumn>
          <TableColumn>Search Type</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody
          isLoading={getAChapterDataLoader}
          items={shortQuestions}
          isEmpty={shortQuestions?.length === 0}
          emptyContent={
            <div className="text-center text-gray-500 font-semibold py-6">
              No Short questions available in this chapter.
            </div>
          }
        >
          {(qus) => (
            <TableRow key={qus._id}>
              <TableCell>{qus.sn}</TableCell>

              {/* Main Question */}
              <TableCell className="solaimanlipi text-xl">
                <div className="question-content">
                  {renderLatexContent(
                    qus?.shortQusDetails?.shortQuestion || ""
                  )}
                </div>
              </TableCell>

              {/* Answers */}
              <TableCell className="solaimanlipi text-xl">
                <div className="answer-content">
                  {renderLatexContent(
                    qus?.shortQusDetails?.shortQuestionAnswer || ""
                  )}
                </div>
              </TableCell>

              <TableCell>
                {qus?.shortQusDetails?.shortQuestionTopic ? (
                  <p>{qus?.shortQusDetails?.shortQuestionTopic}</p>
                ) : (
                  <p>N/A</p>
                )}
              </TableCell>

              {/* Board Exam Info */}
              <TableCell className="solaimanlipi text-xl">
                <ul className="list-disc list-inside">
                  {qus?.shortQusDetails?.boardExamList?.map((item, idx) => (
                    <li key={idx} className="text-nowrap">
                      {item}
                    </li>
                  ))}
                </ul>
              </TableCell>

              {/* School Exam Info */}
              <TableCell className="solaimanlipi text-xl">
                <div className="school-exam-content">
                  {renderLatexContent(qus?.schoolExamInfo || "")}
                </div>
              </TableCell>

              {/* Search Type */}
              <TableCell className="solaimanlipi text-xl">
                {qus?.searchType?.map((type, i) => (
                  <p key={i}>{type}</p>
                ))}
              </TableCell>

              {/* Actions */}
              <TableCell>
                <div className="flex gap-3 items-center">
                  <Button
                    isLoading={deleteLoader}
                    onPress={() => handleDeleteQuestion(qus?._id)}
                    color="danger"
                    isIconOnly
                  >
                    <DeleteIcon size="20px" color="#ffffff" />
                  </Button>
                  <Button
                    onPress={() => handleQuestionUpdate(qus?._id)}
                    color="success"
                    isIconOnly
                  >
                    <EditIcon size="20px" color="#ffffff" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Add CSS for better LaTeX rendering */}
      <style jsx>{`
        .question-content,
        .answer-content,
        .school-exam-content {
          line-height: 1.6;
        }
        .katex {
          font-size: 1.1em;
        }
        .katex-display {
          margin: 0.5em 0;
          overflow-x: auto;
          overflow-y: hidden;
        }
        .katex-display > .katex {
          display: inline-block;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}
