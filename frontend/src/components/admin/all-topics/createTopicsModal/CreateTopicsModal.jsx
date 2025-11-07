import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  Input,
} from "@heroui/react";
import { useGetAllClassesQuery } from "../../../../redux/api/slices/classSlice";
import { useGetAllSubjectsQuery } from "../../../../redux/api/slices/subjectSlice";
import { useGetAllChaptersWithOutQueryQuery } from "../../../../redux/api/slices/chapterSlice";
import { useState } from "react";
import { useCreateATopicsMutation } from "../../../../redux/api/slices/topicsSlice";
import Swal from "sweetalert2";

export default function CreateTopicsModal({ onOpenChange1, isOpen1 }) {
  const { data: getAllClassData } = useGetAllClassesQuery();
  const { data: getAllSubjectsData } = useGetAllSubjectsQuery();
  const { data: getAllChaptersData } = useGetAllChaptersWithOutQueryQuery();

  const [createATopics, { isLoading }] = useCreateATopicsMutation();

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [topicName, setTopicName] = useState("");

  const handleSubmit = async () => {
    const formData = {
      class: selectedClass,
      subject: selectedSubject,
      chapter: selectedChapter,
      topicsName: topicName,
    };

    try {
      const res = await createATopics(formData);

      if (res?.data) {
        Swal.fire({
          title: "New topic created.",
          icon: "success",
        });
        onOpenChange1(false);
      } else {
        Swal.fire({
          title: res?.error?.data?.message || res?.error?.error,
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: error?.message,
        icon: "error",
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen1}
      onOpenChange={onOpenChange1}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <p className="solaimanlipi text-center text-2xl">
                একটি টপিক তৈরি করুন
              </p>
            </ModalHeader>
            <ModalBody className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select a Class
                </label>
                <Select
                  label="Select a Class"
                  placeholder="Select a class"
                  selectedKeys={selectedClass ? [selectedClass] : []}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  {getAllClassData?.map((classItem) => (
                    <SelectItem
                      key={classItem.className}
                      value={classItem.className}
                    >
                      {classItem.className}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Select a Subject
                </label>
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

              <div>
                <label className="block text-sm font-medium mb-1">
                  Select a Chapter
                </label>
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
                        chapter?.subjectName?.subjectName === selectedSubject
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

              <div>
                <label className="block text-sm font-medium mb-1">
                  Topic Name
                </label>
                <Input
                  type="text"
                  placeholder="Write a topics name of this chapter"
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  isDisabled={!selectedChapter}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                color="primary"
                isLoading={isLoading}
                onPress={handleSubmit}
                isDisabled={
                  !selectedClass ||
                  !selectedSubject ||
                  !selectedChapter ||
                  !topicName
                }
              >
                Create Topic
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
