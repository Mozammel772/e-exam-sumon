import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Switch } from "@heroui/switch";
import { Button, Chip } from "@heroui/react";
import DeleteIcon from "../../../assets/DeleteIcon";
// import EditIcon from "../../../assets/EditIcon";
import {
  useGetAllUsersQuery,
  useUserDeleteMutation,
} from "../../../redux/api/slices/authSlice";
import Swal from "sweetalert2";
import ClientLoader from "../../../utils/loader/ClientLoader";

export default function All_user() {
  const token = localStorage.getItem("token");

  const { data: getAllUsers, isLoading: getAllUsersLoader } =
    useGetAllUsersQuery(token);
  const [userDelete, { isLoading }] = useUserDeleteMutation();

  const handleDeleteAnUser = async (userId) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirmResult.isConfirmed) {
      try {
        const res = await userDelete({ userId, token });

        if (res) {
          Swal.fire({
            title: "User Deleted",
            icon: "success",
            showCloseButton: true,
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            title: res?.msg || "Failed to delete user",
            icon: "error",
            showCloseButton: true,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        Swal.fire({
          title: error.message || "Something went wrong",
          icon: "error",
          showCloseButton: true,
          showConfirmButton: false,
        });
      }
    } else {
      console.log("User deletion canceled.");
    }
  };

  if (getAllUsersLoader) {
    return <ClientLoader />;
  }
  return (
    <div className="ms-[270px] mt-24 me-3">
      <p className="solaimanlipi text-center font-bold text-5xl pt-5">
        ম্যানেজ ইউসার
      </p>
      <Table className="mt-6" aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>USER NAME</TableColumn>
          <TableColumn>USER EMAIL</TableColumn>
          <TableColumn>USER PHONE NUMBER</TableColumn>
          <TableColumn>USER ADDRESS</TableColumn>
          <TableColumn>SUBSCRIPTION</TableColumn>
          <TableColumn>PAYMENT</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>QUESTION SET MADE</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody isLoading={getAllUsersLoader}>
          {getAllUsers?.map((user) => {
            return (
              <TableRow key={user._id}>
                <TableCell>{user.userName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {!user.phone_number ? (
                    <Chip color="danger" variant="flat">
                      N/A
                    </Chip>
                  ) : (
                    <Chip color="danger" variant="flat">
                      {user.phone_number}
                    </Chip>
                  )}
                </TableCell>
                <TableCell>
                  {user?.addresses?.divisions || "N/A"},{" "}
                  {user?.addresses?.districts || "N/A"},{" "}
                  {user?.addresses?.upazillas || "N/A"},{" "}
                  {user?.addresses?.organizations || "N/A"}
                </TableCell>
                <TableCell>
                  {!user?.subscription ? (
                    <Chip color="danger" variant="flat">
                      N/A
                    </Chip>
                  ) : (
                    <Chip color="success" variant="flat">
                      Done
                    </Chip>
                  )}
                </TableCell>
                <TableCell>
                  {!user?.payment ? (
                    <Chip color="danger" variant="flat">
                      N/A
                    </Chip>
                  ) : (
                    <Chip color="success" variant="flat">
                      Done
                    </Chip>
                  )}
                </TableCell>
                <TableCell>
                  <Switch
                    isSelected={user?.isVerified}
                    aria-label="Automatic updates"
                  />
                </TableCell>
                <TableCell>4</TableCell>
                <TableCell>
                  <div className="flex flex-row gap-3">
                    <Button
                      isLoading={isLoading}
                      onClick={() => handleDeleteAnUser(user?._id)}
                      isIconOnly
                      color="danger"
                    >
                      <DeleteIcon size="24px" color="#ffffff" />
                    </Button>
                    {/* <Button isIconOnly color="success">
                      <EditIcon size="24px" color="#ffffff" />
                    </Button> */}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
