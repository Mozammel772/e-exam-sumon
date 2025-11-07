import { Button, Tooltip } from "@heroui/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { useDisclosure } from "@heroui/modal";

import ClassCreateIcon from "../../../assets/ClassCreateIcon";
import CreateAnnounceModal from "./createAnnounceModal/CreateAnnounceModal";
import {
  useAnnounceDeleteMutation,
  useGetAllMessageQuery,
} from "../../../redux/api/slices/AnnouncementSlice";
import ClientLoader from "../../../utils/loader/ClientLoader";
import DeleteIcon from "../../../assets/DeleteIcon";
import Swal from "sweetalert2";
export default function Announcement() {
  const token = localStorage?.getItem("token");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { data: getMessageData, isLoading: getMessageLoader } =
    useGetAllMessageQuery();
  const [announceDelete, { isLoading: deleteMsgLoader }] =
    useAnnounceDeleteMutation();

  const handleDeleteAnnounce = async (messageId) => {
    try {
      const res = await announceDelete({ messageId, token });
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
    console.log("message id", messageId);
  };

  if (getMessageLoader) {
    return <ClientLoader />;
  }
  return (
    <div className="ms-[270px] mt-24 me-3">
      <p className="text-center text-4xl font-bold">Announcement</p>
      <Tooltip content="Create a class">
        <Button onPress={onOpen} isIconOnly className="mt-8 mb-5 bg-[#024645]">
          <ClassCreateIcon size="24px" color="#ffffff" />
        </Button>
      </Tooltip>
      <CreateAnnounceModal isOpen={isOpen} onOpenChange={onOpenChange} />
      <Table aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>ANNOUNCEMENT MESSAGE</TableColumn>
          <TableColumn>CreatedAt</TableColumn>
          <TableColumn>STATUS</TableColumn>
        </TableHeader>
        <TableBody>
          {getMessageData?.map((msg) => (
            <TableRow key={msg?._id}>
              <TableCell>{msg?.message}</TableCell>
              <TableCell>{msg?.createdAt}</TableCell>
              <TableCell>
                <Button
                  onClick={() => handleDeleteAnnounce(msg?._id)}
                  isIconOnly
                  color="danger"
                  isLoading={deleteMsgLoader}
                >
                  <DeleteIcon size="20px" color="#ffffff" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
