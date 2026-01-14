// import { useState, useMemo } from "react";
// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableColumn,
//   TableRow,
//   TableCell,
// } from "@heroui/table";
// import { Switch, Input } from "@heroui/react";
// import {
//   useGetAllSubscriptionsQuery,
//   useSubscriptionDeleteMutation,
//   useSubscriptionStatusUpdateMutation,
// } from "../../../redux/api/slices/subscriptionSlice";
// import ClientLoader from "../../../utils/loader/ClientLoader";
// import { useGetAllSubjectsQuery } from "../../../redux/api/slices/subjectSlice";
// import { Button, Chip } from "@heroui/react";

// import { BadgeCheck, Star, Search } from "lucide-react";
// import { DeleteFilled } from "@ant-design/icons";
// import Swal from "sweetalert2";
// import moment from "moment";

// export default function AllSubscriptions() {
//   const token = localStorage?.getItem("token");
//   const { data: getAllSubscriptionsData, isLoading: getAllSubscriptionLoader } =
//     useGetAllSubscriptionsQuery(token);
//   const { data: getAllSubjectsData, isLoading: allSubjectsLoader } =
//     useGetAllSubjectsQuery();

//   const [subscriptionStatusUpdate] = useSubscriptionStatusUpdateMutation();
//   const [subscriptionDelete, { isLoading: subscriptionDeleteLoader }] =
//     useSubscriptionDeleteMutation();

//   // State for search inputs
//   const [nameSearch, setNameSearch] = useState("");
//   const [emailSearch, setEmailSearch] = useState("");

//   // Filtered subscriptions based on search criteria
//   const filteredSubscriptions = useMemo(() => {
//     if (!getAllSubscriptionsData) return [];

//     return getAllSubscriptionsData.filter((subscription) => {
//       const matchesName = nameSearch
//         ? subscription?.name?.toLowerCase().includes(nameSearch.toLowerCase())
//         : true;

//       const matchesEmail = emailSearch
//         ? subscription?.email?.toLowerCase().includes(emailSearch.toLowerCase())
//         : true;

//       return matchesName && matchesEmail;
//     });
//   }, [getAllSubscriptionsData, nameSearch, emailSearch]);

//   const handleSubscriptionStatusChange = async (status, subscriptionId) => {
//     const newStatus = {
//       isApproved: !status,
//     };
//     try {
//       const res = await subscriptionStatusUpdate({
//         newStatus,
//         token,
//         subscriptionId,
//       });

//       if (res?.data) {
//         Swal.fire({
//           title: res?.data?.message,
//           icon: "success",
//           showCloseButton: true,
//           showConfirmButton: false,
//           timer: 1500,
//         });
//       } else {
//         Swal.fire({
//           title: res?.error?.data?.message,
//           icon: "error",
//           showCloseButton: true,
//           showConfirmButton: false,
//           timer: 1500,
//         });
//       }
//     } catch (error) {
//       Swal.fire({
//         title: error,
//         icon: "error",
//         showCloseButton: true,
//         showConfirmButton: false,
//         timer: 1500,
//       });
//     }
//   };

//   const handleDeleteSubscription = async (subscriptionId) => {
//     try {
//       const confirmResult = await Swal.fire({
//         title: "আপনি কি নিশ্চিত?",
//         text: "এই সাবস্ক্রিপশনটি ডিলিট করতে চান?",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#d33",
//         cancelButtonColor: "#3085d6",
//         confirmButtonText: "হ্যাঁ, ডিলিট করুন",
//         cancelButtonText: "না",
//       });

//       if (confirmResult.isConfirmed) {
//         const res = await subscriptionDelete({ subscriptionId, token });

//         if (res?.data) {
//           Swal.fire({
//             title: res?.data?.message,
//             icon: "success",
//             showCloseButton: true,
//             showConfirmButton: false,
//             timer: 1500,
//           });
//         } else {
//           Swal.fire({
//             title: res?.error?.data?.message || "কিছু ভুল হয়েছে!",
//             icon: "error",
//             showCloseButton: true,
//             showConfirmButton: false,
//             timer: 1500,
//           });
//         }
//       }
//     } catch (error) {
//       Swal.fire({
//         title: "একটি ত্রুটি ঘটেছে",
//         text: error?.message || "দয়া করে পরে আবার চেষ্টা করুন",
//         icon: "error",
//         showCloseButton: true,
//         showConfirmButton: false,
//         timer: 1500,
//       });
//     }
//   };

