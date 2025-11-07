import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import LandingPage from "./components/client/landingPage/LandingPage.jsx";
import Login from "./components/auth/Login.jsx";
import AdminLogin from "./components/admin/auth/Login.jsx";
import MainNavbar from "./components/common/mainNavbar/MainNavbar.jsx";
import Terms_Conditions from "./components/client/terms_conditions/Terms_Conditions.jsx";
import Footer from "./components/client/landingPage/footer/Footer.jsx";
import PrivacyPolicies from "./components/client/privacyPolicies/PrivacyPolicies.jsx";
import RefundPolicies from "./components/client/refundPolicies/RefundPolicies.jsx";
import CancelletionPolicies from "./components/client/cancelletionPolicies/CancelletionPolicies.jsx";
import ClientLayout from "./layouts/clientLayout/ClientLayout.jsx";
import Dashboard from "./components/client/dashboard/Dashboard.jsx";
import QuestionCreate from "./components/client/questionCreate/QuestionCreate.jsx";
import QuestionBank from "./components/client/questionBank/QuestionBank.jsx";
import QuestionBankDetails from "./components/client/questionBank/questionBankDetails/QuestionBankDetails.jsx";
import { HeroUIProvider } from "@heroui/react";
import QuestionCreation from "./components/client/questionCreation/QuestionCreation.jsx";
import QuestionView from "./components/client/questionCreation/questionView/QuestionView.jsx";
import QuestionPaper from "./components/client/questionCreation/questionPaper/QuestionPaper.jsx";
import Subscriptions from "./components/client/subscriptions/Subscriptions.jsx";
import Offers from "./components/client/offers/Offers.jsx";
import AdminDashboard from "./components/admin/adminDashboard/AdminDashboard.jsx";
import AdminLayout from "./layouts/adminLayout/AdminLayout.jsx";
import Classes from "./components/admin/classes/Classes.jsx";
import Subjects from "./components/admin/subjects/Subjects.jsx";
import Chapter from "./components/admin/chapter/Chapter.jsx";
import Exams from "./components/admin/exams/Exams.jsx";
import All_user from "./components/admin/all_user/All_user.jsx";
import Register from "./components/auth/Register.jsx";
import { Provider } from "react-redux";
import { store } from "./store.js";
import ProtectedRoute from "./private/ProtectedRoute.jsx";
import AddMcqQuestion from "./components/admin/chapter/addMcqQuestion/AddMcqQuestion.jsx";
import ReportManagement from "./components/admin/reportManagement/ReportManagement.jsx";
import Announcement from "./components/admin/announcement/Announcement.jsx";
import SubjectsSubscriptionList from "./components/client/subjectsSubscriptionList/SubjectsSubscriptionList.jsx";
import AllSubscriptions from "./components/admin/allSubscriptions/AllSubscriptions.jsx";
import SelfMadeQuestionSet from "./components/client/selfMadeQuestionsSet/SelfMadeQuestionSet.jsx";
import VerifyPage from "./components/client/verifyPage/VerifyPage.jsx";
// import ProtectedRoute from "./private/ProtectedRoute.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Profile from "./components/common/profile/Profile.jsx";
import TenToTwelveClasses from "./components/client/readyQuesPackages/TenToTwelveClasses.jsx";
import AllReadyQuesSubscription from "./components/admin/allReadyQuesSubscriptions/AllReadyQuesSubscription.jsx";
import MyReadyQuesSets from "./components/client/myReadyQuesSets/MyReadyQuesSets.jsx";
import SixToEightClasses from "./components/client/readyQuesPackages/SixToEightClasses.jsx";
import OneToFiveClasses from "./components/client/readyQuesPackages/OneToFiveClasses.jsx";
import ShitTenToTwelve from "./components/client/lectureShitPackages/ShitTenToTwelve.jsx";
import MyLectureShitPackages from "./components/client/myLectureShitPackages/MyLectureShitPackages.jsx";
import LectureShitSubscriptions from "./components/admin/lectureShitSubscriptions/LectureShitSubscriptions.jsx";
import ShitSixToEight from "./components/client/lectureShitPackages/ShitSixToEight.jsx";
import ShitOneToFive from "./components/client/lectureShitPackages/ShitOneToFive.jsx";
import DemoQuestionCreate from "./components/client/demoQuestionCreate/DemoQuestionCreate.jsx";
import UpdateAQuestion from "./components/admin/chapter/updateAQuestion/UpdateAQuestion.jsx";
import ForgotPassword from "./components/auth/ForgotPassword.jsx";
import ResetPassword from "./components/auth/ResetPassword.jsx";
import AddCqQuestion from "./components/admin/chapter/addCqQuestion/AddCqQuestion.jsx";
import SeeAllQuestions from "./components/admin/chapter/seeAllQuestions/SeeAllQuestions.jsx";
import SeeAllCqQuestions from "./components/admin/chapter/seeAllCqQuestions/SeeAllCqQuestions.jsx";
import UpdateCqQuestion from "./components/admin/chapter/updateCqQuestion/UpdateCqQuestion.jsx";
import SelfSubscriptions from "./components/client/selfSubscriptions/SelfSubscriptions.jsx";
import AllTopics from "./components/admin/all-topics/AllTopics.jsx";
import CqQuestionView from "./components/client/questionCreation/cqQuestionView/CqQuestionView.jsx";
import CqQuestionPaper from "./components/client/questionCreation/questionPaper/CqQuestionPaper.jsx";
import SeeAllShortQuestion from "./components/admin/chapter/seeAllShortQuestion/SeeAllShortQuestion.jsx";
import UpdateShortQuestion from "./components/admin/chapter/updateShortQuestion/UpdateShortQuestion.jsx";
import ShortQusView from "./components/client/questionCreation/shortQuesView/ShortQusView.jsx";
import ShortQuestionPaper from "./components/client/questionCreation/questionPaper/ShortQuestionPaper.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HeroUIProvider>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route
                path="/terms_conditions"
                element={
                  <>
                    <MainNavbar></MainNavbar>
                    <Terms_Conditions />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/cancelletion_policies"
                element={
                  <>
                    <MainNavbar></MainNavbar>
                    <CancelletionPolicies />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/refund_policies"
                element={
                  <>
                    <MainNavbar></MainNavbar>
                    <RefundPolicies />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/privacy_policies"
                element={
                  <>
                    <MainNavbar></MainNavbar>
                    <PrivacyPolicies />
                    <Footer />
                  </>
                }
              />

              <Route
                path="/subscriptions"
                element={
                  <>
                    <MainNavbar></MainNavbar>
                    <Subscriptions />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/subscriptions-list"
                element={
                  <>
                    <MainNavbar></MainNavbar>
                    <SubjectsSubscriptionList />
                    <Footer />
                  </>
                }
              />

              <Route
                path="/ready-questions-set/ten-twelve"
                element={
                  <>
                    <MainNavbar></MainNavbar>
                    <TenToTwelveClasses />
                    <Footer />
                  </>
                }
              />

              <Route
                path="/ready-questions-set/six-eight"
                element={
                  <>
                    <MainNavbar></MainNavbar>
                    <SixToEightClasses />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/ready-questions-set/one-five"
                element={
                  <>
                    <MainNavbar></MainNavbar>
                    <OneToFiveClasses />
                    <Footer />
                  </>
                }
              />

              <Route
                path="/lecture-shit-questions-set/ten-twelve"
                element={
                  <>
                    <MainNavbar></MainNavbar>
                    <ShitTenToTwelve />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/lecture-shit-questions-set/six-eight"
                element={
                  <>
                    <MainNavbar></MainNavbar>
                    <ShitSixToEight />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/lecture-shit-questions-set/one-five"
                element={
                  <>
                    <MainNavbar></MainNavbar>
                    <ShitOneToFive />
                    <Footer />
                  </>
                }
              />

              <Route
                path="/offers"
                element={
                  <>
                    <MainNavbar></MainNavbar>
                    <Offers />
                    <Footer />
                  </>
                }
              />

              <Route
                path="/register"
                element={
                  <>
                    <MainNavbar />
                    <Register />
                  </>
                }
              />
              <Route
                path="/api/auth/verify/:token"
                element={
                  <>
                    <VerifyPage />
                  </>
                }
              />
              <Route
                path="/login"
                element={
                  <>
                    <MainNavbar />
                    <Login />
                  </>
                }
              />
              <Route
                path="/login/admin"
                element={
                  <>
                    <MainNavbar />
                    <AdminLogin />
                  </>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <>
                    <MainNavbar />
                    <ForgotPassword />
                  </>
                }
              />
              <Route
                path="/reset-password/:token"
                element={
                  <>
                    <MainNavbar />
                    <ResetPassword />
                  </>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <>
                    <MainNavbar />
                    <ForgotPassword />
                  </>
                }
              />
              {/* user panel */}
              <Route
                path="/user/*"
                element={
                  <ProtectedRoute>
                    <ClientLayout>
                      <Routes>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route
                          path="question-create"
                          element={<QuestionCreate />}
                        />
                        <Route
                          path="question-create-demo"
                          element={<DemoQuestionCreate />}
                        />
                        <Route
                          path="question-bank"
                          element={<QuestionBank />}
                        />
                        <Route path="/profile" element={<Profile />} />
                        <Route
                          path="new-question/layout/:id"
                          element={<QuestionCreation />}
                        />
                        <Route
                          path="view-question/:id"
                          element={<QuestionView />}
                        />
                        <Route
                          path="view-cq/:id"
                          element={<CqQuestionView />}
                        />
                        <Route
                          path="view-short/:id"
                          element={<ShortQusView />}
                        />
                        <Route
                          path="question-paper/:id"
                          element={<QuestionPaper />}
                        />
                        <Route
                          path="cq-question-paper/:id"
                          element={<CqQuestionPaper />}
                        />
                        <Route
                          path="short-question-paper/:id"
                          element={<ShortQuestionPaper />}
                        />
                        <Route
                          path="/question-bank-details/:id"
                          element={<QuestionBankDetails />}
                        />
                        <Route
                          path="/self-questions-set"
                          element={<SelfMadeQuestionSet />}
                        />
                        <Route
                          path="/self-subscriptions"
                          element={<SelfSubscriptions />}
                        />
                        <Route
                          path="/ready-questions-set"
                          element={<MyReadyQuesSets />}
                        />
                        <Route
                          path="/lecture-shit-packages"
                          element={<MyLectureShitPackages />}
                        />
                      </Routes>
                    </ClientLayout>
                  </ProtectedRoute>
                }
              />

              {/* admin panel */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <Routes>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="class" element={<Classes />} />
                        <Route path="subject" element={<Subjects />} />
                        <Route path="chapter" element={<Chapter />} />
                        <Route path="exam" element={<Exams />} />
                        <Route path="all-user" element={<All_user />} />
                        <Route path="all-topics" element={<AllTopics />} />
                        <Route
                          path="all-report"
                          element={<ReportManagement />}
                        />
                        <Route path="announcement" element={<Announcement />} />
                        <Route
                          path="all-subscriptions"
                          element={<AllSubscriptions />}
                        />
                        <Route
                          path="all-ready-questions-set"
                          element={<AllReadyQuesSubscription />}
                        />
                        <Route
                          path="all-lecture-shit-packages"
                          element={<LectureShitSubscriptions />}
                        />
                        <Route
                          path={`add-question/mcq/:id`}
                          element={<AddMcqQuestion />}
                        />
                        <Route
                          path={`see-all-questions/chapter/:id`}
                          element={<SeeAllQuestions />}
                        />
                        <Route
                          path={`see-all-questions/cq/chapter/:id`}
                          element={<SeeAllCqQuestions />}
                        />
                        <Route
                          path={`see-all-questions/short/chapter/:id`}
                          element={<SeeAllShortQuestion />}
                        />
                        <Route
                          path={`add-question/cq/:id`}
                          element={<AddCqQuestion />}
                        />
                        <Route
                          path="/chapter/update/:chapterId/question/:questionId"
                          element={<UpdateAQuestion />}
                        />
                        <Route
                          path="/chapter/cq/update/:chapterId/question/:questionId"
                          element={<UpdateCqQuestion />}
                        />
                        <Route
                          path="/chapter/short/update/:chapterId/question/:questionId"
                          element={<UpdateShortQuestion />}
                        />
                      </Routes>
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </Provider>
      </QueryClientProvider>
    </HeroUIProvider>
  </StrictMode>
);
