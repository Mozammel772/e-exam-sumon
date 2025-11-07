import { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Switch, Input } from "@heroui/react";
import {
  useGetAllSubscriptionsQuery,
  useSubscriptionDeleteMutation,
  useSubscriptionStatusUpdateMutation,
} from "../../../redux/api/slices/subscriptionSlice";
import ClientLoader from "../../../utils/loader/ClientLoader";
import { useGetAllSubjectsQuery } from "../../../redux/api/slices/subjectSlice";
import { Button, Chip } from "@heroui/react";

import { BadgeCheck, Star, Search } from "lucide-react";
import { DeleteFilled } from "@ant-design/icons";
import Swal from "sweetalert2";
import moment from "moment";

export default function AllSubscriptions() {
  const token = localStorage?.getItem("token");
  const { data: getAllSubscriptionsData, isLoading: getAllSubscriptionLoader } =
    useGetAllSubscriptionsQuery(token);
  const { data: getAllSubjectsData, isLoading: allSubjectsLoader } =
    useGetAllSubjectsQuery();

  const [subscriptionStatusUpdate] = useSubscriptionStatusUpdateMutation();
  const [subscriptionDelete, { isLoading: subscriptionDeleteLoader }] =
    useSubscriptionDeleteMutation();

  // State for search inputs
  const [nameSearch, setNameSearch] = useState("");
  const [emailSearch, setEmailSearch] = useState("");

  // Filtered subscriptions based on search criteria
  const filteredSubscriptions = useMemo(() => {
    if (!getAllSubscriptionsData) return [];

    return getAllSubscriptionsData.filter((subscription) => {
      const matchesName = nameSearch
        ? subscription?.name?.toLowerCase().includes(nameSearch.toLowerCase())
        : true;

      const matchesEmail = emailSearch
        ? subscription?.email?.toLowerCase().includes(emailSearch.toLowerCase())
        : true;

      return matchesName && matchesEmail;
    });
  }, [getAllSubscriptionsData, nameSearch, emailSearch]);

  const handleSubscriptionStatusChange = async (status, subscriptionId) => {
    const newStatus = {
      isApproved: !status,
    };
    try {
      const res = await subscriptionStatusUpdate({
        newStatus,
        token,
        subscriptionId,
      });

      if (res?.data) {
        Swal.fire({
          title: res?.data?.message,
          icon: "success",
          showCloseButton: true,
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          title: res?.error?.data?.message,
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

  const handleDeleteSubscription = async (subscriptionId) => {
    try {
      const confirmResult = await Swal.fire({
        title: "আপনি কি নিশ্চিত?",
        text: "এই সাবস্ক্রিপশনটি ডিলিট করতে চান?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "হ্যাঁ, ডিলিট করুন",
        cancelButtonText: "না",
      });

      if (confirmResult.isConfirmed) {
        const res = await subscriptionDelete({ subscriptionId, token });

        if (res?.data) {
          Swal.fire({
            title: res?.data?.message,
            icon: "success",
            showCloseButton: true,
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            title: res?.error?.data?.message || "কিছু ভুল হয়েছে!",
            icon: "error",
            showCloseButton: true,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    } catch (error) {
      Swal.fire({
        title: "একটি ত্রুটি ঘটেছে",
        text: error?.message || "দয়া করে পরে আবার চেষ্টা করুন",
        icon: "error",
        showCloseButton: true,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  // Clear search function
  const clearSearch = () => {
    setNameSearch("");
    setEmailSearch("");
  };

  if (getAllSubscriptionLoader || allSubjectsLoader) {
    return <ClientLoader />;
  }

  return (
    <div className="ms-[270px] mt-24 me-3">
      <p className="text-center text-4xl font-bold">Manage All Subscription</p>

      {/* Search Section */}
      <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label
              htmlFor="nameSearch"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search by Name
            </label>
            <Input
              id="nameSearch"
              placeholder="Enter user name..."
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              startContent={<Search className="w-4 h-4 text-gray-400" />}
              className="w-full"
            />
          </div>

          <div className="flex-1">
            <label
              htmlFor="emailSearch"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search by Email
            </label>
            <Input
              id="emailSearch"
              placeholder="Enter email address..."
              value={emailSearch}
              onChange={(e) => setEmailSearch(e.target.value)}
              startContent={<Search className="w-4 h-4 text-gray-400" />}
              className="w-full"
            />
          </div>

          <Button
            onClick={clearSearch}
            color="default"
            variant="flat"
            className="px-4"
          >
            Clear
          </Button>
        </div>

        {/* Search results info */}
        {(nameSearch || emailSearch) && (
          <div className="mt-3 text-sm text-gray-600">
            Showing {filteredSubscriptions.length} of{" "}
            {getAllSubscriptionsData?.length || 0} subscriptions
            {nameSearch && ` matching name: "${nameSearch}"`}
            {nameSearch && emailSearch && " and"}
            {emailSearch && ` email: "${emailSearch}"`}
          </div>
        )}
      </div>

      <Table aria-label="Subscription table" className="mt-6">
        <TableHeader>
          <TableColumn>SL</TableColumn>
          <TableColumn>NAME</TableColumn>
          <TableColumn>EMAIL</TableColumn>
          <TableColumn>PHONE NUMBER</TableColumn>
          <TableColumn>PRICE</TableColumn>
          <TableColumn>PAYMENT METHOD</TableColumn>
          <TableColumn>TRANSACTION ID</TableColumn>
          <TableColumn>PACKAGES</TableColumn>
          <TableColumn>APPROVED STATUS</TableColumn>
          <TableColumn>PREMIUM STATUS</TableColumn>
          <TableColumn>Date & Time</TableColumn>
          <TableColumn>Validity</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody isLoading={getAllSubscriptionLoader}>
          {filteredSubscriptions?.length > 0 ? (
            filteredSubscriptions.map((subs, index) => (
              <TableRow key={subs?._id}>
                <TableCell>{++index}</TableCell>
                <TableCell>{subs?.name}</TableCell>
                <TableCell>{subs?.email}</TableCell>
                <TableCell>{subs?.phoneNumber}</TableCell>
                <TableCell>{subs?.price}</TableCell>
                <TableCell>{subs?.paymentMethod}</TableCell>
                <TableCell>{subs?.transactionId}</TableCell>
                <TableCell>
                  {subs?.packages?.map((packId, index) => {
                    const subject = getAllSubjectsData?.find(
                      (subject) => subject._id === packId
                    );

                    return (
                      <p
                        key={index}
                        className="solaimanlipi text-lg text-nowrap"
                      >
                        {subject
                          ? `${subject.subjectName} (${
                              subject.subjectClassName?.className || "No Class"
                            })`
                          : `Unknown Subject (${packId})`}
                      </p>
                    );
                  })}
                </TableCell>

                <TableCell>
                  <Switch
                    onChange={() =>
                      handleSubscriptionStatusChange(
                        subs?.isApproved,
                        subs?._id
                      )
                    }
                    isSelected={subs?.isApproved}
                    aria-label="Automatic updates"
                  />
                </TableCell>
                <TableCell>
                  {subs?.isPremium ? (
                    <Chip
                      variant="shadow"
                      className="bg-gradient-to-r from-pink-300 via-pink-400 to-pink-300 text-white px-4 py-1 rounded-full font-semibold text-sm shadow-[0_10px_25px_rgba(255,192,203,0.45)] backdrop-blur-md"
                      startContent={<Star className="w-4 h-4 text-white" />}
                    >
                      Premium
                    </Chip>
                  ) : (
                    <Chip
                      variant="shadow"
                      className="bg-gradient-to-r from-slate-200 via-gray-300 to-slate-200 text-gray-700 px-4 py-1 rounded-full font-medium text-sm shadow-md"
                      startContent={
                        <BadgeCheck className="w-4 h-4 text-gray-700" />
                      }
                    >
                      Normal
                    </Chip>
                  )}
                </TableCell>
                <TableCell>
                  {moment(subs?.createdAt).format("YYYY-MM-DD hh:mm A")}
                </TableCell>
                <TableCell>
                  {moment(subs?.subscriptionValidity).format(
                    "YYYY-MM-DD hh:mm A"
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleDeleteSubscription(subs?._id)}
                    isLoading={subscriptionDeleteLoader}
                    isIconOnly
                    color="danger"
                  >
                    <DeleteFilled />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={13}
                className="text-center py-8 text-gray-500"
              >
                {getAllSubscriptionsData?.length === 0
                  ? "No subscriptions found"
                  : "No subscriptions match your search criteria"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
