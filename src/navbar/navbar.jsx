import { Link } from "react-router-dom";
import './navbar.css'
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
const Navbar = () => {
  return (
   
     
        <Row className="navbar-main ">
          <Col>
            Climate Tracker
          </Col>
          <Col>
            <Row>
              <Col>
                TIMELINE
              </Col>
              <Col>
                MAP
              </Col>
              <Col>
                ANALYTICS
              </Col>
              <Col>
              <Button variant="outline-info">SUBMIT AN EVENT</Button>
              </Col>
              <Col>
              LOGIN
              </Col>
              <Col>
              PROFILE
              </Col>
            </Row>
          </Col>
        </Row>
     
      
  );
};

export default Navbar;
