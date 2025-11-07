import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Form,
} from "@heroui/react";

import { Select, SelectItem } from "@heroui/select";
import { useState } from "react";
import { useCreateAChapterMutation } from "../../../../redux/api/slices/chapterSlice";
import Swal from "sweetalert2";
import { useGetAllClassesQuery } from "../../../../redux/api/slices/classSlice";
import { useGetAllSubjectsQuery } from "../../../../redux/api/slices/subjectSlice";

export default function CreateChapterModal({ isOpen1, onOpenChange1 }) {
  const token = localStorage?.getItem("token");
  const [chapterName, setChapterName] = useState("");
  const [subject, setSubject] = useState("");
  const [classes, setClasses] = useState("");

  const [createAChapter, { isLoading }] = useCreateAChapterMutation();
  const { data: getAllMainClassData } = useGetAllClassesQuery();
  const { data: getAllSubjectsData } = useGetAllSubjectsQuery();

  const filterSubjects = getAllSubjectsData?.filter((subject) => {
    return subject?.subjectClassName?._id === classes?.currentKey;
  });
  const handleCreateChapterFormSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      chapterName: chapterName,
      subjectName: subject?.currentKey,
      subjectClassName: classes?.currentKey,
      status: true,
    };
    try {
      const res = await createAChapter({ formData, token });
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
          title: res?.error?.data?.msg,
          icon: "error",
          showCloseButton: true,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      Swal.fire({
        title: error,
        icon: "error",
        showCloseButton: true,
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setChapterName("");
      setSubject("");
      setClasses("");
    }
    // console.log("formData", formData);
  };

  return (
    <div>
      <Modal isOpen={isOpen1} onOpenChange={onOpenChange1}>
        <ModalContent>
          {(onClose) => (
            <Form
              onSubmit={handleCreateChapterFormSubmit}
              className="flex justify-center items-center"
            >
              <ModalHeader className="flex flex-col gap-1">
                Create a chapter
              </ModalHeader>
              <ModalBody className="w-full">
                <Input
                  label="Chapter name"
                  type="text"
                  placeholder="e.g: চ্যাপ্টার নাম লিখুন"
                  onValueChange={(setValue) => setChapterName(setValue)}
                />
                <Select
                  selectedKeys={classes}
                  onSelectionChange={setClasses}
                  className="max-w-full"
                  label="Select a class"
                >
                  {getAllMainClassData?.map((animal) => (
                    <SelectItem key={animal?._id}>
                      {animal?.className}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  selectedKeys={subject}
                  onSelectionChange={setSubject}
                  className="max-w-full"
                  label="Select a subject"
                >
                  {filterSubjects?.map((animal) => (
                    <SelectItem key={animal._id}>
                      {animal?.subjectName}
                    </SelectItem>
                  ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button isLoading={isLoading} color="success" type="submit">
                  Create
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
