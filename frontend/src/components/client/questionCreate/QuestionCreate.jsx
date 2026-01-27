// import { Button, Card, Input, Select, SelectItem } from "@heroui/react";
// import { useWindowSize } from "@uidotdev/usehooks";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";

// import { useGetAllClassesQuery } from "../../../redux/api/slices/classSlice";
// import { useCreateAExamSetMutation } from "../../../redux/api/slices/examSetSlice";
// import { useGetAllExamsQuery } from "../../../redux/api/slices/examSlice";
// import { useGetASubjectQuery } from "../../../redux/api/slices/subjectSlice";
// import { useGetASubscriptionInfoOfAnUserQuery } from "../../../redux/api/slices/subscriptionSlice";
// import ClientLoader from "../../../utils/loader/ClientLoader";

// export const examType = [
//   { key: "সাপ্তাহিক পরীক্ষা", label: "সাপ্তাহিক পরীক্ষা" },
//   { key: "মডেল টেস্ট", label: "মডেল টেস্ট" },
//   { key: "অর্ধ-বার্ষিক পরীক্ষা", label: "অর্ধ-বার্ষিক পরীক্ষা" },
//   { key: "বার্ষিক পরীক্ষা", label: "বার্ষিক পরীক্ষা" },
// ];

// export default function QuestionCreate() {
//   const navigate = useNavigate();
//   const size = useWindowSize();
//   const email = localStorage.getItem("email");

//   const [changeSubjectId, setChangeSubjectId] = useState(null);
//   const [classFilteredPackages, setClassFilteredPackages] = useState([]);

//   const [formData, setFormData] = useState({
//     title: "",
//     className: "",
//     chapterId: [],
//     examCategory: "",
//     examType: "",
//     marks: 30,
//     email,
//   });

//   const { data: classes, isLoading: classLoader } =
//     useGetAllClassesQuery();
//   const { data: exams } = useGetAllExamsQuery();

//   const { data: subscriptionData, isLoading: subscriptionLoader } =
//     useGetASubscriptionInfoOfAnUserQuery(email);

//   const { data: subjectData, isLoading: subjectLoader } =
//     useGetASubjectQuery(changeSubjectId, { skip: !changeSubjectId });

//   const [createAExamSet, { isLoading }] =
//     useCreateAExamSetMutation();

//   // ---------------- ELIGIBILITY ----------------
//   const isUserVerified = subscriptionData?.user?.isVerified;
//   const hasSubscription = subscriptionData?.hasActiveSubscription;
//   const hasPackages = subscriptionData?.packages?.length > 0;

//   const isEligible =
//     isUserVerified &&
//     hasSubscription &&
//     hasPackages;

//   // ---------------- FILTER CLASS ----------------
//   useEffect(() => {
//     if (!isEligible || !classes || !subscriptionData?.packages) return;

//     const filtered = subscriptionData.packages.map((subject) => {
//       const classId = subject?.subjectClassName?._id;
//       const className = classes.find(
//         (cls) => cls._id === classId
//       )?.className;

//       return { _id: classId, className };
//     });

//     const unique = filtered.filter(
//       (v, i, a) => v._id && i === a.findIndex(t => t._id === v._id)
//     );

//     setClassFilteredPackages(unique);
//   }, [isEligible, classes, subscriptionData]);

//   // ---------------- HANDLERS ----------------
//   const handleChange = (field, value) => {
//     if (!isEligible) return;
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!isEligible || !changeSubjectId) return;

//     try {
//       const res = await createAExamSet({
//         ...formData,
//         subjectName: changeSubjectId,
//         marks: Number(formData.marks),
//       });

//       if (res?.data) {
//         Swal.fire({
//           icon: "success",
//           title: "প্রশ্ন সেট তৈরি হয়েছে",
//           timer: 1500,
//           showConfirmButton: false,
//         });
//         navigate(`/user/new-question/layout/${res.data._id}`);
//       } else {
//         throw new Error(res?.error?.data?.message);
//       }
//     } catch (err) {
//       Swal.fire({
//         icon: "error",
//         title: err.message || "কিছু সমস্যা হয়েছে",
//       });
//     }
//   };

//   if (classLoader || subscriptionLoader) {
//     return <ClientLoader />;
//   }

//   // ---------------- UI ----------------
//   return (
//     <div className={`me-3 ${size?.width <= 600 ? "ms-3 mt-20" : "ms-72 me-8"}`}>
//       <div className="flex justify-center items-center min-h-screen">
//         <Card className="w-full max-w-3xl p-5">

//           {/* HEADER */}
//           <div className="text-center bg-[#024645] p-6 rounded-lg mb-5">
//             <h2 className="text-3xl solaimanlipi text-white">
//               ১ ক্লিকে প্রশ্ন তৈরি করুন
//             </h2>
//             {!isEligible && (
//               <p className="text-red-300 mt-2 solaimanlipi">
//                 প্রশ্ন তৈরি করতে সাবস্ক্রিপশন প্রয়োজন
//               </p>
//             )}
//           </div>

//           {/* FORM */}
//           <form onSubmit={handleSubmit} className="space-y-4">

//             <Input
//               placeholder="প্রশ্নের টাইটেল লিখুন"
//               value={formData.title}
//               isRequired
//               isDisabled={!isEligible}
//               onChange={(e) => handleChange("title", e.target.value)}
//             />

//             {/* CLASS */}
//             <Select
//               placeholder="শ্রেণী নির্বাচন করুন"
//               isDisabled={!isEligible}
//               onChange={(e) =>
//                 setFormData(p => ({ ...p, className: e.target.value }))
//               }
//             >
//               {classFilteredPackages.map(cls => (
//                 <SelectItem key={cls._id} textValue={cls.className}>
//                   {cls.className}
//                 </SelectItem>
//               ))}
//             </Select>

//             {/* SUBJECT */}
//             <Select
//               placeholder="বিষয় নির্বাচন করুন"
//               isDisabled={!formData.className}
//             >
//               {formData.className ? (
//                 subscriptionData.packages
//                   .filter(
//                     s => s.subjectClassName?._id === formData.className
//                   )
//                   .map(sub => (
//                     <SelectItem
//                       key={sub._id}
//                       onClick={() => setChangeSubjectId(sub._id)}
//                       textValue={sub.subjectName}
//                     >
//                       {sub.subjectName}
//                     </SelectItem>
//                   ))
//               ) : (
//                 <SelectItem key="x" isDisabled>
//                   আগে শ্রেণী নির্বাচন করুন
//                 </SelectItem>
//               )}
//             </Select>

//             {/* CHAPTER */}
//             <Select
//               selectionMode="multiple"
//               placeholder="অধ্যায় নির্বাচন করুন"
//               isDisabled={!changeSubjectId}
//               onChange={(e) =>
//                 handleChange("chapterId", e.target.value)
//               }
//             >
//               {subjectLoader ? (
//                 <SelectItem key="l" isDisabled>Loading...</SelectItem>
//               ) : (
//                 subjectData?.chapters?.map(ch => (
//                   <SelectItem key={ch._id} value={ch._id}>
//                     {ch.chapterName}
//                   </SelectItem>
//                 ))
//               )}
//             </Select>

