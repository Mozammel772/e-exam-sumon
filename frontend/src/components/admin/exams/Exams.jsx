import EditIcon from "../../../assets/EditIcon";
import DeleteIcon from "../../../assets/DeleteIcon";
import {
  Button,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@heroui/react";
import { useDisclosure } from "@heroui/modal";

import ClassCreateIcon from "../../../assets/ClassCreateIcon";
import CreateExamModal from "./createExamModal/CreateExamModal";
import {
  useExamDeleteMutation,
  useExamStatusUpdateMutation,
  useGetAllExamsQuery,
} from "../../../redux/api/slices/examSlice";
import ClientLoader from "../../../utils/loader/ClientLoader";
import Swal from "sweetalert2";
import { useState } from "react";

export default function Exams() {
  const token = localStorage?.getItem("token");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { data: getAllExamsData, isLoading: getExamsLoader } =
    useGetAllExamsQuery();
  const [examDelete, { isLoading: deleteLoader }] = useExamDeleteMutation();
  const [examStatusUpdate] = useExamStatusUpdateMutation();

  const handleExamDelete = async (examId) => {
    try {
      const res = await examDelete({ examId, token });
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
    }
  };

  const handleExamStatusUpdate = async (examId, status) => {
    const newStatus = {
      status: !status,
    };
    try {
      const res = await examStatusUpdate({ newStatus, token, examId });
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
    }
  };

  if (getExamsLoader) {
    return <ClientLoader />;
  }

  return (
    <div className="ms-[270px] mt-24 me-3">
      <p className="solaimanlipi text-center font-bold text-5xl pt-5">
        এক্সাম কন্ট্রোলিং{" "}
      </p>
      <div className="flex flex-row gap-3">
        <Tooltip content="Create an exam type">
          <Button
            size="lg"
            onPress={onOpen}
            isIconOnly
            className="mt-5 bg-[#024645]"
          >
            <ClassCreateIcon size="24px" color="#ffffff" />
          </Button>
        </Tooltip>
      </div>

      <CreateExamModal isOpen={isOpen} onOpenChange={onOpenChange} />

      <Table aria-label="Example static collection table" className="mt-5">
        <TableHeader>
          <TableColumn>EXAM NAME</TableColumn>
          <TableColumn>CREATED AT</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {getAllExamsData?.map((exam) => (
            <TableRow key={exam?._id}>
              <TableCell>
                <p className="solaimanlipi text-xl font-bold">
                  {exam?.examName}
                </p>
              </TableCell>
              <TableCell>{exam?.createdAt}</TableCell>
              <TableCell>
                <Switch
                  onChange={() =>
                    handleExamStatusUpdate(exam?._id, exam?.status)
                  }
                  isSelected={exam?.status}
                  defaultSelected
                  aria-label="Automatic updates"
                />
              </TableCell>
              <TableCell>
                <div className="flex flex-row gap-3">
                  <Button
                    onClick={() => handleExamDelete(exam?._id)}
                    isIconOnly
                    color="danger"
                    isLoading={deleteLoader}
                  >
                    <DeleteIcon size="24px" color="#ffffff" />
                  </Button>
                  <Button isIconOnly color="success">
                    <EditIcon size="24px" color="#ffffff" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
