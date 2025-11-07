import ClientNavbar from "../../components/client/clientNavbar/ClientNavbar";
import { Outlet, useLocation } from "react-router";
// import { useWindowSize } from "@uidotdev/usehooks";
import AdminDashboard from "../../components/admin/adminDashboard/AdminDashboard";
import AdminSidebar from "../../components/admin/adminSidebar/AdminSidebar";
import Classes from "../../components/admin/classes/Classes";
import Subjects from "../../components/admin/subjects/Subjects";
import Chapter from "../../components/admin/chapter/Chapter";
import Exams from "../../components/admin/exams/Exams";
import All_user from "../../components/admin/all_user/All_user";
import AddMcqQuestion from "../../components/admin/chapter/addMcqQuestion/AddMcqQuestion";
import ReportManagement from "../../components/admin/reportManagement/ReportManagement";
import Announcement from "../../components/admin/announcement/Announcement";
import AllSubscriptions from "../../components/admin/allSubscriptions/AllSubscriptions";
import AllReadyQuesSubscription from "../../components/admin/allReadyQuesSubscriptions/AllReadyQuesSubscription";
import LectureShitSubscriptions from "../../components/admin/lectureShitSubscriptions/LectureShitSubscriptions";
import UpdateAQuestion from "../../components/admin/chapter/updateAQuestion/UpdateAQuestion";
import AddCqQuestion from "../../components/admin/chapter/addCqQuestion/AddCqQuestion";
import SeeAllQuestions from "../../components/admin/chapter/seeAllQuestions/SeeAllQuestions";
import SeeAllCqQuestions from "../../components/admin/chapter/seeAllCqQuestions/SeeAllCqQuestions";
import UpdateCqQuestion from "../../components/admin/chapter/updateCqQuestion/UpdateCqQuestion";
import AllTopics from "../../components/admin/all-topics/AllTopics";
import SeeAllShortQuestion from "../../components/admin/chapter/seeAllShortQuestion/SeeAllShortQuestion";
import UpdateShortQuestion from "../../components/admin/chapter/updateShortQuestion/UpdateShortQuestion";
import AddShortQuestion from "../../components/admin/chapter/addShortQuestion/AddShortQuestion";

export default function AdminLayout() {
  const location = useLocation();
  // const searchParams = new URLSearchParams(location.search);

  // const size = useWindowSize();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className=" flex-1">
        {/* Navbar */}
        <ClientNavbar />

        {/* Page Content */}
        <main className="">
          {location.pathname === "/admin/dashboard" && <AdminDashboard />}
          {location.pathname === "/admin/class" && <Classes />}
          {location.pathname === "/admin/all-topics" && <AllTopics />}
          {location.pathname === "/admin/subject" && <Subjects />}
          {location.pathname === "/admin/chapter" && <Chapter />}
          {location.pathname === "/admin/exam" && <Exams />}
          {location.pathname === "/admin/all-user" && <All_user />}
          {location.pathname === "/admin/all-report" && <ReportManagement />}
          {location.pathname === "/admin/announcement" && <Announcement />}
          {location.pathname === "/admin/all-subscriptions" && (
            <AllSubscriptions />
          )}
          {location.pathname.startsWith("/admin/chapter/update") && (
            <UpdateAQuestion />
          )}
          {location.pathname.startsWith("/admin/chapter/cq/update") && (
            <UpdateCqQuestion />
          )}
          {location.pathname.startsWith("/admin/chapter/short/update") && (
            <UpdateShortQuestion />
          )}
          {location.pathname === "/admin/all-ready-questions-set" && (
            <AllReadyQuesSubscription />
          )}
          {location.pathname === "/admin/all-lecture-shit-packages" && (
            <LectureShitSubscriptions />
          )}
          {location.pathname.startsWith("/admin/chapter/add-question/mcq/") && (
            <AddMcqQuestion />
          )}
          {location.pathname.startsWith("/admin/chapter/add-question/cq/") && (
            <AddCqQuestion />
          )}
          {location.pathname.startsWith(
            "/admin/chapter/add-question/short/"
          ) && <AddShortQuestion />}
          {location.pathname.startsWith(
            "/admin/see-all-questions/chapter/"
          ) && <SeeAllQuestions />}
          {location.pathname.startsWith(
            "/admin/see-all-questions/cq/chapter/"
          ) && <SeeAllCqQuestions />}
          {location.pathname.startsWith(
            "/admin/see-all-questions/short/chapter/"
          ) && <SeeAllShortQuestion />}
        </main>
        {Outlet}
      </div>
    </div>
  );
}
