import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Pages/Home';
import Journal from "./Pages/Journal";
import MoodRecommender from './components/MoodRecommender';
import Profile from "./Pages/Profile";
import Landing from "./Pages/Landing";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/recommendations" element={<MoodRecommender />} />
      </Routes>
      <Footer />
    </Router>
    
  );
}

export default App;
