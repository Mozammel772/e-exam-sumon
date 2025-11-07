import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
} from "@heroui/react";

import { Textarea } from "@heroui/input";
import { useState } from "react";
import { useCreateAAnnouncementMutation } from "../../../../redux/api/slices/AnnouncementSlice";
import Swal from "sweetalert2";
export default function CreateAnnounceModal({ isOpen, onOpenChange }) {
  const token = localStorage?.getItem("token");
  const [value, setValue] = useState("");

  const [createAAnnouncement, { isLoading }] = useCreateAAnnouncementMutation();

  const handleMessageFormSubmit = async (e) => {
    e.preventDefault();
    const message = {
      message: value,
    };
    try {
      const res = await createAAnnouncement({ message, token });
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
      setValue("");
    }
    console.log("message value", message);
  };
  return (
    <div>
      <Modal size="xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <Form
              onSubmit={handleMessageFormSubmit}
              className="flex justify-center items-center"
            >
              <ModalHeader className="flex flex-col gap-1">
                Make an announcement
              </ModalHeader>
              <ModalBody className="w-full">
                <Textarea
                  isRequired
                  isClearable
                  disableAutosize
                  value={value}
                  onValueChange={setValue}
                  classNames={{
                    base: "max-w-xs",
                    input: "resize-y min-h-[40px]",
                  }}
                  className="max-w-full"
                  label="Announcement"
                  placeholder="Enter your message"
                />
              </ModalBody>
              <ModalFooter>
                <Button isLoading={isLoading} type="submit" color="success">
                  Announce
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
