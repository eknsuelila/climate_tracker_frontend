import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
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
import EditProfile from "./profile/editProfile/editProfile";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/reset" element={<PasswordResetPage />} />
        <Route path="/submit-event" element={
          <ProtectedRoute>
            <Event />
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        } />
        <Route path="/map" element={
          <ProtectedRoute>
            <Map />
          </ProtectedRoute>
        } />
        <Route path="/timeline" element={
          <ProtectedRoute>
            <TimelinePage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/edit-profile" element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        } />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