//             {/* EXAM TYPE */}
//             <Select
//               placeholder="পরীক্ষার ধরন"
//               isDisabled={!isEligible}
//               onChange={(e) => handleChange("examType", e.target.value)}
//             >
//               {examType.map(t => (
//                 <SelectItem key={t.key} textValue={t.label}>
//                   {t.label}
//                 </SelectItem>
//               ))}
//             </Select>

//             {/* CATEGORY */}
//             <Select
//               placeholder="প্রশ্নের ধরণ"
//               isDisabled={!isEligible}
//               onChange={(e) =>
//                 handleChange("examCategory", e.target.value)
//               }
//             >
//               {exams?.map(ex => (
//                 <SelectItem key={ex._id} textValue={ex.examName}>
//                   {ex.examName}
//                 </SelectItem>
//               ))}
//             </Select>

//             {/* MARKS */}
//             <Input
//               placeholder="পূর্ণমান"
//               type="number"
//               value={formData.marks}
//               isDisabled={!isEligible}
//               onChange={(e) => handleChange("marks", e.target.value)}
//             />

//             <Button
//               type="submit"
//               isDisabled={!isEligible}
//               isLoading={isLoading}
//               className={`w-full ${
//                 isEligible ? "bg-[#024645]" : "bg-red-500"
//               } text-white`}
//             >
//               প্রশ্ন সেট তৈরি করুন
//             </Button>
//           </form>
//         </Card>
//       </div>
//     </div>
//   );
// }

// import { Button, Card, Input, Select, SelectItem } from "@heroui/react";
// import { useWindowSize } from "@uidotdev/usehooks";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";

// import { useGetAllClassesQuery } from "../../../redux/api/slices/classSlice";
// import { useCreateAExamSetMutation } from "../../../redux/api/slices/examSetSlice";
// import { useGetAllExamsQuery } from "../../../redux/api/slices/examSlice";
// import { useGetASubjectQuery } from "../../../redux/api/slices/subjectSlice";
// import { useGetASubscriptionInfoOfAnUserQuery } from "../../../redux/api/slices/subscriptionSlice";
// import ClientLoader from "../../../utils/loader/ClientLoader";

// export const examType = [
//   { key: "সাপ্তাহিক পরীক্ষা", label: "সাপ্তাহিক পরীক্ষা" },
//   { key: "মডেল টেস্ট", label: "মডেল টেস্ট" },
//   { key: "অর্ধ-বার্ষিক পরীক্ষা", label: "অর্ধ-বার্ষিক পরীক্ষা" },
//   { key: "বার্ষিক পরীক্ষা", label: "বার্ষিক পরীক্ষা" },
// ];

// export default function QuestionCreate() {
//   const navigate = useNavigate();
//   const size = useWindowSize();
//   const email = localStorage.getItem("email");

//   const [changeSubjectId, setChangeSubjectId] = useState(null);
//   const [classFilteredPackages, setClassFilteredPackages] = useState([]);

//   const [formData, setFormData] = useState({
//     title: "",
//     className: "",
//     chapterId: [],
//     examCategory: "",
//     examType: "",
//     marks: 30,
//     email,
//   });

//   const { data: classes, isLoading: classLoader } =
//     useGetAllClassesQuery();
//   const { data: exams } = useGetAllExamsQuery();

//   const { data: subscriptionData, isLoading: subscriptionLoader } =
//     useGetASubscriptionInfoOfAnUserQuery(email);

//   const { data: subjectData, isLoading: subjectLoader } =
//     useGetASubjectQuery(changeSubjectId, { skip: !changeSubjectId });

//   const [createAExamSet, { isLoading }] =
//     useCreateAExamSetMutation();

//   /* ---------- ELIGIBILITY ---------- */
//   const isEligible =
//     subscriptionData?.user?.isVerified &&
//     subscriptionData?.hasActiveSubscription &&
//     subscriptionData?.packages?.length > 0;

//   /* ---------- FILTER CLASS ---------- */
//   useEffect(() => {
//     if (!isEligible || !classes || !subscriptionData?.packages) return;

//     const unique = [
//       ...new Map(
//         subscriptionData.packages.map(p => [
//           p.subjectClassName?._id,
//           {
//             _id: p.subjectClassName?._id,
//             className: classes.find(
//               c => c._id === p.subjectClassName?._id
//             )?.className,
//           },
//         ])
//       ).values(),
//     ];

//     setClassFilteredPackages(unique);
//   }, [isEligible, classes, subscriptionData]);

//   /* ---------- HANDLERS ---------- */
//   const handleChange = (field, value) => {
//     if (!isEligible) return;
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!isEligible || !changeSubjectId) return;

//     try {
//       const res = await createAExamSet({
//         ...formData,
//         subjectName: changeSubjectId,
//         marks: Number(formData.marks),
//       });

//       if (res?.data) {
//         Swal.fire({
//           icon: "success",
//           title: "প্রশ্ন সেট তৈরি হয়েছে",
//           timer: 1500,
//           showConfirmButton: false,
//         });
//         navigate(`/user/new-question/layout/${res.data._id}`);
//       }
//     } catch (err) {
//       Swal.fire({
//         icon: "error",
//         title: "কিছু সমস্যা হয়েছে",
//       });
//     }
//   };

//   if (classLoader || subscriptionLoader) {
//     return <ClientLoader />;
//   }

//   /* ---------- UI ---------- */
//   return (
//     <div className={`${size?.width <= 600 ? "mx-3 mt-20" : "ms-72 me-8"}`}>
//       <div className="min-h-screen flex justify-center items-center">
//         <Card className="w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden">

//           {/* HEADER */}
//           <div className="bg-gradient-to-r from-[#024645] to-[#036d6c] p-8 text-center">
//             <h2 className="text-4xl text-white solaimanlipi">
//               ১ ক্লিকে প্রশ্ন তৈরি করুন
//             </h2>
//             <p className="text-white/80 mt-2 solaimanlipi">
//               নিচের তথ্যগুলো পূরণ করে প্রশ্ন সেট তৈরি করুন
//             </p>
//           </div>

//           {/* FORM */}
//           <form
//             onSubmit={handleSubmit}
//             className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-5"
//           >
//             <Input
//               className="md:col-span-2"
//               placeholder="প্রশ্নের টাইটেল লিখুন"
//               value={formData.title}
//               isDisabled={!isEligible}
//               onChange={(e) =>
//                 handleChange("title", e.target.value)
//               }
//             />

//             <Select
//               placeholder="শ্রেণী নির্বাচন করুন"
//               isDisabled={!isEligible}
//               onChange={(e) =>
//                 handleChange("className", e.target.value)
//               }
//             >
//               {classFilteredPackages.map(cls => (
//                 <SelectItem key={cls._id} textValue={cls.className}>
//                   {cls.className}
//                 </SelectItem>
//               ))}
//             </Select>

