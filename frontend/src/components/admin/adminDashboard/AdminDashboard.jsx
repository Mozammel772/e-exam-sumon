import ClassIcon from "../../../assets/ClassIcon";
import SubjectIcon from "../../../assets/SubjectIcon";
import ChapterIcon from "../../../assets/ChapterIcon";
import ExamTypeIcon from "../../../assets/ExamTypeIcon";
import UserIcon from "../../../assets/UserIcon";
import TopicsIcon from "../../../assets/TopicsIcon";
import { useGetAllUsersQuery } from "../../../redux/api/slices/authSlice";
import { Link } from "react-router";
import { useGetAllClassesQuery } from "../../../redux/api/slices/classSlice";
import { useGetAllSubjectsQuery } from "../../../redux/api/slices/subjectSlice";
import { useGetAllChaptersQuery } from "../../../redux/api/slices/chapterSlice";
import ClientLoader from "../../../utils/loader/ClientLoader";
import { useGetAllExamsQuery } from "../../../redux/api/slices/examSlice";

import { Skeleton } from "@heroui/skeleton";
import { useGetAllTopicsQuery } from "../../../redux/api/slices/topicsSlice";

export default function AdminDashboard() {
  const token = localStorage.getItem("token");

  const { data: getUsersData } = useGetAllUsersQuery(token);
  const { data: getAllClasses } = useGetAllClassesQuery();
  const { data: getAllSubjects } = useGetAllSubjectsQuery();
  const { data: getAllTopics } = useGetAllTopicsQuery();
  const { data: getAllChapters, isLoading: chapterLoader } =
    useGetAllChaptersQuery();

  const { data: getAllExams, isLoading: examLoader } = useGetAllExamsQuery();

  if (chapterLoader) {
    return <ClientLoader />;
  }
  return (
    <div className="ms-[270px] mt-24 me-3">
      <p className="text-center font-bold text-5xl pt-5 solaimanlipi">
        অ্যাডমিন প্যানেল - ড্যাশবোর্ড{" "}
      </p>
      <div className="grid grid-cols-1 gap-4 px-4 mt-8 sm:grid-cols-4 sm:px-8">
        <Link to="/admin/class">
          <div className="flex items-center bg-white border rounded-sm overflow-hidden shadow hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out">
            <div className="p-4 bg-green-400">
              <ClassIcon size="48px" color="#ffffff" />
            </div>
            <div className="px-4 text-gray-700">
              <h3 className="text-sm tracking-wider">Total Classes</h3>
              <p className="text-3xl">{getAllClasses?.length}</p>
            </div>
          </div>
        </Link>
        <Link to="/admin/subject">
          <div className="flex items-center bg-white border rounded-sm overflow-hidden shadow hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out">
            <div className="p-4 bg-blue-400">
              <SubjectIcon size="48px" color="#ffffff" />
            </div>
            <div className="px-4 text-gray-700">
              <h3 className="text-sm tracking-wider">Total Subjects</h3>
              <p className="text-3xl">{getAllSubjects?.length}</p>
            </div>
          </div>
        </Link>
        <Link to="/admin/chapter">
          <div className="flex items-center bg-white border rounded-sm overflow-hidden shadow hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out">
            <div className="p-4 bg-purple-700">
              <ChapterIcon size="48px" color="#ffffff" />
            </div>
            <div className="px-4 text-gray-700">
              <h3 className="text-sm tracking-wider">Total Chapters</h3>
              <p className="text-3xl">{getAllChapters?.length}</p>
            </div>
          </div>
        </Link>
        <div className="flex items-center bg-white border rounded-sm overflow-hidden shadow">
          <div className="p-4 bg-red-400">
            <ExamTypeIcon size="48px" color="#ffffff" />
          </div>
          {examLoader ? (
            <Skeleton className="rounded-lg">
              <div className="h-24 rounded-lg bg-default-300" />
            </Skeleton>
          ) : (
            <div className="px-4 text-gray-700">
              <h3 className="text-sm tracking-wider">Total Exam Type</h3>
              <p className="text-3xl">{getAllExams?.length}</p>
            </div>
          )}
        </div>
        <Link to="/admin/all-user">
          <div className="flex items-center bg-white border rounded-sm overflow-hidden shadow hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out">
            <div className="p-4 bg-[#024645]">
              <UserIcon size="48px" color="#ffffff" />
            </div>

            <div className="px-4 text-gray-700">
              <h3 className="text-sm tracking-wider">Total User</h3>
              <p className="text-3xl">{getUsersData?.length}</p>
            </div>
          </div>
        </Link>
        <Link to="/admin/all-topics">
          <div className="flex items-center bg-white border rounded-sm overflow-hidden shadow hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out">
            <div className="p-4 bg-[#F8BB62]">
              <TopicsIcon size="48px" color="#ffffff" />
            </div>

            <div className="px-4 text-gray-700">
              <h3 className="text-sm tracking-wider">Total Topics</h3>
              <p className="text-3xl">{getAllTopics?.length}</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
