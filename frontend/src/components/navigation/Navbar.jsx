import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../constants/UserRole';

const NavbarComponent = () => {
  const { user, logout, hasAnyRole, isAdmin, isMentor } = useAuth();
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
                {/* Show Applications link only to Admin and Mentor */}
                {hasAnyRole([UserRole.ADMIN, UserRole.MENTOR]) && (
                  <Nav.Link as={Link} to="/applications">Applications</Nav.Link>
                )}
                
                {/* Show Applications link only to Admin and Mentor */}
                {hasAnyRole([UserRole.ADMIN, UserRole.MENTOR]) && (
                  <Nav.Link as={Link} to="/startup">Startup</Nav.Link>
                )}

                {/* Show Mentor List link only to Admin */}
                {hasAnyRole([UserRole.ADMIN]) && (
                  <Nav.Link as={Link} to="/mentor">Mentorship</Nav.Link>
                )}

                {/* Profile link is available to all authenticated users */}
                <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {!user ? (
              <>
                {/* Show Register button only to non-authenticated users */}
                <Nav.Link 
                  as={Link} 
                  to="/register" 
                  className="bg-green-500 px-4 py-2 mx-2 rounded hover:bg-green-700 text-black"
                >
                  Register
                </Nav.Link>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              </>
            ) : (
              <>
                <span className="text-white flex items-center mr-4">
                  Welcome, {user.name} ({user.role})
                </span>
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