//             <Select
//               placeholder="বিষয় নির্বাচন করুন"
//               isDisabled={!formData.className}
//             >
//               {formData.className ? (
//                 subscriptionData.packages
//                   .filter(
//                     s =>
//                       s.subjectClassName?._id ===
//                       formData.className
//                   )
//                   .map(sub => (
//                     <SelectItem
//                       key={sub._id}
//                       onClick={() =>
//                         setChangeSubjectId(sub._id)
//                       }
//                       textValue={sub.subjectName}
//                     >
//                       {sub.subjectName}
//                     </SelectItem>
//                   ))
//               ) : (
//                 <SelectItem key="x" isDisabled>
//                   আগে শ্রেণী নির্বাচন করুন
//                 </SelectItem>
//               )}
//             </Select>

//             <Select
//               selectionMode="multiple"
//               placeholder="অধ্যায় নির্বাচন করুন"
//               isDisabled={!changeSubjectId}
//               onChange={(e) =>
//                 handleChange("chapterId", e.target.value)
//               }
//             >
//               {subjectLoader ? (
//                 <SelectItem key="l" isDisabled>
//                   Loading...
//                 </SelectItem>
//               ) : (
//                 subjectData?.chapters?.map(ch => (
//                   <SelectItem key={ch._id} value={ch._id}>
//                     {ch.chapterName}
//                   </SelectItem>
//                 ))
//               )}
//             </Select>

//             <Select
//               placeholder="পরীক্ষার ধরন"
//               onChange={(e) =>
//                 handleChange("examType", e.target.value)
//               }
//             >
//               {examType.map(t => (
//                 <SelectItem key={t.key} textValue={t.label}>
//                   {t.label}
//                 </SelectItem>
//               ))}
//             </Select>

//             <Select
//               placeholder="প্রশ্নের ধরণ"
//               onChange={(e) =>
//                 handleChange("examCategory", e.target.value)
//               }
//             >
//               {exams?.map(ex => (
//                 <SelectItem key={ex._id} textValue={ex.examName}>
//                   {ex.examName}
//                 </SelectItem>
//               ))}
//             </Select>

//             <Input
//               type="number"
//               placeholder="পূর্ণমান"
//               value={formData.marks}
//               onChange={(e) =>
//                 handleChange("marks", e.target.value)
//               }
//             />

//             <Button
//               type="submit"
//               isLoading={isLoading}
//               isDisabled={!isEligible}
//               className="md:col-span-2 bg-[#024645] hover:bg-[#036d6c] text-white text-lg"
//             >
//               প্রশ্ন সেট তৈরি করুন
//             </Button>
//           </form>
//         </Card>
//       </div>
//     </div>
//   );
// }

// import { Button, Card, Input, Select, SelectItem } from "@heroui/react";
// import { useWindowSize } from "@uidotdev/usehooks";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import { useGetAllClassesQuery } from "../../../redux/api/slices/classSlice";
// import { useCreateAExamSetMutation } from "../../../redux/api/slices/examSetSlice";
// import { useGetAllExamsQuery } from "../../../redux/api/slices/examSlice";
// import {
//   useGetAllSubjectsQuery,
//   useGetASubjectQuery,
// } from "../../../redux/api/slices/subjectSlice";
// import { useGetASubscriptionInfoOfAnUserQuery } from "../../../redux/api/slices/subscriptionSlice";
// import ClientLoader from "../../../utils/loader/ClientLoader";

// export const examType = [
//   { key: "সাপ্তাহিক পরীক্ষা", label: "সাপ্তাহিক পরীক্ষা" },
//   { key: "মডেল টেস্ট", label: "মডেল টেস্ট" },
//   // { key: "প্রি-টেস্ট", label: "প্রি-টেস্ট" },
//   // { key: "টেস্ট-এক্সাম", label: "টেস্ট-এক্সাম" },
//   // { key: "ক্লাস-টেস্ট", label: "ক্লাস-টেস্ট" },
//   // { key: "বিষয় ভিত্তিক", label: "বিষয় ভিত্তিক" },
//   // { key: "অধ্যায় ভিত্তিক", label: "অধ্যায় ভিত্তিক" },
//   // { key: "মাসিক পরীক্ষা", label: "মাসিক পরীক্ষা" },
//   { key: "অর্ধ-বার্ষিক পরীক্ষা", label: "অর্ধ-বার্ষিক পরীক্ষা" },
//   { key: "বার্ষিক পরীক্ষা", label: "বার্ষিক পরীক্ষা" },
// ];

// export default function QuestionCreate() {
//   const navigate = useNavigate();
//   const size = useWindowSize();
//   const email = localStorage?.getItem("email");
//   const [changeSubjectId, setChangeSubjectId] = useState();

//   const [formData, setFormData] = useState({
//     title: "",
//     className: "",
//     subjectName: "",
//     chapterId: [],
//     examCategory: "",
//     examType: "",
//     marks: 30,
//     questionIds: [],
//     email: email,
//   });
//   const [classFilteredPackages, setClassFilteredPackages] = useState([]);

//   const { data: getAllClasses, isLoading: classLoader } =
//     useGetAllClassesQuery();
//   const { data: getAllSubjects } = useGetAllSubjectsQuery();

//   const [createAExamSet, { isLoading }] = useCreateAExamSetMutation();

//   const { data: getAllExam } = useGetAllExamsQuery();
//   const { data: getSubscriptionInfoData, isLoading: subscriptionLoader } =
//     useGetASubscriptionInfoOfAnUserQuery(email);

//   // Check user status
//   const isUserVerified = getSubscriptionInfoData?.user?.isVerified;
//   const hasUserPaid = getSubscriptionInfoData?.user?.payment;
//   const hasSubscription = getSubscriptionInfoData?.user?.subscription;
//   const isSubscriptionApproved =
//     getSubscriptionInfoData?.subscriptions?.[0]?.isApproved;
//   const hasPackages = getSubscriptionInfoData?.packages?.length > 0;

//   // Check if user is eligible to create questions
//   const isEligible =
//     isUserVerified &&
//     // hasUserPaid &&
//     hasSubscription &&
//     isSubscriptionApproved &&
//     hasPackages;

//   useEffect(() => {
//     if (isEligible && getAllSubjects && getAllClasses) {
//       const filtered = getSubscriptionInfoData.packages.map((subject) => {
//         const classId = subject?.subjectClassName?._id;
//         const className = getAllClasses.find(
//           (cls) => cls._id === classId
//         )?.className;

//         return {
//           _id: classId,
//           className,
//         };
//       });

//       const uniqueFiltered = filtered.filter(
//         (item, index, self) =>
//           item._id && index === self.findIndex((t) => t._id === item._id)
//       );

//       setClassFilteredPackages(uniqueFiltered);
//     }
//   }, [isEligible, getSubscriptionInfoData, getAllSubjects, getAllClasses]);

//   const { data: getASubjectData, isLoading: subjectLoader } =
//     useGetASubjectQuery(changeSubjectId);

//   const handleChange = (field, value) => {
//     if (!isEligible) return;

//     if (field === "chapterId") {
//       const chaptersArray =
//         typeof value === "string"
//           ? value.split(",")
//           : Array.isArray(value)
//             ? value
//             : [value];
//       setFormData((prev) => ({
//         ...prev,
//         [field]: chaptersArray,
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [field]: value,
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!isEligible) return;

