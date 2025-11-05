import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./home/home";
import Navbar from "./navbar/navbar";
import Footer from "./footer/footer";
import LoginPage from "./login/LoginPage";
import RegistrationPage from "./registration/RegistrationPage";
import PasswordResetPage from "./password/PasswordReset";
import PasswordUpdate from "./password/PasswordUpdate";
import Event from "./event/event";
import Analytics from "./analytics/analytics";
import Map from "./map/map";
import TimelinePage from "./timeline/timeline";
import Profile from "./profile/profile";
import EditProfile from "./profile/editProfile/editProfile";
import AdminOnlyRoute from "./components/AdminOnlyRoute";
import AboutUs from "./aboutus/AboutUs";


// Admin pages
import AdminLayout from "./admin/AdminLayout";
import Category from "./admin/Category";
import Events from "./admin/Events";
import Users from "./admin/Users";
import Settings from "./admin/Settings";

import 'bootstrap/dist/css/bootstrap.min.css';

const Layout = ({ children }) => {
  const location = useLocation();
  
  // Hide Navbar/Footer on all /admin routes
  const hideNavbarFooter = location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbarFooter && <Navbar />}
      {children}
      {!hideNavbarFooter && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/reset" element={<PasswordResetPage />} />
          <Route path="/reset-password" element={<PasswordUpdate />} />
          <Route path="/about" element={<AboutUs />} />


          {/* Admin Pages with sidebar */}
          <Route path="/admin" element={
            <AdminOnlyRoute>
              <AdminLayout />
            </AdminOnlyRoute>
          }>
            <Route index element={<Category />} />  {/* default page */}
            <Route path="category" element={<Category />} />
            <Route path="events" element={<Events />} />
            <Route path="users" element={<Users />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Protected Pages */}
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
      </Layout>
    </Router>
  );
};

export default App;
