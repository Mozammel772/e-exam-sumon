import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Image } from "antd";
import { Button } from "@heroui/react";
import DeleteIcon from "../../../assets/DeleteIcon";
export default function ReportManagement() {
  return (
    <div className="ms-[270px] mt-24 me-3">
      <p className="text-center font-bold text-4xl">All Reports</p>
      <Table aria-label="Example static collection table" className="mt-10">
        <TableHeader>
          <TableColumn>SL</TableColumn>
          <TableColumn>USER NAME</TableColumn>
          <TableColumn>ISSUE</TableColumn>
          <TableColumn>IMAGE</TableColumn>
          <TableColumn>EMAIL</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow key="1">
            <TableCell>1</TableCell>
            <TableCell>Tony Reichert</TableCell>
            <TableCell>Question banan vul</TableCell>
            <TableCell>
              <Image
                alt="HeroUI hero Image"
                src="https://heroui.com/images/hero-card-complete.jpeg"
                width={150}
              />
            </TableCell>
            <TableCell>abcd@gmail.com</TableCell>
            <TableCell>
              <Button isIconOnly color="danger">
                <DeleteIcon size="20px" color="#ffffff" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