//     const newData = {
//       ...formData,
//       marks: Number(formData?.marks),
//       subjectName: changeSubjectId,
//     };
//     try {
//       const res = await createAExamSet(newData);
//       if (res?.data) {
//         const uniqueKey = res.data?._id;
//         Swal.fire({
//           title: "আপনার প্রশ্ন সেট তৈরি হয়েছে",
//           icon: "success",
//           showCloseButton: true,
//           showConfirmButton: false,
//           timer: 1500,
//         });
//         console.log("res data", res?.data);
//         navigate(`/user/new-question/layout/${uniqueKey}`);
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
//         title: error?.message,
//         icon: "error",
//         showCloseButton: true,
//         showConfirmButton: false,
//         timer: 1500,
//       });
//     } finally {
//       setFormData({
//         title: "",
//         className: "",
//         subjectName: "",
//         chapterId: [],
//         examCategory: "",
//         examType: "",
//         marks: 0,
//       });
//     }
//   };

//   if (classLoader || subscriptionLoader) {
//     return <ClientLoader />;
//   }

//   // Error messages for different conditions
//   const getErrorMessage = () => {
//     if (!isUserVerified) return "আপনার অ্যাকাউন্ট ভেরিফাই করা হয়নি";
//     if (!hasUserPaid) return "আপনার পেমেন্ট সম্পন্ন হয়নি";
//     if (!hasSubscription) return "আপনার কোনো সাবস্ক্রিপশন নেই";
//     if (!isSubscriptionApproved) return "সাবস্ক্রিপশন অনুমোদনের অপেক্ষায়";
//     if (!hasPackages) return "আপনার কোনো প্যাকেজ নেই";
//     return "";
//   };

//   return (
//     <div className={`me-3 ${size?.width <= 600 ? "ms-3 mt-20" : "ms-72 me-8"}`}>
//       <div className="flex justify-center items-center w-full min-h-screen flex-col space-y-4 max-w-3xl mx-auto">
//         <Card className="w-full  mt-16 mb-10 bg-white">
//           <div className="rounded-t-xl border border-gray-200">
//             {/* Top colored buttons bar */}
//             <div className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded-t-xl border-b">
//               <div className="flex items-center gap-2">
//                 <span className="w-4 h-4 bg-red-500 rounded-full"></span>
//                 <span className="w-4 h-4 bg-yellow-400 rounded-full"></span>
//                 <span className="w-4 h-4 bg-green-500 rounded-full"></span>
//               </div>

//               <div>
//                 <h2 className="text-gray-400 text-sm font-medium">৩.৫২</h2>
//               </div>
//             </div>
//           </div>

//           <div className="text-center space-y-2 bg-[#024645] min-h-56 p-5">
//             <div className="mb-10">
//               <p className="solaimanlipi text-4xl text-white drop-shadow-sm">
//                 ১ ক্লিকে আপনার প্রশ্ন তৈরি করুন!
//               </p>
//               <p className="solaimanlipi font-thin text-xl text-white ">
//                 নিচের তথ্যগুলো দিয়ে আপনার প্রশ্ন তৈরি করুন
//               </p>
//             </div>
//             <button className="bg-white text-gray-700 px-3 cursor-pointer py-1 text-xl font-bold rounded-full hover:bg-gray-100">
//               Subscribe Now!
//             </button>
//           </div>
//           <form
//             onSubmit={handleSubmit}
//             className="space-y-2 mt-10 w-[350px] md:w-[550px] mx-auto"
//           >
//             {/* ✅ Title - Full width */}
//             <div>
//               <Input
//                 size="md"
//                 className="solaimanlipi w-full text-xl hover:border-green-300 transition-colors"
//                 placeholder="প্রশ্নের টাইটেল লিখুন"
//                 isRequired
//                 variant="bordered"
//                 value={formData.title}
//                 onChange={(e) => handleChange("title", e.target.value)}
//                 classNames={{
//                   input: "text-xl solaimanlipi",
//                   inputWrapper: "h-8",
//                   label: "text-xl solaimanlipi",
//                 }}
//               // isDisabled={!isEligible}
//               />
//             </div>

//             {/* ✅ Class & Subject - 2 columns */}
//             <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-5">
//               {/* Class Select */}
//               <Select
//                 className="max-w-full"
//                 isRequired
//                 placeholder="শ্রেণী সিলেক্ট করুন"
//                 onChange={(e) => handleChange("className", e.target.value)}
//                 classNames={{
//                   trigger: `min-h-8 text-xl solaimanlipi border-2 rounded-xl px-4`,
//                   value: "text-xl solaimanlipi",
//                   listboxWrapper: "max-h-[400px]",
//                   popoverContent: "text-xl solaimanlipi",
//                   label: "text-xl solaimanlipi",
//                 }}
//               // isDisabled={!isEligible}
//               // variant={isEligible ? "bordered" : "flat"}
//               // color={isEligible ? "default" : "danger"}
//               >
//                 {/* {isEligible ? (
//                   classFilteredPackages?.map((item) => (
//                     <SelectItem
//                       key={item?._id}
//                       className="text-xl solaimanlipi px-4 py-2 hover:bg-green-200"
//                       textValue={item.className}
//                     >
//                       <span className="text-xl">{item?.className}</span>
//                     </SelectItem>
//                   ))
//                 ) : (
//                   <SelectItem
//                     key="error-message"
//                     isDisabled
//                     textValue={getErrorMessage()}
//                     className="text-red-600"
//                   >
//                     <span className="text-xl">{getErrorMessage()}</span>

//                   </SelectItem>
//                 )} */}
//                 {
//                   classFilteredPackages?.map((item) => (
//                     <SelectItem
//                       key={item?._id}
//                       className="text-xl solaimanlipi px-4 py-2 hover:bg-green-200"
//                       textValue={item.className}
//                     >
//                       <span className="text-xl">{item?.className}</span>
//                     </SelectItem>
//                   ))
//                 }
//               </Select>

