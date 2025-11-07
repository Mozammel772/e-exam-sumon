import { useState } from "react";
import { MathJaxContext, MathJax } from "better-react-mathjax";
import LatexRenderer from "../../../../../utils/LatexRenderer";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button, Chip } from "@heroui/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Select, SelectItem } from "@heroui/select";

import sanitizeHtml from "sanitize-html";
import DeleteIcon from "../../../../assets/DeleteIcon";
import { useQuestionDeleteMutation } from "../../../../redux/api/slices/chapterSlice";
import Swal from "sweetalert2";
import EditIcon from "../../../../assets/EditIcon";

import { useNavigate } from "react-router-dom";

export const animals = [
  { key: "", label: "All" },
  { key: "MCQ", label: "MCQ" },
  { key: "CQ", label: "CQ" },
];

// Configure MathJax
const mathjaxConfig = {
  loader: { load: ["input/tex", "output/chtml"] },
  tex: {
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
    processEscapes: true,
  },
  asciimath: {
    delimiters: [["`", "`"]],
  },
  options: {
    enableMenu: false,
  },
  chtml: {
    scale: 1.1,
  },
};

export default function AddMcqQuestionModal({
  isOpen3,
  onOpenChange3,
  getASingleChapter,
  selectedChapterId,
}) {
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState("");
  const token = localStorage?.getItem("token");
  const [questionDelete, { isLoading }] = useQuestionDeleteMutation();

  const handleDeleteQuestion = async (questionId) => {
    const chapterId = getASingleChapter?._id;

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
    navigate(
      `/admin/chapter/update/${selectedChapterId}/question/${questionId}`
    );
  };

  const filteredQuestions = getASingleChapter?.questions?.filter(
    (q) => !selectedType || q.type === selectedType
  );

  console.log(getASingleChapter);
  // const showMcqQuestions

  // Configure HTML sanitizer to allow MathJax classes and attributes
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

  return (
    <div className="solaimanlipi">
      <Modal
        size="full"
        isOpen={isOpen3}
        onOpenChange={onOpenChange3}
        scrollBehavior="outside"
      >
        <ModalContent>
          {(onClose) => (
            <MathJaxContext config={mathjaxConfig}>
              <div className="flex justify-center items-center flex-col">
                <ModalHeader className="flex flex-col gap-1">
                  <p className="text-4xl font-bold text-center">
                    All MCQ Questions
                  </p>
                </ModalHeader>
                <ModalBody className="w-full">
                  <Select
                    className="max-w-xs"
                    label="Filter question by type"
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    {animals?.map((animal) => (
                      <SelectItem key={animal?.key}>{animal?.label}</SelectItem>
                    ))}
                  </Select>
                  <Table aria-label="Example static collection table">
                    <TableHeader>
                      <TableColumn>S.N</TableColumn>
                      <TableColumn>Chapter Name</TableColumn>
                      <TableColumn>Question</TableColumn>
                      <TableColumn>Answers</TableColumn>
                      <TableColumn>Explanation</TableColumn>
                      <TableColumn>Search Type</TableColumn>
                      <TableColumn>Question Level</TableColumn>
                      <TableColumn>Question Type</TableColumn>
                      <TableColumn>Actions</TableColumn>
                    </TableHeader>
                    <TableBody isLoading={isLoading}>
                      {filteredQuestions?.map((qus, index) => (
                        <TableRow key={qus?._id}>
                          <TableCell className="solaimanlipi text-xl font-bold">
                            {++index}
                          </TableCell>
                          <TableCell className="solaimanlipi text-xl font-bold">
                            {getASingleChapter?.chapterName}
                          </TableCell>

                          <TableCell className="solaimanlipi text-xl">
                            {/* <MathJax dynamic></MathJax> */}
                            <LatexRenderer
                              content={sanitizeHtml(qus?.questionName || "", {
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
                                  ],
                                  "*": ["style"],
                                },
                              })}
                            />
                          </TableCell>

                          <TableCell className="solaimanlipi text-xl">
                            {[
                              qus?.option1,
                              qus?.option2,
                              qus?.option3,
                              qus?.option4,
                            ].map((option, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-1"
                              >
                                <span>{index + 1}.</span>
                                <MathJax dynamic>
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: sanitizeHtml(
                                        option || "",
                                        sanitizeConfig
                                      ),
                                    }}
                                  />
                                </MathJax>
                              </div>
                            ))}

                            <div className="flex items-start gap-1 text-green-500 mt-2">
                              <span>Correct Ans.</span>
                              <MathJax dynamic>
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: sanitizeHtml(
                                      qus?.correctAnswer || "",
                                      sanitizeConfig
                                    ),
                                  }}
                                />
                              </MathJax>
                            </div>
                          </TableCell>

                          <TableCell className="solaimanlipi text-xl">
                            <MathJax dynamic>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: sanitizeHtml(qus?.explanation),
                                }}
                              />
                            </MathJax>
                          </TableCell>

                          <TableCell className="solaimanlipi text-xl">
                            {qus?.searchType?.map((type, index) => (
                              <p key={index}>{type}</p>
                            ))}
                          </TableCell>

                          <TableCell className="solaimanlipi text-xl">
                            {qus?.questionLevel}
                          </TableCell>

                          <TableCell className=" text-xl">
                            {qus?.type === "MCQ" ? (
                              <Chip color="primary">{qus?.type}</Chip>
                            ) : (
                              <Chip color="success">{qus?.type}</Chip>
                            )}
                          </TableCell>

                          <TableCell>
                            <div className="flex gap-3 items-center">
                              <Button
                                isLoading={isLoading}
                                onClick={() => handleDeleteQuestion(qus?._id)}
                                color="danger"
                                isIconOnly
                              >
                                <DeleteIcon size="20px" color="#ffffff" />
                              </Button>
                              <Button
                                isLoading={isLoading}
                                onClick={() => handleQuestionUpdate(qus?._id)}
                                color="success"
                                isIconOnly
                              >
                                <EditIcon size="20px" color="#ffffff" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </div>
            </MathJaxContext>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
