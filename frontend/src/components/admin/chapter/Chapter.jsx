import { useState, useMemo, useEffect } from "react";

import EditIcon from "../../../assets/EditIcon";
import DeleteIcon from "../../../assets/DeleteIcon";
import {
  Button,
  Pagination,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@heroui/react";
import { useDisclosure } from "@heroui/modal";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";

import ClassCreateIcon from "../../../assets/ClassCreateIcon";
import CreateChapterModal from "./createChapterModal/CreateChapterModal";
import MoreIcon from "../../../assets/MoreIcon";
import {
  useChapterDeleteMutation,
  useChapterStatusUpdateMutation,
  useGetAChapterQuery,
  useGetAllChaptersQuery,
} from "../../../redux/api/slices/chapterSlice";
import Swal from "sweetalert2";
import UpdateChapter from "./updateChapter/UpdateChapter";
import AddMcqQuestionModal from "./addMcqQuestionModal/AddMcqQuestionModal";
import { Link } from "react-router";
import ClientLoader from "../../../utils/loader/ClientLoader";
import { useGetAllClassesQuery } from "../../../redux/api/slices/classSlice";
import { useGetAllSubjectsQuery } from "../../../redux/api/slices/subjectSlice";

import { useNavigate } from "react-router-dom";

export default function Chapter() {
  const token = localStorage?.getItem("token");
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onOpenChange: onOpenChange1,
  } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onOpenChange: onOpenChange2,
  } = useDisclosure();
  const {
    isOpen: isOpen3,
    onOpen: onOpen3,
    onOpenChange: onOpenChange3,
  } = useDisclosure();
  const {
    isOpen: isOpen4,
    onOpen: onOpen4,
    onOpenChange: onOpenChange4,
  } = useDisclosure();

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState({});

  const { data: getAllClassData } = useGetAllClassesQuery();
  const { data: getAllSubjects } = useGetAllSubjectsQuery();

  const className = useMemo(() => {
    const cls = getAllClassData?.find((c) => c._id === selectedClass);
    return cls?.className || null;
  }, [getAllClassData, selectedClass]);

  const filterSubjects = getAllSubjects?.filter((subject) => {
    return subject?.subjectClassName?.className === className;
  });

  const { data: getAllChapters, isLoading: chapterLoader } =
    useGetAllChaptersQuery({
      page,
      limit,
      className,
      subjectId: selectedSubject,
    });

  const [chapterDelete, { isLoading: deleteLoader }] =
    useChapterDeleteMutation();
  const [chapterStatusUpdate] = useChapterStatusUpdateMutation();
  const { data: getASingleChapter, isLoading: singleChapterLoader } =
    useGetAChapterQuery(selectedChapterId);

  const chapters = useMemo(
    () => getAllChapters?.chapters || [],
    [getAllChapters]
  );
  const totalPages = useMemo(
    () => getAllChapters?.totalPages || 1,
    [getAllChapters]
  );

  const distinctClasses = useMemo(
    () => getAllClassData || [],
    [getAllClassData]
  );

  useEffect(() => {
    setSelectedSubject(null);
  }, [selectedClass]);

  const handleDeleteChapter = async (chapterId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This chapter will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await chapterDelete({ chapterId, token });

        Swal.fire({
          title: res?.data?.msg || res?.error?.data?.msg || "Error",
          icon: res?.data ? "success" : "error",
          showCloseButton: true,
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        Swal.fire({
          title: error.message || "Something went wrong",
          icon: "error",
          showCloseButton: true,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };

  const handleChapterStatusUpdate = async (chapterId, status) => {
    const res = await chapterStatusUpdate({
      chapterId,
      token,
      formattedStatus: { status: !status },
    });
    Swal.fire({
      title: res?.data?.msg || res?.error?.data?.msg || "Error",
      icon: res?.data ? "success" : "error",
      showCloseButton: true,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const handleChapterInfoUpdate = (chapterId) => {
    navigate(`/admin/see-all-questions/chapter/${chapterId}`);
  };

  const handleChapterNameUpdate = (chapter) => {
    onOpen2();
    setSelectedChapter(chapter);
  };

  const handleGoToCQQuestion = (chapterId) => {
    navigate(`/admin/see-all-questions/cq/chapter/${chapterId}`);
  };
  const handleGoToShortQuestion = (chapterId) => {
    navigate(`/admin/see-all-questions/short/chapter/${chapterId}`);
  };

  if (chapterLoader || singleChapterLoader) {
    return <ClientLoader />;
  }

  return (
    <div className="ms-[270px] mt-24 me-3">
      <p className="solaimanlipi text-center font-bold text-5xl pt-5">
        চ্যাপ্টার এবং প্রশ্ন কন্ট্রোলিং
      </p>
      <div className="flex flex-row gap-3">
        <Tooltip content="Create a chapter">
          <Button
            size="lg"
            onPress={onOpen1}
            isIconOnly
            className="mt-5 bg-[#024645]"
          >
            <ClassCreateIcon size="24px" color="#ffffff" />
          </Button>
        </Tooltip>
        {/* Class Filter */}
        <div className="flex flex-row gap-3">
          <select
            value={selectedClass || ""}
            onChange={(e) => setSelectedClass(e.target.value || null)}
            className="mt-5 p-2 border rounded"
          >
            <option value="">All Classes</option>
            {distinctClasses.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.className} ({cls.classIdentifier})
              </option>
            ))}
          </select>

          <select
            value={selectedSubject || ""}
            onChange={(e) => setSelectedSubject(e.target.value || null)}
            disabled={!selectedClass}
            className="mt-5 p-2 border rounded"
          >
            <option value="">All Subjects</option>
            {filterSubjects?.map((subject) => (
              <option key={subject._id} value={subject._id}>
                {subject.subjectName} ({subject.groupName})
              </option>
            ))}
          </select>
        </div>
      </div>

      <CreateChapterModal isOpen1={isOpen1} onOpenChange1={onOpenChange1} />

      <Table aria-label="Filtered chapters" className="mt-5">
        <TableHeader>
          <TableColumn>S.N</TableColumn>
          <TableColumn>CHAPTER NAME</TableColumn>
          <TableColumn>SUBJECT NAME</TableColumn>
          <TableColumn>CLASS NAME</TableColumn>
          <TableColumn>CREATED AT</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody isLoading>
          {chapters.map((chapter, index) => (
            <TableRow key={index}>
              <TableCell>
                <p className="solaimanlipi text-xl font-bold">{++index}</p>
              </TableCell>
              <TableCell>
                <p className="solaimanlipi text-xl font-bold">
                  {chapter.chapterName}
                </p>
              </TableCell>
              <TableCell>
                <p className="solaimanlipi text-xl font-bold">
                  {chapter.subjectName?.subjectName}
                </p>
              </TableCell>
              <TableCell>
                <p className="solaimanlipi text-xl font-bold">
                  {chapter.subjectClassName?.className}
                </p>
              </TableCell>
              <TableCell>{chapter.createdAt}</TableCell>
              <TableCell>
                <Switch
                  isSelected={chapter.status}
                  onValueChange={() =>
                    handleChapterStatusUpdate(chapter._id, chapter.status)
                  }
                />
              </TableCell>
              <TableCell>
                <div className="flex flex-row gap-3">
                  <Button
                    onClick={() => handleDeleteChapter(chapter._id)}
                    isIconOnly
                    isLoading={deleteLoader}
                    color="danger"
                  >
                    <DeleteIcon size="24px" color="#ffffff" />
                  </Button>
                  <Button
                    onPress={() => handleChapterNameUpdate(chapter)}
                    isIconOnly
                    color="success"
                  >
                    <EditIcon size="24px" color="#ffffff" />
                  </Button>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button isIconOnly color="secondary">
                        <MoreIcon size="24px" color="#ffffff" />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="More options">
                      <DropdownItem
                        key="mcq"
                        color="primary"
                        onPress={onOpen3}
                        onClick={() => handleChapterInfoUpdate(chapter._id)}
                      >
                        See all MCQ questions
                      </DropdownItem>
                      <DropdownItem
                        key="mcq"
                        color="secondary"
                        onPress={onOpen3}
                        onClick={() => handleGoToCQQuestion(chapter._id)}
                      >
                        See all CQ questions
                      </DropdownItem>
                      <DropdownItem
                        key="short"
                        color="warning"
                        onPress={onOpen4}
                        onClick={() => handleGoToShortQuestion(chapter._id)}
                      >
                        See all short questions
                      </DropdownItem>
                      <DropdownItem
                        color="success"
                        className="text-success"
                        key="add-mcq"
                      >
                        <Link to={`add-question/mcq/${chapter._id}`}>
                          Add MCQ Questions
                        </Link>
                      </DropdownItem>
                      <DropdownItem
                        color="secondary"
                        className="text-secondary"
                        key="add-cq"
                      >
                        <Link to={`add-question/cq/${chapter._id}`}>
                          Add CQ Questions
                        </Link>
                      </DropdownItem>
                      <DropdownItem
                        color="warning"
                        className="text-warning"
                        key="add-cq"
                      >
                        <Link to={`add-question/short/${chapter._id}`}>
                          Add Short Questions
                        </Link>
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-center mt-6">
        <Pagination
          total={totalPages}
          initialPage={page}
          onChange={(newPage) => setPage(newPage)}
        />
      </div>

      <UpdateChapter
        isOpen2={isOpen2}
        onOpenChange2={onOpenChange2}
        selectedChapter={selectedChapter}
      />
      <AddMcqQuestionModal
        selectedChapterId={selectedChapterId}
        isOpen3={isOpen3}
        onOpenChange3={onOpenChange3}
        getASingleChapter={getASingleChapter}
      />
    </div>
  );
}
