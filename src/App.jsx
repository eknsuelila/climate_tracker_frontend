import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home/home";
import Navbar from "./navbar/navbar";
import Footer from "./footer/footer";   // ✅ Import the Footer
import LoginPage from "./login/LoginPage"
import RegistrationPage from "./registration/RegistrationPage";
import PasswordResetPage from "./password/PasswordReset";
const App = () => {
  return (
    <Router>
      {/* Navbar appears on all pages */}
      <Navbar />

      {/* Main content (page routes) */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
      <Route path="/reset" element={<PasswordResetPage />} />
      </Routes>

      {/* ✅ Footer appears on all0es */}
      <Footer />
    </Router>
  );
};

export default App;
