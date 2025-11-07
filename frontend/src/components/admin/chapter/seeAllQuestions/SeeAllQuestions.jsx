import {
  useGetAChapterQuery,
  useQuestionDeleteMutation,
} from "../../../../redux/api/slices/chapterSlice";
import Latex from "react-latex";

import { Button, Chip } from "@heroui/react";
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

export default function SeeAllQuestions() {
  const pathParts = location.pathname.split("/");
  const chapterId = pathParts[4];
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
          });
        } else {
          Swal.fire({
            title: res?.error?.data?.error || "Something went wrong",
            icon: "error",
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
    navigate(`/admin/chapter/update/${chapterId}/question/${questionId}`);
  };

  // Helper function to extract and render LaTeX content
  const renderLatexContent = (content) => {
    if (!content) return null;
    const latexRegex = /\$(.*?)\$|\\\((.*?)\\\)|\\\[(.*?)\\\]|`(.*?)`/g;

    if (latexRegex.test(content)) {
      return <Latex>{content}</Latex>;
    }

    return (
      <div
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(content, {
            allowedTags: [
              "p",
              "div",
              "span",
              "br",
              "strong",
              "em",
              "b",
              "i",
              "u",
              "sub",
              "sup",
              "img",
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

  // Helper function to render options with LaTeX
  const renderOptionsWithLatex = (options, correctAnswer) => {
    return (
      <div className="space-y-2">
        {options.map((option, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <span className="font-medium min-w-[20px]">
              {String.fromCharCode(65 + idx)}.
            </span>
            <div className="flex-1">{renderLatexContent(option)}</div>
          </div>
        ))}
        <div className="flex items-start gap-2 text-green-600 font-semibold mt-3 pt-2 border-t border-gray-200">
          <span className="min-w-[80px]">Correct:</span>
          <div className="flex-1">{renderLatexContent(correctAnswer)}</div>
        </div>
      </div>
    );
  };

  const mcqQuestions = (getAChapterData?.questions || [])
    .filter((qus) => qus?.type === "MCQ")
    .map((qus, idx) => ({ ...qus, sn: idx + 1 }));

  return (
    <div className="ms-[270px] mt-24 me-3">
      <p className="text-center font-bold solaimanlipi text-4xl mt-3 mb-5">
        {getAChapterData?.chapterName} (
        {getAChapterData?.questions?.filter((q) => q?.type === "MCQ")?.length})
      </p>
      <Button
        color="primary"
        className="mb-4"
        onPress={() =>
          navigate(`/admin/see-all-questions/cq/chapter/${chapterId}`)
        }
      >
        See CQ
      </Button>

      <Table aria-label="MCQ Questions Table">
        <TableHeader>
          <TableColumn>S.N</TableColumn>
          <TableColumn>Questions</TableColumn>
          <TableColumn>Answers</TableColumn>
          <TableColumn>Topic</TableColumn>
          <TableColumn>Explanation</TableColumn>
          <TableColumn>Board Exam List</TableColumn>
          <TableColumn>Search Type</TableColumn>
          <TableColumn>Question Level</TableColumn>
          <TableColumn>Question Type</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody
          isLoading={getAChapterDataLoader}
          items={mcqQuestions}
          isEmpty={mcqQuestions.length === 0}
          emptyContent={
            <div className="text-center text-gray-500 font-semibold py-6">
              No MCQ questions available in this chapter.
            </div>
          }
        >
          {(qus) => (
            <TableRow key={qus._id}>
              <TableCell>{qus.sn}</TableCell>

              {/* Question Column */}
              <TableCell className="solaimanlipi text-xl min-w-[300px]">
                <div className="question-content">
                  {renderLatexContent(qus?.questionName)}
                </div>
              </TableCell>

              {/* Answers Column */}
              <TableCell className="solaimanlipi text-xl min-w-[250px]">
                {renderOptionsWithLatex(
                  [qus?.option1, qus?.option2, qus?.option3, qus?.option4],
                  qus?.correctAnswer
                )}
              </TableCell>

              <TableCell>
                {qus?.topic ? (
                  <p className="solaimanlipi text-lg">{qus?.topic}</p>
                ) : (
                  <p>N/A</p>
                )}
              </TableCell>

              {/* Explanation Column */}
              <TableCell className="solaimanlipi text-xl min-w-[300px]">
                <div className="explanation-content">
                  {renderLatexContent(qus?.explanation)}
                </div>
              </TableCell>

              <TableCell className="solaimanlipi text-xl">
                {qus?.boardExamList?.map((exam, i) => (
                  <p key={i}>{exam}</p>
                ))}
              </TableCell>

              <TableCell className="solaimanlipi text-xl">
                {qus?.searchType?.map((type, i) => (
                  <p key={i}>{type}</p>
                ))}
              </TableCell>

              <TableCell className="solaimanlipi text-xl">
                {qus?.questionLevel}
              </TableCell>

              <TableCell className="text-xl">
                <Chip color="primary">{qus?.type}</Chip>
              </TableCell>

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
                    onClick={() => handleQuestionUpdate(qus?._id)}
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

      {/* Add CSS for LaTeX rendering */}
      <style jsx>{`
        .question-content,
        .explanation-content {
          line-height: 1.6;
        }
        .katex {
          font-size: 1.1em;
        }
        .katex-display {
          margin: 0.5em 0;
        }
      `}</style>
    </div>
  );
}
