import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
} from "@heroui/react";
import { Input } from "@heroui/input";
import { useState } from "react";
import { useCreateAClassMutation } from "../../../redux/api/slices/classSlice";
import Swal from "sweetalert2";

export default function CreateClassModal({ isOpen1, onOpenChange1 }) {
  const token = localStorage.getItem("token");

  const [className, setClassName] = useState("");
  const [classIdentifier, setClassIdentifier] = useState("");

  const [createAClass, { isLoading: createClassLoader }] =
    useCreateAClassMutation();

  const handleClassFormSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      className: className,
      classIdentifier: classIdentifier,
      status: false,
    };

    try {
      const res = await createAClass({ formData, token });
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
      setClassName("");
      setClassIdentifier("");
    }
  };
  return (
    <div>
      <Modal isOpen={isOpen1} onOpenChange={onOpenChange1}>
        <ModalContent>
          {() => (
            <Form
              className="flex justify-center items-center"
              onSubmit={handleClassFormSubmit}
            >
              <ModalHeader className="flex flex-col gap-1">
                Create a class
              </ModalHeader>
              <ModalBody className="w-full">
                <Input
                  onValueChange={(setValue) => setClassName(setValue)}
                  label="Class name"
                  type="text"
                  isRequired
                  placeholder="e.g: ৬ষ্ঠ"
                />
                <Input
                  isRequired
                  label="Class identifier"
                  onValueChange={(setValue) => setClassIdentifier(setValue)}
                  type="text"
                  placeholder="e.g: six"
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="success"
                  type="submit"
                  isLoading={createClassLoader}
                  className="solaimanlipi text-xl text-white"
                >
                  ক্লাস তৈরি করুন
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
