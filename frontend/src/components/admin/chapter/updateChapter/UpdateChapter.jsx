import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDraggable,
} from "@heroui/modal";
import { Button, Form } from "@heroui/react";
import { Input } from "@heroui/input";

import { useEffect, useRef, useState } from "react";
import { useChapterInfoUpdateMutation } from "../../../../redux/api/slices/chapterSlice";
import Swal from "sweetalert2";

export default function UpdateChapter({
  onOpenChange2,
  isOpen2,
  selectedChapter,
}) {
  const token = localStorage?.getItem("token");

  const [chapterName, setChapterName] = useState("");

  const targetRef = useRef(null);
  const { moveProps } = useDraggable({ targetRef, isDisabled: !isOpen2 });

  const [chapterInfoUpdate, { isLoading }] = useChapterInfoUpdateMutation();

  useEffect(() => {
    // Update the state when getASingleChapter changes
    if (selectedChapter) {
      setChapterName(selectedChapter?.chapterName || "");
    }
  }, [selectedChapter]);

  const handleUpdateChapterInformation = async (e) => {
    e.preventDefault();
    const formData = {
      chapterName: chapterName,
      subjectName: selectedChapter?.subjectName?._id,
      className: selectedChapter?.subjectClassName?._id,
    };
    const chapterId = selectedChapter?._id;

    try {
      const res = await chapterInfoUpdate({ formData, token, chapterId });
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
    }

    // Send chapterName to your API here
  };

  return (
    <Modal ref={targetRef} isOpen={isOpen2} onOpenChange={onOpenChange2}>
      <ModalContent>
        {(onClose) => (
          <Form
            className="flex justify-center items-center"
            onSubmit={handleUpdateChapterInformation}
          >
            <ModalHeader {...moveProps} className="flex flex-col gap-1">
              Update Chapter
            </ModalHeader>
            <ModalBody className="w-full">
              <Input
                label="Chapter name"
                isRequired
                type="text"
                value={chapterName}
                onChange={(e) => setChapterName(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button isLoading={isLoading} type="submit" color="success">
                Update
              </Button>
            </ModalFooter>
          </Form>
        )}
      </ModalContent>
    </Modal>
  );
}
