import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";

import { useGetReadyQuesSetsAnUserQuery } from "../../../redux/api/slices/readyQuestionsSetsSlice";
import { useGetAllSubjectsQuery } from "../../../redux/api/slices/subjectSlice";
import ClientLoader from "../../../utils/loader/ClientLoader";
import { Button } from "@heroui/react";
import DeleteIcon from "../../../assets/DeleteIcon";

export default function MyReadyQuesSets() {
  const email = localStorage?.getItem("email");
  const {
    data: getAnUserReadyQuesSets,
    isLoading: userReadyQuestionSetsLoader,
  } = useGetReadyQuesSetsAnUserQuery(email);
  const { data: getAllSubjectsData, isLoading: subjectsLoader } =
    useGetAllSubjectsQuery();

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

  if (userReadyQuestionSetsLoader || subjectsLoader) {
    return <ClientLoader />;
  }
  return (
    <div className="ms-[275px] me-[20px] mt-20 solaimanlipi">
      <p className="text-center font-bold text-5xl pt-5">
        সকল রেডি প্রশ্ন প্যাকেজ
      </p>

      <Table aria-label="Example static collection table" className="mt-5">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>EMAIL</TableColumn>
          <TableColumn>PHONE NUMBER</TableColumn>
          <TableColumn>TRANSACTION ID</TableColumn>
          <TableColumn>TOTAL PRICE</TableColumn>
          <TableColumn>PACKAGES</TableColumn>
          <TableColumn>CREATED AT</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {getAnUserReadyQuesSets?.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item?.name}</TableCell>
              <TableCell>{item?.email}</TableCell>
              <TableCell>{item?.phoneNumber}</TableCell>
              <TableCell>{item?.transactionId}</TableCell>
              <TableCell>{item?.totalPrice}</TableCell>
              <TableCell>{renderPackagesCell(item.packages)}</TableCell>
              <TableCell>
                <p>{item?.createdAt}</p>
              </TableCell>
              <TableCell>
                <Button
                  //   isLoading={deleteQusSetLoader}
                  //   onClick={() => handleDeleteQusSet(item?._id)}
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
