// import {
//   useGetAllSubscriptionsQuery,
//   useGetASubscriptionInfoOfAnUserQuery,
// } from "../../../redux/api/slices/subscriptionSlice";
// import {
//   FaCalendarAlt,
//   FaBook,
//   FaMoneyBillWave,
//   FaGraduationCap,
//   FaFileInvoice,
// } from "react-icons/fa";
// import ClientLoader from "../../../utils/loader/ClientLoader";
// import { useWindowSize } from "@uidotdev/usehooks";

// export default function SelfSubscriptions() {
//   const size = useWindowSize();

//   const email = localStorage.getItem("email");
//   const { data: userData, isLoading: subscriptionLoader } =
//     useGetASubscriptionInfoOfAnUserQuery(email);

//   if (subscriptionLoader) {
//     return (
//       <div className="ms-[275px] me-[20px] mt-20 flex justify-center items-center h-screen">
//         <ClientLoader />
//       </div>
//     );
//   }

//   if (!userData) {
//     return (
//       <div
//         className={`mt-24 me-3 ${size?.width <= 600 ? "ms-3" : "ms-[270px]"}`}
//       >
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-xl font-bold">No Subscription Found</h2>
//           <p>You dont have any active subscriptions.</p>
//         </div>
//       </div>
//     );
//   }

//   // Group packages by class
//   const packagesByClass = userData.packages.reduce((acc, pkg) => {
//     const className = pkg.subjectClassName.className;
//     if (!acc[className]) {
//       acc[className] = [];
//     }
//     acc[className].push(pkg);
//     return acc;
//   }, {});

//   // Format date
//   const formatDate = (dateString) => {
//     const options = { year: "numeric", month: "short", day: "numeric" };
//     return new Date(dateString).toLocaleDateString("en-US", options);
//   };