//   // Clear search function
//   const clearSearch = () => {
//     setNameSearch("");
//     setEmailSearch("");
//   };

//   if (getAllSubscriptionLoader || allSubjectsLoader) {
//     return <ClientLoader />;
//   }

//   return (
//     <div className="ms-[270px] mt-24 me-3">
//       <p className="text-center text-4xl font-bold">Manage All Subscription</p>

//       {/* Search Section */}
//       <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
//         <div className="flex flex-col md:flex-row gap-4 items-end">
//           <div className="flex-1">
//             <label
//               htmlFor="nameSearch"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Search by Name
//             </label>
//             <Input
//               id="nameSearch"
//               placeholder="Enter user name..."
//               value={nameSearch}
//               onChange={(e) => setNameSearch(e.target.value)}
//               startContent={<Search className="w-4 h-4 text-gray-400" />}
//               className="w-full"
//             />
//           </div>

//           <div className="flex-1">
//             <label
//               htmlFor="emailSearch"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Search by Email
//             </label>
//             <Input
//               id="emailSearch"
//               placeholder="Enter email address..."
//               value={emailSearch}
//               onChange={(e) => setEmailSearch(e.target.value)}
//               startContent={<Search className="w-4 h-4 text-gray-400" />}
//               className="w-full"
//             />
//           </div>

//           <Button
//             onClick={clearSearch}
//             color="default"
//             variant="flat"
//             className="px-4"
//           >
//             Clear
//           </Button>
//         </div>

//         {/* Search results info */}
//         {(nameSearch || emailSearch) && (
//           <div className="mt-3 text-sm text-gray-600">
//             Showing {filteredSubscriptions.length} of{" "}
//             {getAllSubscriptionsData?.length || 0} subscriptions
//             {nameSearch && ` matching name: "${nameSearch}"`}
//             {nameSearch && emailSearch && " and"}
//             {emailSearch && ` email: "${emailSearch}"`}
//           </div>
//         )}
//       </div>

//       <Table aria-label="Subscription table" className="mt-6">
//         <TableHeader>
//           <TableColumn>SL</TableColumn>
//           <TableColumn>NAME</TableColumn>
//           <TableColumn>EMAIL</TableColumn>
//           <TableColumn>PHONE NUMBER</TableColumn>
//           <TableColumn>PRICE</TableColumn>
//           <TableColumn>PAYMENT METHOD</TableColumn>
//           <TableColumn>TRANSACTION ID</TableColumn>
//           <TableColumn>PACKAGES</TableColumn>
//           <TableColumn>APPROVED STATUS</TableColumn>
//           <TableColumn>PREMIUM STATUS</TableColumn>
//           <TableColumn>Date & Time</TableColumn>
//           <TableColumn>Validity</TableColumn>
//           <TableColumn>ACTIONS</TableColumn>
//         </TableHeader>
//         <TableBody isLoading={getAllSubscriptionLoader}>
//           {filteredSubscriptions?.length > 0 ? (
//             filteredSubscriptions.map((subs, index) => (
//               <TableRow key={subs?._id}>
//                 <TableCell>{++index}</TableCell>
//                 <TableCell>{subs?.name}</TableCell>
//                 <TableCell>{subs?.email}</TableCell>
//                 <TableCell>{subs?.phoneNumber}</TableCell>
//                 <TableCell>{subs?.price}</TableCell>
//                 <TableCell>{subs?.paymentMethod}</TableCell>
//                 <TableCell>{subs?.transactionId}</TableCell>
//                 <TableCell>
//                   {subs?.packages?.map((packId, index) => {
//                     const subject = getAllSubjectsData?.find(
//                       (subject) => subject._id === packId
//                     );

