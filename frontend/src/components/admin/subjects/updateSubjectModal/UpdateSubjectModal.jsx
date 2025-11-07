import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Input } from "@heroui/input";
import { Button, Form } from "@heroui/react";
import { useState } from "react";
import {
  useGetASubjectQuery,
  useSubjectInfoUpdateMutation,
} from "../../../../redux/api/slices/subjectSlice";
import Swal from "sweetalert2";
export default function UpdateSubjectModal({
  onOpenChange2,
  isOpen2,
  changeSubjectId,
}) {
  const token = localStorage.getItem("token");
  const [changeSubjectName, setChangeSubjectName] = useState("");

  const { data: getASubjectData } = useGetASubjectQuery(changeSubjectId);

  const [subjectInfoUpdate, { isLoading }] = useSubjectInfoUpdateMutation();

  const handleChangeSubjectFormSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      subjectName: changeSubjectName,
    };
    try {
      const res = await subjectInfoUpdate({
        formData,
        token,
        changeSubjectId,
      });
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
    }
  };
  return (
    <div>
      <Modal isOpen={isOpen2} onOpenChange={onOpenChange2}>
        <ModalContent>
          {(onClose) => (
            <Form
              className="flex justify-center items-center"
              onSubmit={handleChangeSubjectFormSubmit}
            >
              <ModalHeader className="flex flex-col gap-1">
                Change a subject name
              </ModalHeader>
              <ModalBody className="w-full">
                <Input
                  onValueChange={(setValue) => setChangeSubjectName(setValue)}
                  isRequired
                  defaultValue={getASubjectData?.subjectName}
                  label="Update a subject name"
                  type="text"
                />
              </ModalBody>
              <ModalFooter>
                <Button isLoading={isLoading} color="success" type="submit">
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
