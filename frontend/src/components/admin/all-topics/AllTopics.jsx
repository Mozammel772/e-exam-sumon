import { Button, useDisclosure } from "@heroui/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";

import DeleteIcon from "../../../assets/DeleteIcon";
import EditIcon from "../../../assets/EditIcon";
import AddIcon from "../../../assets/AddIcon";
import CreateTopicsModal from "./createTopicsModal/CreateTopicsModal";
import { Select, SelectItem } from "@heroui/select";
import { useGetAllClassesQuery } from "../../../redux/api/slices/classSlice";
import { useState } from "react";
import { useGetAllSubjectsQuery } from "../../../redux/api/slices/subjectSlice";
import { useGetAllChaptersWithOutQueryQuery } from "../../../redux/api/slices/chapterSlice";
import {
  useGetAllTopicsQuery,
  useTopicDeleteMutation,
} from "../../../redux/api/slices/topicsSlice";
import Swal from "sweetalert2";
import UpdateTopicModal from "./updateTopicModal/UpdateTopicModal";
export default function AllTopics() {
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

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(null);

  const { data: getAllClassData } = useGetAllClassesQuery();
  const { data: getAllSubjectsData } = useGetAllSubjectsQuery();
  const { data: getAllChaptersData } = useGetAllChaptersWithOutQueryQuery();

  const { data: getAllTopics } = useGetAllTopicsQuery();
  const [topicDelete, { isLoading: deleteLoader }] = useTopicDeleteMutation();

  const filteredTopics = getAllTopics?.filter((topic) => {
    const matchClass = selectedClass ? topic.class === selectedClass : true;
    const matchSubject = selectedSubject
      ? topic.subject === selectedSubject
      : true;
    const matchChapter = selectedChapter
      ? topic.chapter === selectedChapter
      : true;
    return matchClass && matchSubject && matchChapter;
  });

  const handleDeleteATopic = async (topicId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await topicDelete(topicId);
          if (res?.data) {
            Swal.fire({
              title: "Topic Deleted",
              text: "The topic has been deleted successfully.",
              icon: "success",
            });
          } else {
            Swal.fire({
              title: "Error",
              text: res?.error?.data?.message || res?.error?.error,
              icon: "error",
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: error?.message,
            icon: "error",
          });
        }
      }
    });
  };

  return (
    <div className="ms-[270px] mt-24 me-3">
      <p className="solaimanlipi text-5xl pt-5 text-center">
        সকল টপিকস কন্ট্রোলিং
      </p>

      <div className="flex flex-row gap-3 mt-5 mb-5">
        <Button onPress={onOpen1} isIconOnly className="bg-[#024645]">
          <AddIcon size="20px" color="white" />
        </Button>
        <div className="flex w-80 flex-wrap md:flex-nowrap gap-4">
          <Select
            label="Select a Class"
            placeholder="Select a class"
            selectedKeys={selectedClass ? [selectedClass] : []}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            {getAllClassData?.map((classItem) => (
              <SelectItem key={classItem.className} value={classItem.className}>
                {classItem.className}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="flex w-80 flex-wrap md:flex-nowrap gap-4">
          <Select
            label="Select a Subject"
            placeholder="Select a subject"
            selectedKeys={selectedSubject ? [selectedSubject] : []}
            onChange={(e) => setSelectedSubject(e.target.value)}
            isDisabled={!selectedClass}
          >
            {getAllSubjectsData
              ?.filter(
                (subject) =>
                  subject?.subjectClassName?.className === selectedClass
              )
              ?.map((subject) => (
                <SelectItem
                  key={subject.subjectName}
                  value={subject.subjectName}
                >
                  {subject.subjectName}
                </SelectItem>
              ))}
          </Select>
        </div>

        <div className="flex w-80 flex-wrap md:flex-nowrap gap-4">
          <Select
            label="Select a Chapter"
            placeholder="Select a chapter"
            selectedKeys={selectedChapter ? [selectedChapter] : []}
            onChange={(e) => setSelectedChapter(e.target.value)}
            isDisabled={!selectedSubject}
          >
            {getAllChaptersData
              ?.filter(
                (chapter) =>
                  chapter?.subjectName?.subjectName === selectedSubject &&
                  chapter?.subjectClassName?.className === selectedClass
              )
              ?.map((chapter) => (
                <SelectItem
                  key={chapter.chapterName}
                  value={chapter.chapterName}
                >
                  {chapter.chapterName}
                </SelectItem>
              ))}
          </Select>
        </div>
      </div>

      <CreateTopicsModal onOpenChange1={onOpenChange1} isOpen1={isOpen1} />

      <Table aria-label="Example static collection table" className="mt-5 mb-5">
        <TableHeader>
          <TableColumn>S.N</TableColumn>
          <TableColumn>TOPICS NAME</TableColumn>
          <TableColumn>CHAPTER NAME</TableColumn>
          <TableColumn>SUBJECT NAME</TableColumn>
          <TableColumn>CLASS NAME</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {filteredTopics?.map((topic, index) => (
            <TableRow key={topic?._id} className="solaimanlipi">
              <TableCell className="text-xl">{++index}</TableCell>
              <TableCell className="text-xl">{topic?.topicsName}</TableCell>
              <TableCell className="text-xl">{topic?.chapter}</TableCell>
              <TableCell className="text-xl">{topic?.subject}</TableCell>
              <TableCell className="text-xl">{topic?.class}</TableCell>
              <TableCell className="flex gap-3">
                <Button
                  onPress={() => handleDeleteATopic(topic?._id)}
                  color="danger"
                  isIconOnly
                  isLoading={deleteLoader}
                >
                  <DeleteIcon size="20px" color="white" />
                </Button>
                <Button
                  onPress={() => {
                    setSelectedTopic(topic);
                    onOpen2();
                  }}
                  color="success"
                  isIconOnly
                >
                  <EditIcon size="20px" color="white" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <UpdateTopicModal
        isOpen2={isOpen2}
        onOpenChange2={onOpenChange2}
        topic={selectedTopic}
      />
    </div>
  );
}
