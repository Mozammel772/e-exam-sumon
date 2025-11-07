import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button, Form, Input } from "@heroui/react";
import { useState } from "react";
import {
  useClassInfoUpdateMutation,
  useGetAClassQuery,
} from "../../../redux/api/slices/classSlice";
import ClientLoader from "../../../utils/loader/ClientLoader";
import Swal from "sweetalert2";
export default function UpdateClassModal({
  isOpen2,
  onOpenChange2,
  updateClassId,
}) {
  const token = localStorage.getItem("token");
  const [className, setClassName] = useState();
  const [classIdentifier, setClassIdentifier] = useState();

  const { data: getAClassData, isLoading: getSingleClassLoader } =
    useGetAClassQuery(updateClassId);
  const [classInfoUpdate, { isLoading: updateClassInfoLoader }] =
    useClassInfoUpdateMutation();

  if (getSingleClassLoader) {
    return <ClientLoader />;
  }

  const handleUpdateClassForm = async (e) => {
    e.preventDefault();
    const formData = {
      className: className,
      classIdentifier: classIdentifier,
    };
    try {
      const res = await classInfoUpdate({ formData, token, updateClassId });
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
    console.log("formData", formData);
  };
  return (
    <div>
      <Modal isOpen={isOpen2} onOpenChange={onOpenChange2}>
        <ModalContent>
          {(onClose) => (
            <Form
              className="flex justify-center items-center"
              onSubmit={handleUpdateClassForm}
            >
              <ModalHeader className="flex flex-col gap-1">
                Update class info
              </ModalHeader>
              <ModalBody className="flex justify-center items-center w-full">
                <Input
                  onValueChange={(setValue) => setClassName(setValue)}
                  label="Class name"
                  defaultValue={getAClassData?.className}
                  type="text"
                  placeholder="e.g: ৬ষ্ঠ"
                  isRequired
                />
                <Input
                  label="Class identifier"
                  onValueChange={(setValue) => setClassIdentifier(setValue)}
                  type="text"
                  defaultValue={getAClassData?.classIdentifier}
                  placeholder="e.g: six"
                  isRequired
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  isLoading={updateClassInfoLoader}
                  type="submit"
                  color="success"
                >
                  Update
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