//   return (
//     <div
//       className={`mt-24 me-3 solaimanlipi ${
//         size?.width <= 600 ? "ms-3" : "ms-[270px]"
//       }`}
//     >
//       <div className="w-full mx-auto">
//         {/* User Profile Section */}
//         <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
//           <div className="p-6">
//             <div className="flex items-center justify-between">
//               <h2 className="text-3xl font-bold text-gray-800">
//                 আমার প্রোফাইল এবং সাবস্ক্রিপশন
//               </h2>
//               <div className="flex space-x-2">
//                 {userData.user.isVerified && (
//                   <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
//                     Verified
//                   </span>
//                 )}
//                 {userData.subscriptions[0]?.isPremium && (
//                   <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">
//                     Premium
//                   </span>
//                 )}
//               </div>
//             </div>
//             <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <p className="text-sm text-gray-500">Username</p>
//                 <p className="font-medium">{userData.user.userName}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Email</p>
//                 <p className="font-medium">{userData.user.email}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Location</p>
//                 <p className="font-medium">
//                   {userData.user.addresses.upazillas}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Organization</p>
//                 <p className="font-medium">
//                   {userData.user.addresses.organizations}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//           <div className="bg-white rounded-xl shadow p-6 flex items-start">
//             <div className="bg-blue-100 p-3 rounded-lg mr-4">
//               <FaCalendarAlt className="text-blue-600 text-xl" />
//             </div>
//             <div>
//               <h3 className="text-gray-500 text-sm">Subscription Validity</h3>
//               <p className="font-semibold">
//                 {formatDate(userData.subscriptions[0]?.subscriptionValidity)}
//               </p>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl shadow p-6 flex items-start">
//             <div className="bg-green-100 p-3 rounded-lg mr-4">
//               <FaBook className="text-green-600 text-xl" />
//             </div>
//             <div>
//               <h3 className="text-gray-500 text-sm">Packages</h3>
//               <p className="font-semibold">
//                 {userData.packages.length} Packages
//               </p>
//               <p className="text-xs text-gray-500">
//                 {Object.keys(packagesByClass).length} Classes
//               </p>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl shadow p-6 flex items-start">
//             <div className="bg-yellow-100 p-3 rounded-lg mr-4">
//               <FaMoneyBillWave className="text-yellow-600 text-xl" />
//             </div>
//             <div>
//               <h3 className="text-gray-500 text-sm">Payment</h3>
//               <p className="font-semibold">
//                 ৳{userData.subscriptions[0]?.price}
//               </p>
//               <p className="text-xs text-gray-500">
//                 via {userData.subscriptions[0]?.paymentMethod} (
//                 {userData.subscriptions[0]?.transactionId})
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Packages by Class */}
//         <div className="mb-6">
//           {Object.entries(packagesByClass).map(([className, packages]) => (
//             <div
//               key={className}
//               className="bg-white rounded-xl shadow-md overflow-hidden mb-4"
//             >
//               <div className="p-4 border-b">
//                 <h3 className="font-semibold flex items-center">
//                   <FaGraduationCap className="mr-2 text-gray-600" />
//                   Class {className} ({className})
//                 </h3>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
//                 {packages.map((pkg) => (
//                   <div
//                     key={pkg._id}
//                     className="border rounded-lg p-4 hover:shadow-md transition-shadow"
//                   >
//                     <h4 className="font-medium">{pkg.subjectName}</h4>
//                     <div className="flex justify-between items-center mt-2">
//                       <span className="text-xs bg-gray-100 px-2 py-1 rounded">
//                         {pkg.groupName}
//                       </span>
//                       <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
//                         Active
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Subscription Details Table */}
//         <div className="bg-white rounded-xl shadow-md overflow-hidden mb-5">
//           <div className="p-4 border-b">
//             <h3 className="font-semibold flex items-center">
//               <FaFileInvoice className="mr-2 text-gray-600" />
//               Subscription Details
//             </h3>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Subscription ID
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Phone
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Payment Method
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Amount
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Date
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {userData.subscriptions.map((sub) => (
//                   <tr key={sub._id}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {sub._id.substring(0, 12)}...
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {sub.name}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {sub.phoneNumber}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`px-2 py-1 text-xs rounded ${
//                           sub.paymentMethod === "bkash"
//                             ? "bg-blue-100 text-blue-800"
//                             : "bg-gray-100 text-gray-800"
//                         }`}
//                       >
//                         {sub.paymentMethod}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       ৳{sub.price}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`px-2 py-1 text-xs rounded ${
//                           sub.isApproved
//                             ? "bg-green-100 text-green-800"
//                             : "bg-yellow-100 text-yellow-800"
//                         }`}
//                       >
//                         {sub.isApproved ? "Approved" : "Pending"}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatDate(sub.createdAt)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useWindowSize } from "@uidotdev/usehooks";
import moment from "moment";
import {
  FaBook,
  FaCalendarAlt,
  FaFileInvoice,
  FaGraduationCap,
  FaMoneyBillWave,
} from "react-icons/fa";
import { useGetASubscriptionInfoOfAnUserQuery } from "../../../redux/api/slices/subscriptionSlice";
import ClientLoader from "../../../utils/loader/ClientLoader";

export default function SelfSubscriptions() {
  const size = useWindowSize();
  const email = localStorage.getItem("email");

  const { data: userData, isLoading: subscriptionLoader } =
    useGetASubscriptionInfoOfAnUserQuery(email);

  const isMobile = size?.width <= 600;

  if (subscriptionLoader) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClientLoader />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className={`mt-24 ${isMobile ? "mx-3" : "ms-[270px] me-3"}`}>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold">No Subscription Found</h2>
          <p>You don't have any active subscriptions.</p>
        </div>
      </div>
    );
  }

  const subscription = userData.subscriptions[0];

  const packagesByClass = userData.packages.reduce((acc, pkg) => {
    const className = pkg.subjectClassName.className;
    if (!acc[className]) acc[className] = [];
    acc[className].push(pkg);
    return acc;
  }, {});

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div
      className={`mt-24 solaimanlipi ${
        isMobile ? "mx-3" : "ms-[270px] me-3"
      }`}
    >
      <div className="w-full mx-auto">

        {/* Profile */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 text-wrap">
              আমার প্রোফাইল এবং সাবস্ক্রিপশন
            </h2>

            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
              {userData.user.isVerified && (
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded">
                  Verified
                </span>
              )}
              {subscription?.isPremium && (
                <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  Premium
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500">Username</p>
              <p className="font-medium">{userData.user.userName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-medium break-all">{userData.user.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Location</p>
              <p className="font-medium">
                {userData.user.addresses.upazillas}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Organization</p>
              <p className="font-medium">
                {userData.user.addresses.organizations}
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-xl shadow p-4 flex items-start">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <FaCalendarAlt className="text-blue-600 text-lg" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Subscription Validity</p>
              <p className="font-semibold text-sm">
                {formatDate(subscription?.subscriptionValidity)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 flex items-start">
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              <FaBook className="text-green-600 text-lg" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Packages</p>
              <p className="font-semibold text-sm">
                {userData.packages.length} Packages
              </p>
              <p className="text-[10px] text-gray-500">
                {Object.keys(packagesByClass).length} Classes
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 flex items-start">
            <div className="bg-yellow-100 p-2 rounded-lg mr-3">
              <FaMoneyBillWave className="text-yellow-600 text-lg" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Payment Summary</p>
              <p className="font-semibold text-sm">
                ৳{Number(subscription?.totalPrice ?? 0).toFixed(2)}
              </p>
              <p className="text-[10px] text-gray-500">
                {subscription?.purchases?.length} Payments
              </p>
            </div>
          </div>
        </div>

        {/* Packages */}
        <div className="mb-4">
          {Object.entries(packagesByClass).map(([cls, pkgs]) => (
            <div key={cls} className="bg-white rounded-xl shadow mb-3">
              <div className="p-3 border-b">
                <h3 className="font-semibold flex items-center text-sm">
                  <FaGraduationCap className="mr-2 text-gray-600" />
                  Class {cls}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3">
                {pkgs.map((pkg) => (
                  <div
                    key={pkg._id}
                    className="border rounded-lg p-3 hover:shadow transition"
                  >
                    <p className="font-medium text-sm">{pkg.subjectName}</p>
                    <div className="flex justify-between mt-2 text-[10px]">
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {pkg.groupName}
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                        Active
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* History Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden mb-5">
          <div className="p-3 border-b">
            <h3 className="font-semibold text-sm flex items-center">
              <FaFileInvoice className="mr-2 text-gray-600" />
              Purchase History
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-gray-50 text-[10px] uppercase">
                <tr>
                  <th className="px-4 py-2 text-left">SL</th>
                  <th className="px-4 py-2 text-left">Method</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Expired</th>
                </tr>
              </thead>

              <tbody>
                {subscription?.purchases?.map((p, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-2">{i + 1}</td>
                    <td className="px-4 py-2">{p.paymentMethod}</td>
                    <td className="px-4 py-2">৳{p.price}</td>
                    <td className="px-4 py-2">
                      {p.isApproved ? (
                        <span className="text-green-600">Approved</span>
                      ) : (
                        <span className="text-yellow-600">Pending</span>
                      )}
                    </td>
                    <td className="px-4 py-2">{moment(p.date).format("LLL")}</td>
                    <td className="px-4 py-2">
                       {p.expiredAt ? moment(p.expiredAt).format("LLL") : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
