import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home/home";
import Navbar from "./navbar/navbar";
import Footer from "./footer/footer";
import LoginPage from "./login/LoginPage";
import RegistrationPage from "./registration/RegistrationPage";
import PasswordResetPage from "./password/PasswordReset";
import Event from "./event/event";
import Analytics from "./analytics/analytics";
import Map from "./map/map";
import TimelinePage from "./timeline/timeline";
import Profile from "./profile/profile";
import EditProfile from "./profile/editProfile/editProfile"; // ✅ Import EditProfile

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/reset" element={<PasswordResetPage />} />
        <Route path="/submit-event" element={<Event />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/map" element={<Map />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} /> {/* ✅ Add EditProfile route */}
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