//               {/* Subject Select */}
//               <Select
//                 className="max-w-full"
//                 isRequired
//                 variant="bordered"
//                 // color={isEligible ? "default" : "danger"}
//                 placeholder={
//                   "বিষয় নির্বাচন করুন"
//                 }
//                 onChange={(e) => handleChange("subjectName", e.target.value)}
//                 classNames={{
//                   label: "text-xl solaimanlipi",
//                   trigger: `min-h-8 text-xl solaimanlipi`,
//                   value: "text-xl solaimanlipi",
//                   listboxWrapper: "max-h-[400px]",
//                   popoverContent: "text-xl solaimanlipi",
//                 }}
//               //isDisabled={!isEligible || !formData.className}
//               >
//                 {/* {isEligible ? (
//                   formData.className ? (
//                     getSubscriptionInfoData?.packages
//                       ?.filter(
//                         (subject) =>
//                           subject.subjectClassName?._id === formData?.className
//                       )
//                       ?.map((subject) => (
//                         <SelectItem
//                           key={subject?._id}
//                           onClick={() => setChangeSubjectId(subject?._id)}
//                           textValue={subject?.subjectName}
//                         >
//                           <p className="text-xl">{subject.subjectName}</p>
//                         </SelectItem>
//                       ))
//                   ) : (
//                     <SelectItem
//                       key="select-class-first"
//                       isDisabled
//                       textValue="প্রথমে শ্রেণী নির্বাচন করুন"
//                     >
//                       <p className="text-xl">প্রথমে শ্রেণী নির্বাচন করুন</p>
//                     </SelectItem>
//                   )
//                 ) : (
//                   <SelectItem
//                     key="error-message"
//                     isDisabled
//                     textValue={getErrorMessage()}
//                     className="text-red-600"
//                   >
//                     <span className="text-xl">{getErrorMessage()}</span>
//                   </SelectItem>
//                 )} */}
//                 {
//                   formData.className ? (
//                     getSubscriptionInfoData?.packages
//                       ?.filter(
//                         (subject) =>
//                           subject.subjectClassName?._id === formData?.className
//                       )
//                       ?.map((subject) => (
//                         <SelectItem
//                           key={subject?._id}
//                           onClick={() => setChangeSubjectId(subject?._id)}
//                           textValue={subject?.subjectName}
//                         >
//                           <p className="text-xl">{subject.subjectName}</p>
//                         </SelectItem>
//                       ))
//                   ) : (
//                     <SelectItem
//                       key="select-class-first"
//                       isDisabled
//                       textValue="প্রথমে শ্রেণী নির্বাচন করুন"
//                     >
//                       <p className="text-xl">প্রথমে শ্রেণী নির্বাচন করুন</p>
//                     </SelectItem>
//                   )
//                 }
//               </Select>
//             </div>

//             {/* ✅ Chapter - Full width */}
//             <div>
//               <Select
//                 className="w-full"
//                 isRequired
//                 variant="bordered"
//                 // color={isEligible ? "default" : "danger"}
//                 selectionMode="multiple"
//                 placeholder={
//                   "অধ্যায় সিলেক্ট করুন"
//                 }
//                 onChange={(e) => {
//                   const value = e.target.value;
//                   if (value === "select-all") {
//                     const allIds =
//                       getASubjectData?.chapters?.map((ch) => ch?._id) || [];
//                     handleChange("chapterId", allIds);
//                   } else {
//                     handleChange("chapterId", value);
//                   }
//                 }}
//                 value={formData?.chapterId}
//                 classNames={{
//                   label: "text-xl solaimanlipi",
//                   trigger: `min-h-8 text-xl solaimanlipi`,
//                   value: "text-xl solaimanlipi",
//                   listboxWrapper: "max-h-[400px]",
//                   popoverContent: "text-xl solaimanlipi",
//                 }}
//               // isDisabled={!isEligible || !changeSubjectId || subjectLoader}
//               >
//                 {/* {isEligible ? (
//                   changeSubjectId ? (
//                     subjectLoader ? (
//                       <SelectItem key="loading" value="loading" isDisabled>
//                         <span className="text-xl solaimanlipi text-blue-600">
//                           loading...
//                         </span>
//                       </SelectItem>
//                     ) : (
//                       <>
//                         <SelectItem
//                           key="select-all"
//                           value="select-all"
//                           className="text-xl solaimanlipi px-4 py-2 font-semibold text-blue-600"
//                           textValue="✅ সবগুলো অধ্যায় নির্বাচন করুন"
//                         >
//                           <span className="text-xl">
//                             ✅ সবগুলো অধ্যায় নির্বাচন করুন
//                           </span>
//                         </SelectItem>
//                         {getASubjectData?.chapters?.map((item) => (
//                           <SelectItem
//                             key={item?._id}
//                             value={item?._id}
//                             className="text-xl solaimanlipi px-4 py-2"
//                             textValue={item?.chapterName}
//                           >
//                             <span className="text-xl">{item?.chapterName}</span>
//                           </SelectItem>
//                         ))}
//                       </>
//                     )
//                   ) : (
//                     <SelectItem
//                       key="select-subject-first"
//                       textValue="প্রথমে বিষয় নির্বাচন করুন"
//                     >
//                       <p className="text-xl">প্রথমে বিষয় নির্বাচন করুন</p>
//                     </SelectItem>
//                   )
//                 ) : (
//                   <SelectItem
//                     key="error-message"
//                     textValue={getErrorMessage()}
//                     className="text-red-600"
//                   >
//                     <span className="text-xl">{getErrorMessage()}</span>
//                   </SelectItem>
//                 )} */}

//                 {
//                   changeSubjectId ? (
//                     subjectLoader ? (
//                       <SelectItem key="loading" value="loading" isDisabled>
//                         <span className="text-xl solaimanlipi text-blue-600">
//                           loading...
//                         </span>
//                       </SelectItem>
//                     ) : (
//                       <>
//                         <SelectItem
//                           key="select-all"
//                           value="select-all"
//                           className="text-xl solaimanlipi px-4 py-2 font-semibold text-blue-600"
//                           textValue="✅ সবগুলো অধ্যায় নির্বাচন করুন"
//                         >
//                           <span className="text-xl">
//                             ✅ সবগুলো অধ্যায় নির্বাচন করুন
//                           </span>
//                         </SelectItem>
//                         {getASubjectData?.chapters?.map((item) => (
//                           <SelectItem
//                             key={item?._id}
//                             value={item?._id}
//                             className="text-xl solaimanlipi px-4 py-2"
//                             textValue={item?.chapterName}
//                           >
//                             <span className="text-xl">{item?.chapterName}</span>
//                           </SelectItem>
//                         ))}
//                       </>
//                     )
//                   ) : (
//                     <SelectItem
//                       key="select-subject-first"
//                       textValue="প্রথমে বিষয় নির্বাচন করুন"
//                     >
//                       <p className="text-xl">প্রথমে বিষয় নির্বাচন করুন</p>
//                     </SelectItem>
//                   )
//                 }
//               </Select>
//             </div>

//             {/* ✅ ExamType, ExamCategory, Marks - 3 columns in md+lg */}
//             <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 gap-5">
//               {/* Exam Type */}
//               <Select
//                 className="max-w-full"
//                 isRequired
//                 variant="bordered"
//                 // color={isEligible ? "default" : "danger"}
//                 placeholder="পরীক্ষার ধরণ"
//                 onChange={(e) => handleChange("examType", e.target.value)}
//                 classNames={{
//                   label: "text-xl solaimanlipi",
//                   trigger: `min-h-8 text-xl solaimanlipi`,
//                   value: "text-xl solaimanlipi",
//                   listboxWrapper: "max-h-[400px]",
//                   popoverContent: "text-xl solaimanlipi",
//                 }}
//               // isDisabled={!isEligible}
//               >
//                 {/* {isEligible ? (
//                   examType?.map((item) => (
//                     <SelectItem
//                       key={item?.key}
//                       className="text-xl solaimanlipi px-4 py-2"
//                       textValue={item?.label}
//                     >
//                       <span className="text-xl">{item?.label}</span>
//                     </SelectItem>
//                   ))
//                 ) : (
//                   <SelectItem
//                     key="error-message"
//                     isDisabled
//                     textValue={getErrorMessage()}
//                     className="text-red-600"
//                   >
//                     <span className="text-xl">{getErrorMessage()}</span>
//                   </SelectItem>
//                 )} */}

