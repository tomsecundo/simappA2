import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NavbarComponent = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">Startup Incubation</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user && (
              <>
                <Nav.Link as={Link} to="/applications">Applications</Nav.Link>
                <Nav.Link as={Link} to="/startup">Startup</Nav.Link>
                <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {!user ? (
              <>
                <Nav.Link as={Link} to="/applications/apply" className="bg-green-500 px-4 py-2 mx-2 rounded hover:bg-green-700 text-black">Apply for Program</Nav.Link>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/#" >Logout</Nav.Link>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;