//                     return (
//                       <p
//                         key={index}
//                         className="solaimanlipi text-lg text-nowrap"
//                       >
//                         {subject
//                           ? `${subject.subjectName} (${
//                               subject.subjectClassName?.className || "No Class"
//                             })`
//                           : `Unknown Subject (${packId})`}
//                       </p>
//                     );
//                   })}
//                 </TableCell>

//                 <TableCell>
//                   <Switch
//                     onChange={() =>
//                       handleSubscriptionStatusChange(
//                         subs?.isApproved,
//                         subs?._id
//                       )
//                     }
//                     isSelected={subs?.isApproved}
//                     aria-label="Automatic updates"
//                   />
//                 </TableCell>
//                 <TableCell>
//                   {subs?.isPremium ? (
//                     <Chip
//                       variant="shadow"
//                       className="bg-gradient-to-r from-pink-300 via-pink-400 to-pink-300 text-white px-4 py-1 rounded-full font-semibold text-sm shadow-[0_10px_25px_rgba(255,192,203,0.45)] backdrop-blur-md"
//                       startContent={<Star className="w-4 h-4 text-white" />}
//                     >
//                       Premium
//                     </Chip>
//                   ) : (
//                     <Chip
//                       variant="shadow"
//                       className="bg-gradient-to-r from-slate-200 via-gray-300 to-slate-200 text-gray-700 px-4 py-1 rounded-full font-medium text-sm shadow-md"
//                       startContent={
//                         <BadgeCheck className="w-4 h-4 text-gray-700" />
//                       }
//                     >
//                       Normal
//                     </Chip>
//                   )}
//                 </TableCell>
//                 <TableCell>
//                   {moment(subs?.createdAt).format("YYYY-MM-DD hh:mm A")}
//                 </TableCell>
//                 <TableCell>
//                   {moment(subs?.subscriptionValidity).format(
//                     "YYYY-MM-DD hh:mm A"
//                   )}
//                 </TableCell>
//                 <TableCell>
//                   <Button
//                     onClick={() => handleDeleteSubscription(subs?._id)}
//                     isLoading={subscriptionDeleteLoader}
//                     isIconOnly
//                     color="danger"
//                   >
//                     <DeleteFilled />
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell
//                 colSpan={13}
//                 className="text-center py-8 text-gray-500"
//               >
//                 {getAllSubscriptionsData?.length === 0
//                   ? "No subscriptions found"
//                   : "No subscriptions match your search criteria"}
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }

// import {
//   Button,
//   Chip,
//   Input,
//   Modal,
//   ModalContent,
// } from "@heroui/react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableColumn,
//   TableHeader,
//   TableRow,
// } from "@heroui/table";
// import { useMemo, useState } from "react";
// import { useGetAllSubjectsQuery } from "../../../redux/api/slices/subjectSlice";
// import {
//   useGetAllSubscriptionsQuery,
//   useSubscriptionDeleteMutation,
// } from "../../../redux/api/slices/subscriptionSlice";
// import ClientLoader from "../../../utils/loader/ClientLoader";

// import { DeleteFilled } from "@ant-design/icons";
// import axios from "axios";
// import { BadgeCheck, Eye, Search, Star } from "lucide-react";
// import moment from "moment";
// import Swal from "sweetalert2";

// export default function AllSubscriptions() {
//   const token = localStorage?.getItem("token");

//   const { data: subscriptions = [], isLoading, refetch } =
//     useGetAllSubscriptionsQuery(token);
//   const { data: subjects = [] } = useGetAllSubjectsQuery();

//   const [deleteSubscription] = useSubscriptionDeleteMutation();

//   const [nameSearch, setNameSearch] = useState("");
//   const [emailSearch, setEmailSearch] = useState("");

//   const [openPayments, setOpenPayments] = useState(false);
//   const [selectedSubscription, setSelectedSubscription] = useState(null);

//   const filtered = useMemo(() => {
//     return subscriptions.filter((s) => {
//       const nameOk = nameSearch
//         ? s.name?.toLowerCase().includes(nameSearch.toLowerCase())
//         : true;
//       const emailOk = emailSearch
//         ? s.email?.toLowerCase().includes(emailSearch.toLowerCase())
//         : true;
//       return nameOk && emailOk;
//     });
//   }, [subscriptions, nameSearch, emailSearch]);