//                 {
//                   examType?.map((item) => (
//                     <SelectItem
//                       key={item?.key}
//                       className="text-xl solaimanlipi px-4 py-2"
//                       textValue={item?.label}
//                     >
//                       <span className="text-xl">{item?.label}</span>
//                     </SelectItem>
//                   ))
//                 }
//               </Select>

//               {/* Exam Category */}
//               <Select
//                 className="max-w-full"
//                 isRequired
//                 variant="bordered"
//                 // color={isEligible ? "default" : "danger"}
//                 placeholder={
//                   "টাইপ সিলেক্ট করুন"
//                 }
//                 onChange={(e) => handleChange("examCategory", e.target.value)}
//                 classNames={{
//                   label: "text-xl solaimanlipi",
//                   trigger: `min-h-8 text-xl solaimanlipi`,
//                   value: "text-xl solaimanlipi",
//                   listboxWrapper: "max-h-[400px]",
//                   popoverContent: "text-xl solaimanlipi",
//                 }}
//               // isDisabled={!isEligible}
//               >
//                 {/* {isEligible ? (
//                   getAllExam?.map((item) => {
//                     const displayName =
//                       item?.examName === "সংক্ষিপ্ত প্রশ্ন"
//                         ? "সমন্বিত প্রশ্ন (সং. প্রশ্ন + সৃ. প্রশ্ন + বহু. প্রশ্ন)"
//                         : item?.examName;
//                     return (
//                       <SelectItem
//                         key={item?._id}
//                         className="text-xl solaimanlipi px-4 py-2"
//                         textValue={displayName}
//                       >
//                         <span className="text-xl">{displayName}</span>
//                       </SelectItem>
//                     );
//                   })
//                 ) : (
//                   <SelectItem
//                     key="error-message"
//                     isDisabled
//                     textValue={getErrorMessage()}
//                     className="text-red-600"
//                   >
//                     <span className="text-xl">{getErrorMessage()}</span>
//                   </SelectItem>
//                 )} */}

//                 {
//                   getAllExam?.map((item) => {
//                     const displayName =
//                       item?.examName === "সংক্ষিপ্ত প্রশ্ন"
//                         ? "সমন্বিত প্রশ্ন (সং. প্রশ্ন + সৃ. প্রশ্ন + বহু. প্রশ্ন)"
//                         : item?.examName;
//                     return (
//                       <SelectItem
//                         key={item?._id}
//                         className="text-xl solaimanlipi px-4 py-2"
//                         textValue={displayName}
//                       >
//                         <span className="text-xl">{displayName}</span>
//                       </SelectItem>
//                     );
//                   })
//                 }
//               </Select>

//               {/* Marks */}
//               <Input
//                 size="md"
//                 className="solaimanlipi w-full"
//                 variant="bordered"
//                 // color={isEligible ? "default" : "danger"}
//                 value={formData.marks}
//                 onChange={(e) =>
//                   handleChange("marks", e.target.value.replace(/[^0-9]/g, ""))
//                 }
//                 placeholder={
//                   "পূর্ণ মান দিন (যেমন: ১০, ২০, বা ৩০)"
//                 }
//                 isRequired
//                 type="text"
//                 classNames={{
//                   input: "solaimanlipi",
//                   inputWrapper: "h-8",
//                   label: "solaimanlipi",
//                 }}
//               // isDisabled={!isEligible}
//               />
//             </div>

//             {/* ✅ Submit button */}
//             <div className="pb-5">
//               <Button
//                 className={`mt-5 p-3 solaimanlipi w-full text-white text-xl ${isEligible
//                   ? "bg-[#024645] hover:bg-[#003338]"
//                   : "bg-red-500 cursor-not-allowed"
//                   }`}
//                 radius="lg"
//                 size="lg"
//                 type="submit"
//                 isLoading={isLoading}
//                 isDisabled={!isEligible}
//               >
//                 {isEligible
//                   ? "প্রশ্নসেট তৈরি করুন"
//                   : "প্রশ্ন তৈরি করতে সাবস্ক্রাইব করুন"}
//               </Button>
//             </div>

//             {/* {!isEligible && (
//               <div className="mt-4 text-center">
//                 <Link to="/">
//                   <Button className="p-3 solaimanlipi bg-[#024645] text-white text-xl font-bold hover:bg-[#003338]">
//                     সাবস্ক্রিপশন পেজে যান
//                   </Button>
//                 </Link>
//               </div>
//             )} */}
//           </form>
//         </Card>
//       </div>
//     </div>
//   );
// }

import { Button, Card, Input, Select, SelectItem } from "@heroui/react";
import { useWindowSize } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { useGetAllClassesQuery } from "../../../redux/api/slices/classSlice";
import { useCreateAExamSetMutation } from "../../../redux/api/slices/examSetSlice";
import { useGetAllExamsQuery } from "../../../redux/api/slices/examSlice";
import { useGetASubjectQuery } from "../../../redux/api/slices/subjectSlice";
import { useGetASubscriptionInfoOfAnUserQuery } from "../../../redux/api/slices/subscriptionSlice";
import ClientLoader from "../../../utils/loader/ClientLoader";

export const examType = [
  { key: "সাপ্তাহিক পরীক্ষা", label: "সাপ্তাহিক পরীক্ষা" },
  { key: "মডেল টেস্ট", label: "মডেল টেস্ট" },
  { key: "অর্ধ-বার্ষিক পরীক্ষা", label: "অর্ধ-বার্ষিক পরীক্ষা" },
  { key: "বার্ষিক পরীক্ষা", label: "বার্ষিক পরীক্ষা" },
];

