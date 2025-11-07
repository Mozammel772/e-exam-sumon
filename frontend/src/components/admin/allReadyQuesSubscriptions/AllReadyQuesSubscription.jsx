import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Switch } from "@heroui/switch";

import {
  useGetAllReadyQuestionsSetsQuery,
  useReadyQuesSetDeleteMutation,
} from "../../../redux/api/slices/readyQuestionsSetsSlice";
import ClientLoader from "../../../utils/loader/ClientLoader";
import { Button } from "@heroui/react";
import { useGetAllSubjectsQuery } from "../../../redux/api/slices/subjectSlice";
import DeleteIcon from "../../../assets/DeleteIcon";
import Swal from "sweetalert2";

export default function AllReadyQuesSubscription() {
  const token = localStorage.getItem("token");
  const { data: getAllReadyQuestions, isLoading: getAllReadyQuestionsLoader } =
    useGetAllReadyQuestionsSetsQuery(token);
  const { data: getAllSubjectsData, isLoading: subjectsLoader } =
    useGetAllSubjectsQuery();
  const [readyQuesSetDelete, { isLoading: deleteQusSetLoader }] =
    useReadyQuesSetDeleteMutation();

  // Modified rendering logic for packages cell
  const renderPackagesCell = (packages) => {
    if (!getAllSubjectsData || !packages) return null;

    // Convert package IDs to strings
    const packageIds = packages.map((id) => id.toString());

    // Filter matching subjects
    const matchedSubjects = getAllSubjectsData.filter((subject) =>
      packageIds.includes(subject._id.toString())
    );

    return (
      <div className="space-y-1">
        {matchedSubjects.map((subject, index) => (
          <p key={subject._id} className="text-lg">
            {index + 1}. {subject.subjectName}
          </p>
        ))}
      </div>
    );
  };

  const handleDeleteQusSet = async (id) => {
    try {
      const res = await readyQuesSetDelete({ id, token }).unwrap();
      if (res?.message) {
        Swal.fire({
          title: "Ready Question Set Deleted",
          text: "The ready question set has been deleted successfully.",
          icon: "success",
          showCloseButton: true,
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to delete the ready question set.",
          icon: "error",
          showCloseButton: true,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      Swal.fire({
        title: error?.data?.message || "Error",
        text: "Failed to delete the ready question set.",
        icon: "error",
        showCloseButton: true,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  if (getAllReadyQuestionsLoader || subjectsLoader) {
    return <ClientLoader />;
  }
  return (
    <div className="ms-[270px] mt-24 me-3 solaimanlipi">
      <p className="text-center font-bold text-4xl pt-5">
        Ready Question Subscriptions Manage
      </p>

      <Table aria-label="Example static collection table" className="mt-5">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>EMAIL</TableColumn>
          <TableColumn>PHONE NUMBER</TableColumn>
          <TableColumn>TRANSACTION ID</TableColumn>
          <TableColumn>TOTAL PRICE</TableColumn>
          <TableColumn>PACKAGES</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>CREATED AT</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {getAllReadyQuestions?.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item?.name}</TableCell>
              <TableCell>{item?.email}</TableCell>
              <TableCell>{item?.phoneNumber}</TableCell>
              <TableCell>{item?.transactionId}</TableCell>
              <TableCell>{item?.totalPrice}</TableCell>
              <TableCell>{renderPackagesCell(item.packages)}</TableCell>
              <TableCell>
                <Switch
                  isSelected={item?.status}
                  aria-label="Automatic updates"
                />
              </TableCell>
              <TableCell>
                <p>{item?.createdAt}</p>
              </TableCell>
              <TableCell>
                <Button
                  isLoading={deleteQusSetLoader}
                  onClick={() => handleDeleteQusSet(item?._id)}
                  isIconOnly
                  color="danger"
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