//   // ✅ APPROVE SINGLE PAYMENT
//   const handleApprovePayment = async (subscriptionId, paymentId) => {
//     try {
//       const res = await axios.patch(
//         `${import.meta.env.VITE_API_URL}/subscriptions/${subscriptionId}/approve-payment/${paymentId}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       Swal.fire({
//         icon: "success",
//         title: res.data.message,
//         timer: 1200,
//         showConfirmButton: false,
//       });

//       setOpenPayments(false);
//       refetch();
//     } catch (err) {
//       Swal.fire({
//         icon: "error",
//         title: err?.response?.data?.message || "Approval failed",
//         timer: 1500,
//         showConfirmButton: false,
//       });
//     }
//   };

//   const handleDelete = async (id) => {
//     const confirm = await Swal.fire({
//       title: "Confirm delete?",
//       icon: "warning",
//       showCancelButton: true,
//     });

//     if (confirm.isConfirmed) {
//       const res = await deleteSubscription({ subscriptionId: id, token });
//       Swal.fire({
//         icon: res?.data ? "success" : "error",
//         title: res?.data?.message || "Error",
//         timer: 1200,
//         showConfirmButton: false,
//       });
//     }
//   };

//   if (isLoading) return <ClientLoader />;

//   return (
//     <div className="ms-[270px] mt-24 me-3">
//       <h1 className="text-4xl font-bold text-center">
//         Manage All Subscriptions
//       </h1>

//       {/* SEARCH */}
//       <div className="mt-6 p-4 bg-white rounded shadow">
//         <div className="flex gap-4">
//           <Input
//             placeholder="Search by name"
//             startContent={<Search size={16} />}
//             value={nameSearch}
//             onChange={(e) => setNameSearch(e.target.value)}
//           />
//           <Input
//             placeholder="Search by email"
//             startContent={<Search size={16} />}
//             value={emailSearch}
//             onChange={(e) => setEmailSearch(e.target.value)}
//           />
//           <Button onClick={() => { setNameSearch(""); setEmailSearch(""); }}>
//             Clear
//           </Button>
//         </div>
//       </div>

//       {/* TABLE */}
//       <Table className="mt-6">
//         <TableHeader>
//           <TableColumn>SL</TableColumn>
//           <TableColumn>NAME</TableColumn>
//           <TableColumn>EMAIL</TableColumn>
//           <TableColumn>TYPE</TableColumn>
//           <TableColumn>PACKAGES</TableColumn>
//           <TableColumn>PAYMENTS</TableColumn>
//           <TableColumn>ACTION</TableColumn>
//         </TableHeader>

//         <TableBody>
//           {filtered.map((s, i) => (
//             <TableRow key={s._id}>
//               <TableCell>{i + 1}</TableCell>
//               <TableCell>{s.name}</TableCell>
//               <TableCell>{s.email}</TableCell>

//               <TableCell>
//                 {s.isPremium ? (
//                   <Chip color="danger" startContent={<Star size={14} />}>
//                     Premium
//                   </Chip>
//                 ) : (
//                   <Chip startContent={<BadgeCheck size={14} />}>
//                     Normal
//                   </Chip>
//                 )}
//               </TableCell>

//               <TableCell>
//                 {s.packages?.map((id) => {
//                   const sub = subjects.find((x) => x._id === id);
//                   return (
//                     <p key={id} className="text-sm">
//                       {sub?.subjectName}
//                     </p>
//                   );
//                 })}
//               </TableCell>

//               <TableCell>
//                 <Button
//                   isIconOnly
//                   variant="flat"
//                   onClick={() => {
//                     setSelectedSubscription(s);
//                     setOpenPayments(true);
//                   }}
//                 >
//                   <Eye size={18} />
//                 </Button>
//               </TableCell>

//               <TableCell>
//                 <Button
//                   isIconOnly
//                   color="danger"
//                   onClick={() => handleDelete(s._id)}
//                 >
//                   <DeleteFilled />
//                 </Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       {/* PAYMENTS MODAL */}
//       <Modal
//         isOpen={openPayments}
//         onClose={() => setOpenPayments(false)}
//         size="lg"
//       >
//         <ModalContent>
//           <div className="p-5">
//             <h3 className="text-xl font-semibold mb-4">
//               Payment History
//             </h3>