export default function QuestionCreate() {
  const navigate = useNavigate();
  const size = useWindowSize();
  const email = localStorage.getItem("email");

  const [changeSubjectId, setChangeSubjectId] = useState(null);
  const [classFilteredPackages, setClassFilteredPackages] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    className: "",
    chapterId: [],
    examCategory: "",
    examType: "",
    marks: 30,
    email,
  });

  // Fetch data
  const { data: classes, isLoading: classLoader } = useGetAllClassesQuery();
  const { data: exams } = useGetAllExamsQuery();
  const { data: subscriptionData, isLoading: subscriptionLoader } =
    useGetASubscriptionInfoOfAnUserQuery(email);
  const { data: subjectData, isLoading: subjectLoader } = useGetASubjectQuery(
    changeSubjectId,
    { skip: !changeSubjectId },
  );
  const [createAExamSet, { isLoading }] = useCreateAExamSetMutation();

  /* ---------- CORRECTED ELIGIBILITY ---------- */
  // প্রথমে সব প্রপার্টি আলাদাভাবে সংজ্ঞায়িত করি
  const isUserVerified = subscriptionData?.user?.isVerified;
  const hasSubscription = subscriptionData?.user?.subscription;

  // বিভিন্ন জায়গায় isApproved চেক করি
  const isSubscriptionApproved =
    subscriptionData?.user?.isSubscriptionApproved ||
    subscriptionData?.subscriptions?.[0]?.isApproved ||
    subscriptionData?.user?.subscription?.isApproved ||
    true; // যদি API তে এই ফিল্ড না থাকে তবে default true ধরি

  const hasPackages = subscriptionData?.packages?.length > 0;

  // Boolean হিসেবে convert করি
  const isEligible = Boolean(
    isUserVerified && hasSubscription && isSubscriptionApproved && hasPackages,
  );

  /* ---------- FILTER CLASSES ---------- */
  useEffect(() => {
    if (!subscriptionData?.packages || !classes) {
      setClassFilteredPackages([]);
      return;
    }

    // Filter unique classes from packages
    const uniqueClassesMap = new Map();

    subscriptionData.packages.forEach((pkg, index) => {
      const classId = pkg.subjectClassName?._id;
      if (classId) {
        const classInfo = classes.find((c) => c._id === classId);
        if (classInfo) {
          if (!uniqueClassesMap.has(classId)) {
            const subjectsInThisClass = subscriptionData.packages.filter(
              (p) => p.subjectClassName?._id === classId,
            );
            uniqueClassesMap.set(classId, {
              _id: classId,
              className: classInfo.className,
              subjectCount: subjectsInThisClass.length,
              // Debug info
              subjects: subjectsInThisClass.map((s) => s.subjectName),
            });
          }
        } else {
          console.log(`Class not found for ID: ${classId}`);
        }
      } else {
        console.log(`Package ${index + 1} has no class ID`);
      }
    });

    const uniqueClasses = Array.from(uniqueClassesMap.values());

    setClassFilteredPackages(uniqueClasses);
  }, [subscriptionData, classes]);

  /* ---------- GET SUBJECTS FOR SELECTED CLASS ---------- */
  const getSubjectsForSelectedClass = () => {
    if (!formData.className || !subscriptionData?.packages) {
      return [];
    }

    const subjects = subscriptionData.packages.filter(
      (pkg) => pkg.subjectClassName?._id === formData.className,
    );

    return subjects;
  };

  /* ---------- HANDLERS ---------- */
  const handleChange = (field, value) => {
    console.log(`Changing ${field} to:`, value);

    if (field === "className") {
      // Reset subject when class changes
      setChangeSubjectId(null);
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        chapterId: [],
      }));
    } else if (field === "chapterId") {
      setFormData((prev) => ({
        ...prev,
        [field]: Array.isArray(value) ? value : [value],
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubjectSelect = (subjectId) => {
    setChangeSubjectId(subjectId);

    // Also update formData
    const selectedSubject = getSubjectsForSelectedClass().find(
      (s) => s._id === subjectId,
    );
    if (selectedSubject) {
      console.log("Selected subject:", selectedSubject.subjectName);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEligible) {
      Swal.fire({
        icon: "error",
        title: "সাবস্ক্রিপশন প্রয়োজন",
        html: `
          <div class="text-right">
            <p>প্রশ্ন তৈরি করতে আপনাকে সাবস্ক্রাইব করতে হবে</p>
            <p class="text-sm text-gray-600 mt-2">স্ট্যাটাস:</p>
            <ul class="text-sm text-gray-600 text-right">
              <li>ভেরিফাইড: ${isUserVerified ? "✅" : "❌"}</li>
              <li>সাবস্ক্রিপশন: ${hasSubscription ? "✅" : "❌"}</li>
              <li>অনুমোদিত: ${isSubscriptionApproved ? "✅" : "❌"}</li>
              <li>প্যাকেজ: ${hasPackages ? "✅" : "❌"}</li>
            </ul>
          </div>
        `,
        showConfirmButton: true,
        confirmButtonText: "বুঝেছি",
      });
      return;
    }

    if (!changeSubjectId) {
      Swal.fire({
        icon: "error",
        title: "বিষয় নির্বাচন করুন",
        text: "দয়া করে একটি বিষয় নির্বাচন করুন",
        showConfirmButton: true,
      });
      return;
    }

    // Validate form
    if (
      !formData.title ||
      !formData.className ||
      !formData.examType ||
      !formData.examCategory ||
      !formData.marks ||
      formData.chapterId.length === 0
    ) {
      Swal.fire({
        icon: "error",
        title: "ফর্ম অসম্পূর্ণ",
        text: "দয়া করে সবগুলো ফিল্ড পূরণ করুন",
        showConfirmButton: true,
      });
      return;
    }

    try {
      const payload = {
        title: formData.title,
        className: formData.className,
        subjectName: changeSubjectId,
        chapterId: formData.chapterId,
        examCategory: formData.examCategory,
        examType: formData.examType,
        marks: Number(formData.marks),
        email: email,
        questionIds: [],
      };

      const res = await createAExamSet(payload);

      if (res?.data) {
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: "প্রশ্ন সেট তৈরি হয়েছে",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate(`/user/new-question/layout/${res.data._id}`);
      } else if (res?.error) {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি!",
          text: res.error.data?.message || "কিছু সমস্যা হয়েছে",
          showConfirmButton: true,
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: err.message || "সার্ভারে সমস্যা হয়েছে",
        showConfirmButton: true,
      });
    }
  };

  /* ---------- LOADING STATE ---------- */
  if (classLoader || subscriptionLoader) {
    return <ClientLoader />;
  }

  /* ---------- GET ERROR MESSAGE ---------- */
  const getErrorMessage = () => {
    if (!subscriptionData) return "লোডিং...";
    if (!isUserVerified) return "অ্যাকাউন্ট ভেরিফাই করা হয়নি";
    if (!hasSubscription) return "কোনো সাবস্ক্রিপশন নেই";
    if (!isSubscriptionApproved) return "সাবস্ক্রিপশন অনুমোদনের অপেক্ষায়";
    if (!hasPackages) return "কোনো প্যাকেজ নেই";
    return "";
  };

  const errorMessage = getErrorMessage();

  return (
    <div className={`me-3 ${size?.width <= 600 ? "ms-3 mt-5" : "ms-72 me-8"}`}>
      <div className="flex justify-center items-center w-full min-h-screen flex-col space-y-4 max-w-3xl mx-auto">
        <Card className="w-full mt-16 mb-10 bg-white">
          <div className="text-center space-y-2 bg-[#024645] h-42 md:min-h-52 p-5">
            <div className="mb-5 md:mb-10">
              <p className="solaimanlipi text-2xl md:text-4xl text-white drop-shadow-sm">
                ১ ক্লিকে আপনার প্রশ্ন তৈরি করুন!
              </p>
              <p className="solaimanlipi font-thin text-xl text-white ">
                নিচের তথ্যগুলো দিয়ে আপনার প্রশ্ন তৈরি করুন
              </p>
            </div>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-2 md:space-y-4 mt-10 w-[350px] md:w-[550px] mx-auto pb-8"
          >
            {/* Title */}
            <div>
              <Input
                size="lg"
                className="solaimanlipi w-full text-lg"
                placeholder="প্রশ্নের টাইটেল লিখুন"
                isRequired
                variant="bordered"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                isDisabled={!isEligible}
                classNames={{
                  input: "text-lg solaimanlipi",
                }}
              />
            </div>

            {/* Class & Subject */}
            <div className="grid grid-cols-2  gap-4">
              {/* Class Select */}
              <Select
                className="solaimanlipi"
                isRequired
                placeholder={
                  isEligible ? "শ্রেণী নির্বাচন করুন" : "সাবস্ক্রিপশন প্রয়োজন"
                }
                selectedKeys={formData.className ? [formData.className] : []}
                onSelectionChange={(keys) => {
                  const key = Array.from(keys)[0];
                  if (key) handleChange("className", key);
                }}
                isDisabled={!isEligible}
                variant="bordered"
                size="lg"
              >
                {isEligible && classFilteredPackages.length > 0 ? (
                  classFilteredPackages.map((item) => (
                    <SelectItem
                      key={item._id}
                      className="solaimanlipi"
                      textValue={item.className}
                    >
                      <div className="flex justify-between items-center">
                        <span>{item.className}</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {item.subjectCount} বিষয়
                        </span>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem
                    key="no-classes"
                    isDisabled
                    className="solaimanlipi"
                  >
                    {isEligible
                      ? "কোন ক্লাস পাওয়া যায়নি"
                      : "সাবস্ক্রিপশন প্রয়োজন"}
                  </SelectItem>
                )}
              </Select>

              {/* Subject Select */}
              <Select
                className="solaimanlipi"
                isRequired
                placeholder={
                  !isEligible
                    ? "সাবস্ক্রিপশন প্রয়োজন"
                    : !formData.className
                      ? "প্রথমে শ্রেণী নির্বাচন করুন"
                      : "বিষয় নির্বাচন করুন"
                }
                selectedKeys={changeSubjectId ? [changeSubjectId] : []}
                onSelectionChange={(keys) => {
                  const key = Array.from(keys)[0];
                  if (key) handleSubjectSelect(key);
                }}
                isDisabled={!isEligible || !formData.className}
                variant="bordered"
                size="lg"
              >
                {isEligible && formData.className ? (
                  getSubjectsForSelectedClass().length > 0 ? (
                    getSubjectsForSelectedClass().map((subject) => (
                      <SelectItem
                        key={subject._id}
                        className="solaimanlipi"
                        textValue={subject.subjectName}
                      >
                        {subject.subjectName}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem
                      key="no-subjects"
                      isDisabled
                      className="solaimanlipi"
                    >
                      এই ক্লাসে কোনো বিষয় নেই
                    </SelectItem>
                  )
                ) : (
                  <SelectItem
                    key="disabled"
                    isDisabled
                    className="solaimanlipi"
                  >
                    {!isEligible
                      ? "সাবস্ক্রিপশন প্রয়োজন"
                      : "প্রথমে শ্রেণী নির্বাচন করুন"}
                  </SelectItem>
                )}
              </Select>
            </div>

            {/* Chapter Select */}
            <div>
              <Select
                className="solaimanlipi w-full"
                isRequired
                placeholder={
                  !isEligible
                    ? "সাবস্ক্রিপশন প্রয়োজন"
                    : !changeSubjectId
                      ? "প্রথমে বিষয় নির্বাচন করুন"
                      : "অধ্যায় নির্বাচন করুন"
                }
                selectionMode="multiple"
                selectedKeys={new Set(formData.chapterId)}
                onSelectionChange={(keys) => {
                  handleChange("chapterId", Array.from(keys));
                }}
                isDisabled={!isEligible || !changeSubjectId}
                variant="bordered"
                size="lg"
              >
                {isEligible && changeSubjectId ? (
                  subjectLoader ? (
                    <SelectItem key="loading" isDisabled>
                      <span className="solaimanlipi">লোডিং...</span>
                    </SelectItem>
                  ) : subjectData?.chapters?.length > 0 ? (
                    subjectData.chapters.map((chapter) => (
                      <SelectItem
                        key={chapter._id}
                        className="solaimanlipi"
                        textValue={chapter.chapterName}
                      >
                        {chapter.chapterName}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem
                      key="no-chapters"
                      isDisabled
                      className="solaimanlipi"
                    >
                      এই বিষয়ে কোনো অধ্যায় নেই
                    </SelectItem>
                  )
                ) : (
                  <SelectItem
                    key="disabled"
                    isDisabled
                    className="solaimanlipi"
                  >
                    {!isEligible
                      ? "সাবস্ক্রিপশন প্রয়োজন"
                      : "প্রথমে বিষয় নির্বাচন করুন"}
                  </SelectItem>
                )}
              </Select>
            </div>

            {/* Exam Type, Category, Marks */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Exam Type */}
              <Select
                className="solaimanlipi"
                isRequired
                placeholder={
                  !isEligible ? "সাবস্ক্রিপশন প্রয়োজন" : "পরীক্ষার ধরন"
                }
                selectedKeys={formData.examType ? [formData.examType] : []}
                onSelectionChange={(keys) => {
                  const key = Array.from(keys)[0];
                  if (key) handleChange("examType", key);
                }}
                isDisabled={!isEligible}
                variant="bordered"
                size="lg"
              >
                {isEligible ? (
                  examType.map((item) => (
                    <SelectItem
                      key={item.key}
                      className="solaimanlipi"
                      textValue={item.label}
                    >
                      {item.label}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem
                    key="disabled"
                    isDisabled
                    className="solaimanlipi"
                  >
                    সাবস্ক্রিপশন প্রয়োজন
                  </SelectItem>
                )}
              </Select>

              {/* Exam Category */}
              <Select
                className="solaimanlipi"
                isRequired
                placeholder={
                  !isEligible ? "সাবস্ক্রিপশন প্রয়োজন" : "প্রশ্নের ধরণ"
                }
                selectedKeys={
                  formData.examCategory ? [formData.examCategory] : []
                }
                onSelectionChange={(keys) => {
                  const key = Array.from(keys)[0];
                  if (key) handleChange("examCategory", key);
                }}
                isDisabled={!isEligible}
                variant="bordered"
                size="lg"
              >
                {isEligible && exams ? (
                  exams.map((exam) => {
                    const displayName =
                      exam.examName === "সংক্ষিপ্ত প্রশ্ন"
                        ? "সমন্বিত প্রশ্ন"
                        : exam.examName;
                    return (
                      <SelectItem
                        key={exam._id}
                        className="solaimanlipi"
                        textValue={displayName}
                      >
                        {displayName}
                      </SelectItem>
                    );
                  })
                ) : (
                  <SelectItem
                    key="disabled"
                    isDisabled
                    className="solaimanlipi"
                  >
                    সাবস্ক্রিপশন প্রয়োজন
                  </SelectItem>
                )}
              </Select>

              {/* Marks */}
              <Input
                size="lg"
                className="solaimanlipi"
                placeholder={!isEligible ? "সাবস্ক্রিপশন প্রয়োজন" : "পূর্ণমান"}
                type="number"
                min="1"
                max="100"
                value={formData.marks}
                onChange={(e) => handleChange("marks", e.target.value)}
                isRequired
                isDisabled={!isEligible}
                variant="bordered"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className={`w-full solaimanlipi text-lg h-12 ${
                  isEligible
                    ? "bg-[#024645] hover:bg-[#003338] text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                radius="lg"
                size="lg"
                isLoading={isLoading}
                isDisabled={!isEligible || isLoading}
              >
                {isEligible ? "প্রশ্নসেট তৈরি করুন" : "সাবস্ক্রাইব করুন"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
