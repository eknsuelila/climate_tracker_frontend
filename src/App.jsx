import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home/home";
import Navbar from "./navbar/navbar";
import LoginPage from "./login/LoginPage";
import RegistrationPage from "./registration/RegistrationPage"
import PasswordResetPage from "./password/PasswordReset";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/reset" element={<PasswordResetPage />} />
      </Routes>
    </Router>
  );
};

export default App;