//             {selectedSubscription?.purchases?.map((p) => (
//               <div
//                 key={p._id}
//                 className="border p-3 rounded mb-2 flex justify-between items-center"
//               >
//                 <div>
//                   <p>Amount: {p.price}</p>
//                   <p>Method: {p.paymentMethod}</p>
//                   <p>Trx: {p.transactionId}</p>
//                   <p className="text-xs text-gray-500">
//                     {moment(p.createdAt).format("LLL")}
//                   </p>
//                 </div>

//                 <div>
//                   {p.isApproved ? (
//                     <Chip color="success">Approved</Chip>
//                   ) : (
//                     <Button
//                       size="sm"
//                       color="success"
//                       onClick={() =>
//                         handleApprovePayment(
//                           selectedSubscription._id,
//                           p._id
//                         )
//                       }
//                     >
//                       Accept
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </ModalContent>
//       </Modal>
//     </div>
//   );
// }

import { Button, Chip, Input, Modal, ModalContent } from "@heroui/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { useMemo, useState } from "react";
import { useGetAllSubjectsQuery } from "../../../redux/api/slices/subjectSlice";
import {
  useGetAllSubscriptionsQuery,
  useSubscriptionDeleteMutation,
} from "../../../redux/api/slices/subscriptionSlice";
import ClientLoader from "../../../utils/loader/ClientLoader";

import { DeleteFilled } from "@ant-design/icons";
import axios from "axios";
import { BadgeCheck, Eye, Search, Star } from "lucide-react";
import moment from "moment";
import Swal from "sweetalert2";

