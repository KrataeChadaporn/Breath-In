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
import useAudio from "./components/Audio/AudioProvider";


function App() {
  
  return (
    <>
    
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/simulator/:id" element={<Simulator />} />
          <Route path="/simustar/:id" element={<SimuStar />} />
          <Route path="/simulast" element={<SimuLast />} /> 
          <Route path="/learn" element={<Learn />} /> 
          <Route path="/singlepage/:id" element={<SinglePage />} />
          <Route path="/final-self" element={<FinalSelf />} />
          <Route path="/tellself" element={<TellSelf />} />
        </Routes>
        {/* <Footer /> */}
      </Router>
     
    </>
  );
}

export default App;
