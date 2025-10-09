import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home/home";
import Navbar from "./navbar/navbar";
import Login from "./login/login";
import RegistrationPage from "./registration/RegistrationPage"

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<RegistrationPage />} />
      </Routes>
    </Router>
  );
};

export default App;
