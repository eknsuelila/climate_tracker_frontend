import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home/home";
import Navbar from "./navbar/navbar";
import Login from "./login/LoginPage";
import Registration from "./registration/RegistrationPage"

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
      </Routes>
    </Router>
  );
};

export default App;