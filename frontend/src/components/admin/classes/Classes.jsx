import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Tooltip } from "@heroui/tooltip";
import { Switch } from "@heroui/switch";
import { useDisclosure } from "@heroui/modal";

import DeleteIcon from "../../../assets/DeleteIcon";
import { Button } from "@heroui/react";
import EditIcon from "../../../assets/EditIcon";
import ClassCreateIcon from "../../../assets/ClassCreateIcon";
import CreateClassModal from "./CreateClassModal";
import {
  useClassDeleteMutation,
  useClassUpdateMutation,
  useGetAllClassesQuery,
} from "../../../redux/api/slices/classSlice";
import { useState } from "react";
import Swal from "sweetalert2";
import UpdateClassModal from "./UpdateClassModal";

export default function Classes() {
  const token = localStorage.getItem("token");
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

  const [statusClass, setStatusClass] = useState();
  const [updateClassId, setUpdateClassId] = useState();

  const { data: getAllClassesData, isLoading } = useGetAllClassesQuery();
  const [classUpdate] = useClassUpdateMutation();
  const [classDelete, { isLoading: classDeleteLoader }] =
    useClassDeleteMutation();

  const handleClassStatusUpdate = async (classId, status) => {
    if (status === true) {
      setStatusClass(false);
    }
    if (status === false) {
      setStatusClass(true);
    }
    const classStatus = {
      status: statusClass,
    };
    try {
      const res = await classUpdate({ classStatus, token, classId });
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
    }
  };

  const handleDeleteAClass = async (classId) => {
    console.log("class id", classId);
    try {
      const res = await classDelete({ classId, token });
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
    }
  };

  const handleGetClassData = (classId) => {
    setUpdateClassId(classId);
  };

  return (
    <div className="ms-[270px] mt-24 me-3">
      <p className="solaimanlipi text-center font-bold text-5xl pt-5">
        ক্লাশ কন্ট্রোলিং{" "}
      </p>
      <Tooltip content="Create a class">
        <Button onPress={onOpen1} isIconOnly className="mt-5 bg-[#024645]">
          <ClassCreateIcon size="24px" color="#ffffff" />
        </Button>
      </Tooltip>

      <CreateClassModal isOpen1={isOpen1} onOpenChange1={onOpenChange1} />

      <Table aria-label="Example static collection table" className="mt-5">
        <TableHeader>
          <TableColumn>CLASS NAME</TableColumn>
          <TableColumn>CREATED AT</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody isLoading={isLoading}>
          {getAllClassesData?.map((cls, index) => (
            <TableRow key={cls._id || index}>
              <TableCell>
                <p className="solaimanlipi text-xl font-bold">
                  {cls?.className}
                </p>
              </TableCell>
              <TableCell>{cls?.createdAt}</TableCell>
              <TableCell>
                <Switch
                  isSelected={cls?.status}
                  aria-label="Automatic updates"
                  onValueChange={() =>
                    handleClassStatusUpdate(cls?._id, cls?.status)
                  }
                />
              </TableCell>
              <TableCell>
                <div className="flex flex-row gap-3">
                  <Button
                    onClick={() => handleDeleteAClass(cls?._id)}
                    isIconOnly
                    isLoading={classDeleteLoader}
                    color="danger"
                  >
                    <DeleteIcon size="24px" color="#ffffff" />
                  </Button>
                  <Button
                    onClick={() => handleGetClassData(cls?._id)}
                    onPress={onOpen2}
                    isIconOnly
                    color="success"
                  >
                    <EditIcon size="24px" color="#ffffff" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <UpdateClassModal
        isOpen2={isOpen2}
        onOpenChange2={onOpenChange2}
        updateClassId={updateClassId}
      />
    </div>
  );
}
