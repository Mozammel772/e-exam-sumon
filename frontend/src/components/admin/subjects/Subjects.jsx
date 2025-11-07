import { useState } from "react";
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
import { Select, SelectItem } from "@heroui/select";
import { useDisclosure } from "@heroui/modal";

import ClassCreateIcon from "../../../assets/ClassCreateIcon";
import CreateSubjectModal from "./createSubjectModal/CreateSubjectModal";
import {
  useGetAllSubjectsQuery,
  useSubjectDeleteMutation,
  useSubjectStatusUpdateMutation,
} from "../../../redux/api/slices/subjectSlice";
import { useGetAllClassesQuery } from "../../../redux/api/slices/classSlice";
import Swal from "sweetalert2";
import UpdateSubjectModal from "./updateSubjectModal/UpdateSubjectModal";

import ClientLoader from "../../../../src/utils/loader/ClientLoader";

export default function Subjects() {
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
  const [value, setValue] = useState(new Set([]));
  const [changeSubjectId, setChangeSubjectId] = useState("");

  const { data: getAllSubjectsData, isLoading: getAllSubjectsLoader } =
    useGetAllSubjectsQuery();

  const { data: getAllClassesData } = useGetAllClassesQuery();

  const [subjectDelete, { isLoading: deleteSubjectLoader }] =
    useSubjectDeleteMutation();

  const [subjectStatusUpdate] = useSubjectStatusUpdateMutation();

  if (getAllSubjectsLoader) {
    return <ClientLoader />;
  }

  // here this function is for delete a subject
  const handleDeleteSubject = async (subjectId) => {
    try {
      const res = await subjectDelete({ subjectId, token });
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
    // console.log("subject id", subjectId);
  };

  // here this function is for update subject status
  const handleClassStatusUpdate = async (subjectId, status) => {
    if (status === true) {
      setStatusClass(false);
    }
    if (status === false) {
      setStatusClass(true);
    }
    const subjectStatus = {
      status: statusClass,
    };
    try {
      const res = await subjectStatusUpdate({
        subjectStatus,
        token,
        subjectId,
      });
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

  return (
    <div className="ms-[270px] mt-24 me-3">
      <p className="solaimanlipi text-center font-bold text-5xl pt-5">
        সাবজেক্ট কন্ট্রোলিং{" "}
      </p>
      <div className="flex flex-row gap-3">
        <Tooltip content="Create a subject">
          <Button
            size="lg"
            onPress={onOpen1}
            isIconOnly
            className="mt-5 bg-[#024645]"
          >
            <ClassCreateIcon size="24px" color="#ffffff" />
          </Button>
        </Tooltip>
        <Select
          selectedKeys={value}
          onSelectionChange={setValue}
          size="sm"
          className="max-w-xs mt-5"
          label="Filter with class"
        >
          {getAllClassesData?.map((animal) => (
            <SelectItem key={animal?.className}>{animal.className}</SelectItem>
          ))}
        </Select>
      </div>

      <CreateSubjectModal isOpen1={isOpen1} onOpenChange1={onOpenChange1} />

      <Table aria-label="Example static collection table" className="mt-5">
        <TableHeader>
          <TableColumn>CLASS NAME</TableColumn>
          <TableColumn>SUBJECT NAME</TableColumn>
          <TableColumn>GROUP NAME</TableColumn>
          <TableColumn>CREATED AT</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody isLoading={getAllSubjectsLoader}>
          {getAllSubjectsData
            ?.filter((sub) =>
              value?.currentKey
                ? sub?.subjectClassName?.className === value?.currentKey
                : true
            )
            .map((sub, index) => (
              <TableRow key={index}>
                <TableCell>
                  <p className="solaimanlipi text-xl font-bold">
                    {sub?.subjectClassName?.className}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="solaimanlipi text-xl font-bold">
                    {sub?.subjectName}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="solaimanlipi text-xl font-bold">
                    {sub?.groupName}
                  </p>
                </TableCell>
                <TableCell>{sub?.createdAt}</TableCell>
                <TableCell>
                  <Switch
                    isSelected={sub?.status}
                    aria-label="Automatic updates"
                    onValueChange={() =>
                      handleClassStatusUpdate(sub?._id, sub?.status)
                    }
                  />
                </TableCell>
                <TableCell>
                  <div className="flex flex-row gap-3">
                    <Button
                      onClick={() => handleDeleteSubject(sub?._id)}
                      isIconOnly
                      isLoading={deleteSubjectLoader}
                      color="danger"
                    >
                      <DeleteIcon size="24px" color="#ffffff" />
                    </Button>
                    <Button
                      onClick={() => setChangeSubjectId(sub?._id)}
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
      <UpdateSubjectModal
        isOpen2={isOpen2}
        onOpenChange2={onOpenChange2}
        changeSubjectId={changeSubjectId}
      />
    </div>
  );
}
