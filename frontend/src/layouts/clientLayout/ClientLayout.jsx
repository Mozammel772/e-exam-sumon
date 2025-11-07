import ClientSidebar from "../../components/client/clientSidebar/ClientSidebar";
import ClientNavbar from "../../components/client/clientNavbar/ClientNavbar";
import { Outlet, useLocation } from "react-router";
import Dashboard from "../../components/client/dashboard/Dashboard";
import QuestionCreate from "../../components/client/questionCreate/QuestionCreate";
import QuestionBank from "../../components/client/questionBank/QuestionBank";
import QuestionBankDetails from "../../components/client/questionBank/questionBankDetails/QuestionBankDetails";
import QuestionCreation from "../../components/client/questionCreation/QuestionCreation";
import QuestionView from "../../components/client/questionCreation/questionView/QuestionView";
// import { useWindowSize } from "@uidotdev/usehooks";
import QuestionPaper from "../../components/client/questionCreation/questionPaper/QuestionPaper";
import SelfMadeQuestionSet from "../../components/client/selfMadeQuestionsSet/SelfMadeQuestionSet";
import Profile from "../../components/common/profile/Profile";
import TenToTwelveClasses from "../../components/client/readyQuesPackages/TenToTwelveClasses";
import MyReadyQuesSets from "../../components/client/myReadyQuesSets/MyReadyQuesSets";
import SixToEightClasses from "../../components/client/readyQuesPackages/SixToEightClasses";
import OneToFiveClasses from "../../components/client/readyQuesPackages/OneToFiveClasses";
import ShitTenToTwelve from "../../components/client/lectureShitPackages/ShitTenToTwelve";
import MyLectureShitPackages from "../../components/client/myLectureShitPackages/MyLectureShitPackages";
import ShitSixToEight from "../../components/client/lectureShitPackages/ShitSixToEight";
import ShitOneToFive from "../../components/client/lectureShitPackages/ShitOneToFive";
import DemoQuestionCreate from "../../components/client/demoQuestionCreate/DemoQuestionCreate";
import SelfSubscriptions from "../../components/client/selfSubscriptions/SelfSubscriptions";
import CqQuestionView from "../../components/client/questionCreation/cqQuestionView/CqQuestionView";
import CqQuestionPaper from "../../components/client/questionCreation/questionPaper/CqQuestionPaper";
import ShortQusView from "../../components/client/questionCreation/shortQuesView/ShortQusView";
import ShortQuestionPaper from "../../components/client/questionCreation/questionPaper/ShortQuestionPaper";

export default function ClientLayout() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // const size = useWindowSize();

  // console.log(searchParams?.size);
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <ClientSidebar />

      {/* Main Content */}
      <div className=" flex-1">
        {/* Navbar */}
        <ClientNavbar />

        {/* Page Content */}
        <main className="">
          {location.pathname === "/user/dashboard" && <Dashboard />}
          {location.pathname === "/user/profile" && <Profile />}
          {location.pathname === "/user/question-create" && <QuestionCreate />}
          {location.pathname === "/user/question-create-demo" && (
            <DemoQuestionCreate />
          )}
          {location.pathname === "/user/question-bank" && <QuestionBank />}
          {location.pathname === "/user/ready-questions-set/ten-twelve" && (
            <TenToTwelveClasses />
          )}
          {location.pathname === "/user/ready-questions-set/six-eight" && (
            <SixToEightClasses />
          )}
          {location.pathname === "/user/ready-questions-set/one-five" && (
            <OneToFiveClasses />
          )}
          {location.pathname ===
            "/user/lecture-shit-questions-set/ten-twelve" && (
            <ShitTenToTwelve />
          )}
          {location.pathname ===
            "/user/lecture-shit-questions-set/six-eight" && <ShitSixToEight />}
          {location.pathname ===
            "/user/lecture-shit-questions-set/one-five" && <ShitOneToFive />}
          {location.pathname === "/user/ready-questions-set" && (
            <MyReadyQuesSets />
          )}
          {location.pathname === "/user/lecture-shit-packages" && (
            <MyLectureShitPackages />
          )}
          {location.pathname === "/user/self-questions-set" && (
            <SelfMadeQuestionSet />
          )}
          {location.pathname === "/user/self-subscriptions" && (
            <SelfSubscriptions />
          )}
          {location.pathname.startsWith("/user/view-question") && (
            <QuestionView />
          )}
          {location.pathname.startsWith("/user/view-cq") && <CqQuestionView />}
          {location.pathname.startsWith("/user/view-short") && <ShortQusView />}
          {location.pathname.startsWith("/user/question-paper") && (
            <QuestionPaper />
          )}
          {location.pathname.startsWith("/user/cq-question-paper") && (
            <CqQuestionPaper />
          )}
          {location.pathname.startsWith("/user/short-question-paper") && (
            <ShortQuestionPaper />
          )}
          {location.pathname.startsWith("/user/new-question/layout") && (
            <QuestionCreation />
          )}
          {searchParams?.size === 1 && <QuestionBankDetails />}
          {Outlet}
        </main>
      </div>
    </div>
  );
}
