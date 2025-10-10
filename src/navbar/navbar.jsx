import { Link } from "react-router-dom";
import './navbar.css'

const Navbar = () => {
  return (
    <nav className="navbar-main" >
      <Link to="/" style={{ marginRight: "10px" }}>Home</Link>
      <Link to="/login">Login</Link>
    </nav>
  );
};

export default Navbar;