export default function AllSubscriptions() {
  const token = localStorage?.getItem("token");

  const {
    data: subscriptions = [],
    isLoading,
    refetch,
  } = useGetAllSubscriptionsQuery(token);
  const { data: subjects = [] } = useGetAllSubjectsQuery();

  const [deleteSubscription] = useSubscriptionDeleteMutation();

  const [nameSearch, setNameSearch] = useState("");
  const [emailSearch, setEmailSearch] = useState("");

  const [openPayments, setOpenPayments] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  const [openPackages, setOpenPackages] = useState(false);

  // Filter subscriptions by name/email
  const filtered = useMemo(() => {
    return subscriptions.filter((s) => {
      const nameOk = nameSearch
        ? s.name?.toLowerCase().includes(nameSearch.toLowerCase())
        : true;
      const emailOk = emailSearch
        ? s.email?.toLowerCase().includes(emailSearch.toLowerCase())
        : true;
      return nameOk && emailOk;
    });
  }, [subscriptions, nameSearch, emailSearch]);

  // Approve a single payment
  const handleApprovePayment = async (subscriptionId, paymentId) => {
    try {
      const res = await axios.patch(
        `${
          import.meta.env.VITE_main_url
        }/subscription/${subscriptionId}/approve-payment/${paymentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: res.data.message,
        timer: 1200,
        showConfirmButton: false,
      });

      setOpenPayments(false);
      refetch();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: err?.response?.data?.message || "Approval failed",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  // Delete subscription
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Confirm delete?",
      icon: "warning",
      showCancelButton: true,
    });

    if (confirm.isConfirmed) {
      const res = await deleteSubscription({ subscriptionId: id, token });
      Swal.fire({
        icon: res?.data ? "success" : "error",
        title: res?.data?.message || "Error",
        timer: 1200,
        showConfirmButton: false,
      });
      refetch();
    }
  };

  if (isLoading) return <ClientLoader />;

  return (
    <div className="ms-[270px] mt-24 me-3">
      <h1 className="text-4xl font-bold text-center">
        Manage All Subscriptions
      </h1>

      {/* SEARCH */}
      <div className="mt-6 p-4 bg-white rounded shadow">
        <div className="flex gap-4">
          <Input
            placeholder="Search by name"
            startContent={<Search size={16} />}
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
          />
          <Input
            placeholder="Search by email"
            startContent={<Search size={16} />}
            value={emailSearch}
            onChange={(e) => setEmailSearch(e.target.value)}
          />
          <Button
            onClick={() => {
              setNameSearch("");
              setEmailSearch("");
            }}
          >
            Clear
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <Table className="mt-6">
        <TableHeader>
          <TableColumn>SL</TableColumn>
          <TableColumn>NAME</TableColumn>
          <TableColumn>EMAIL</TableColumn>
          <TableColumn>TYPE</TableColumn>
          <TableColumn>PACKAGES</TableColumn>
          <TableColumn>PAYMENTS</TableColumn>
          <TableColumn>ACTION</TableColumn>
        </TableHeader>

        <TableBody>
          {filtered.map((s, i) => (
            <TableRow key={s._id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{s.name}</TableCell>
              <TableCell>{s.email}</TableCell>

              <TableCell>
                {s.isPremium ? (
                  <Chip color="danger" startContent={<Star size={14} />}>
                    Premium
                  </Chip>
                ) : (
                  <Chip startContent={<BadgeCheck size={14} />}>Normal</Chip>
                )}
              </TableCell>

              {/* PACKAGES */}
              <TableCell>
                {s.packages?.slice(0, 3).map((id) => {
                  const sub = subjects.find((x) => x._id === id);
                  return (
                    <p key={id} className="text-sm">
                      {sub?.subjectName}
                    </p>
                  );
                })}

                {s.packages?.length > 3 && (
                  <Button
                    size="sm"
                    variant="flat"
                    onClick={() => {
                      const allPackageDetails = s.packages.map((id) =>
                        subjects.find((x) => x._id === id)
                      );
                      setSelectedSubscription({
                        ...s,
                        allPackageDetails,
                      });
                      setOpenPackages(true);
                    }}
                  >
                    See more
                  </Button>
                )}
              </TableCell>

              {/* PAYMENTS */}
              <TableCell>
                <Button
                  isIconOnly
                  variant="flat"
                  onClick={() => {
                    setSelectedSubscription(s);
                    setOpenPayments(true);
                  }}
                >
                  <Eye size={18} />
                </Button>
              </TableCell>

              {/* ACTION */}
              <TableCell>
                <Button
                  isIconOnly
                  color="danger"
                  onClick={() => handleDelete(s._id)}
                >
                  <DeleteFilled />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* PAYMENTS MODAL */}
      <Modal
        isOpen={openPayments}
        onClose={() => setOpenPayments(false)}
        size="lg"
      >
        <ModalContent>
          <div className="p-5">
            <h3 className="text-xl font-semibold mb-4">Payment History</h3>

            {selectedSubscription?.purchases?.length === 0 && (
              <p className="text-gray-500">No purchases yet</p>
            )}

            {selectedSubscription?.purchases?.map((p) => {
              return (
                <div
                  key={p._id}
                  className="border p-3 rounded mb-2 flex justify-between items-center"
                >
                  <div>
                    <p>Amount: {p.price}</p>
                    <p>Method: {p.paymentMethod}</p>
                    <p>Trx: {p.phoneNumber}</p>
                    <p className="text-xs text-gray-500">
                      Purchased on: {moment(p.date).format("LLL")}
                    </p>
                    <p className="text-sm text-gray-600">
                      Expires on:{" "}
                      {p.expiredAt ? moment(p.expiredAt).format("LLL") : "N/A"}
                    </p>
                  </div>

                  <div>
                    {p.isApproved ? (
                      <Chip color="danger">Approved</Chip>
                    ) : (
                      <Button
                        size="sm"
                        color="success"
                        onClick={() =>
                          handleApprovePayment(selectedSubscription._id, p._id)
                        }
                      >
                        Accept
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ModalContent>
      </Modal>

      {/* FULL PACKAGES MODAL */}
      <Modal
        isOpen={openPackages}
        onClose={() => setOpenPackages(false)}
        size="md"
      >
        <ModalContent>
          <div className="p-5">
            <h3 className="text-xl font-semibold mb-4">All Packages</h3>

            {selectedSubscription?.allPackageDetails?.map((pkg, idx) => (
              <p key={idx} className="text-sm mb-2">
                {pkg?.subjectName}
              </p>
            ))}
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}
