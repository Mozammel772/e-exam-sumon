import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button, Input, Form } from "@heroui/react";
import { Select, SelectItem } from "@heroui/select";

import { useGetAllClassesQuery } from "../../../../redux/api/slices/classSlice";
import { useCreateASubjectMutation } from "../../../../redux/api/slices/subjectSlice";

import Swal from "sweetalert2";

export const group = [
  { key: "science", label: "বিজ্ঞান" },
  { key: "commerce", label: "ব্যবসা" },
  { key: "arts", label: "মানবিক" },
  { key: "general", label: "সাধারণ" },
];

export default function CreateSubjectModal({ isOpen1, onOpenChange1 }) {
  const token = localStorage.getItem("token");

  const [value, setValue] = useState(new Set([]));
  const [selectedGroup, setSelectedGroup] = useState(new Set([])); // or new Set() if nothing is selected by default
  const [subjectName, setSubjectName] = useState("");

  const { data: getAllClasses } = useGetAllClassesQuery();
  const [createASubject, { isLoading: subjectCreateLoader }] =
    useCreateASubjectMutation();

  const handleCreateSubjectForm = async (e) => {
    e.preventDefault();
    const formData = {
      subjectName: subjectName,
      subjectClassName: value?.currentKey,
      groupName: selectedGroup?.currentKey,
    };
    try {
      const res = await createASubject({ formData, token });
      if (res?.data) {
        Swal.fire({
          title: res?.data?.msg,
          icon: "success",
          showCloseButton: true,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          title: res?.error?.data?.msg,
          icon: "error",
          showCloseButton: true,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        title: error,
        icon: "error",
        showCloseButton: true,
        showConfirmButton: false,
      });
    } finally {
      setValue("");
      setSubjectName("");
      setSelectedGroup("");
    }

    console.log("formdata", formData);
  };
  return (
    <div>
      <Modal isOpen={isOpen1} onOpenChange={onOpenChange1}>
        <ModalContent>
          {(onClose) => (
            <Form
              onSubmit={handleCreateSubjectForm}
              className="flex justify-center items-center"
            >
              <ModalHeader className="flex flex-col gap-1">
                Create a subject
              </ModalHeader>
              <ModalBody className=" w-full">
                <Input
                  label="Subject name"
                  type="text"
                  className="solaimanlipi"
                  isRequired
                  onValueChange={(setvalue) => setSubjectName(setvalue)}
                  placeholder="e.g: বাংলা"
                />
                <Select
                  selectedKeys={value}
                  isRequired
                  className="max-w-full"
                  label="Select a class"
                  onSelectionChange={setValue}
                  classNames={{
                    label: "text-xl solaimanlipi",
                    trigger: "min-h-16 text-xl solaimanlipi",
                    value: "text-xl solaimanlipi",
                    listboxWrapper: "max-h-[400px]",
                    popoverContent: "text-xl solaimanlipi",
                  }}
                >
                  {getAllClasses?.map((animal) => (
                    <SelectItem
                      className="solaimanlipi text-xl"
                      key={animal?._id}
                      textValue={animal?.className}
                    >
                      <span className="text-xl">{animal?.className}</span>
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  isRequired
                  className="max-w-full"
                  label="Select a group name"
                  selectedKeys={selectedGroup}
                  onSelectionChange={setSelectedGroup}
                  classNames={{
                    label: "text-xl solaimanlipi",
                    trigger: "min-h-16 text-xl solaimanlipi",
                    value: "text-xl solaimanlipi",
                    listboxWrapper: "max-h-[400px]",
                    popoverContent: "text-xl solaimanlipi",
                  }}
                >
                  {group?.map((grp) => (
                    <SelectItem
                      className="solaimanlipi text-xl"
                      key={grp?.key}
                      textValue={grp?.label}
                    >
                      <span className="text-xl">{grp?.label}</span>
                    </SelectItem>
                  ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  isLoading={subjectCreateLoader}
                  type="submit"
                  color="success"
                >
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
