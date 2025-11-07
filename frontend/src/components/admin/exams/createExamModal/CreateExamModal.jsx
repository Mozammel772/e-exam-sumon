import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button, Form, Input } from "@heroui/react";
import { useState } from "react";
import { useCreateAExamMutation } from "../../../../redux/api/slices/examSlice";
import Swal from "sweetalert2";

export default function CreateExamModal({ isOpen, onOpenChange }) {
  const token = localStorage?.getItem("token");
  const [examInfo, setExamInfo] = useState({
    examName: "",
    examIdentifier: "",
  });

  const [createAExam, { isLoading }] = useCreateAExamMutation();

  const handleExamInputChange = (e) => {
    setExamInfo((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleExamInfoSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createAExam({ examInfo, token });
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
          title: res?.error?.errors?.message,
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
      setExamInfo({ examName: "", examIdentifier: "" });
    }
  };

  return (
    <div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <Form
              onSubmit={handleExamInfoSubmit}
              className="flex justify-center items-center"
            >
              <ModalHeader className="flex flex-col gap-1">
                Create an exam type
              </ModalHeader>
              <ModalBody className="w-full">
                <Input
                  label="Exam type name"
                  type="text"
                  name="examName"
                  value={examInfo?.examName}
                  onChange={handleExamInputChange}
                  placeholder="e.g: বহুনির্বাচনীয়"
                  className="text-xl"
                />
                <Input
                  label="Exam type identifier"
                  type="text"
                  name="examIdentifier"
                  value={examInfo?.examIdentifier}
                  onChange={handleExamInputChange}
                  placeholder="e.g: mcq"
                />
              </ModalBody>
              <ModalFooter>
                <Button isLoading={isLoading} type="submit" color="success">
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
