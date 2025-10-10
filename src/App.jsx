import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home/home";
import Navbar from "./navbar/navbar";
import Footer from "./footer/footer";   // ✅ Import the Footer
import Login from "./login/login";
import RegistrationPage from "./registration/RegistrationPage";

const App = () => {
  return (
    <Router>
      {/* Navbar appears on all pages */}
      <Navbar />

      {/* Main content (page routes) */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<RegistrationPage />} />
      </Routes>

      {/* ✅ Footer appears on all pages */}
      <Footer />
    </Router>
  );
};

export default App;
