import "./App.css";
import HomePage from "./home/HomePage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SinglePage from "./components/watch/SinglePage";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Simulator from "./components/selfhatrd/Simulator";
import SimuStar from "./components/selfhatrd/SimmuStar";
import SimuLast from "./components/selfhatrd/SimuLast";
import Learn from "./components/selfhatrd/Learn";
import FinalSelf from "./components/selfhatrd/FinalSelf";
import TellSelf from "./components/selfhatrd/TellSelf";
import Register from "./components/login/Register";
import Login from "./components/login/Login";
import PostDetails from "./components/post/PostDetails";
import MoodTracking from "./components/mood/MoodTrecking";
import AddExpert from "./components/addExpert/AddExpert";
import MoodComparisonChart from "./components/mood/MoodComparisonChart";
import NewMoodAssessment from "./components/selfhatrd/NewMoodAssessment";
import CounselingChat from "./components/chat/CounselingChat";
import BroadcastChat from "./components/post/BroadcastChat";
import ExpertChatPage from "./components/chat/ExpertChatPage";
import Community from "./components/community/Community";
import Blogread from "./components/blog/Blogread";
import { AuthProvider } from "./components/login/auth/AuthContext";
import PrivateRoute  from "../src/components/login/auth/PrivateRoute";
import AudioPlayer from "./components/audio/AudioProvider";
import CommuPage from "./components/post/CommuPage";
import Clinic from "./components/clinic/Clinic";
import UserProfile from "./components/clinic/UserProfile";


function App() {
  return (
    <AuthProvider>
    <Router>
      <AudioPlayer />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* โหมดจำลอง */}
        <Route path="/simulator/:id" element={<PrivateRoute><Simulator /></PrivateRoute>} />
        <Route path="/simustar/:id" element={<SimuStar />} />
        <Route path="/simulast" element={<SimuLast />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/final-self" element={<FinalSelf />} />
        <Route path="/tellself" element={<TellSelf />} />
        {/* เข้าสู่ระบบ */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* ผู้เชี่ยวชาญ */}
        <Route path="/add-expert" element={<AddExpert />} />
        <Route path="/expert-chat" element={<ExpertChatPage />} />
        {/* แชท */}
        <Route path="/chat/:expertId" element={<CounselingChat />} />
        <Route path="/chat" element={<Community />} />
       
        {/* โพสต์ */}
        <Route path="/post/:postId" element={<PostDetails />} />
        <Route path="/commupage" element={<CommuPage />} />
        {/* ติดตามอารมณ์ */}
        <Route path="/mood-tracking" element={<MoodTracking />} />
        <Route path="/mood-comparison" element={<MoodComparisonChart />} />
        <Route path="/new-mood-assessment" element={<NewMoodAssessment />} />
        {/* บล็อค */}
        <Route path="/broadcast-chat" element={<BroadcastChat />} />
        <Route path="/blogread/:id" element={<Blogread />} />
        <Route path="/singlepage/:id" element={<SinglePage />} />
        {/* คลีนิค */}
        <Route path="/clinic" element={<Clinic />} />
        {/* โปรไฟล์ */}
        <Route path="/userprofile" element={<UserProfile />} />
      </Routes>
      {/* <Footer /> */}
    </Router>
    </AuthProvider>
  );
}

export default App;