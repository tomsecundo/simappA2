import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DashboardNavbar = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    
    return (
        <Navbar bg="dark" variant='dark' className="sticky-top bg-dark flex-md-nowrap shadow" expand="lg">
            <Container fluid>
                <Navbar.Brand as={Link} to="/" className='col-md-3 col-lg-2 me-0 px-3'>Startup Incubation</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {user && (
                            <>
                                <NavDropdown title="Programs" id="navbarScrollingDropdown">
                                    <NavDropdown.Item to="/programs">All Programs</NavDropdown.Item>
                                    <NavDropdown.Item href="#action1">
                                        Another action
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="#action2">
                                        Something else here
                                    </NavDropdown.Item>
                                </NavDropdown>

                                <NavDropdown title="Applications" id="navbarScrollingDropdown">
                                    <NavDropdown.Item to="/applications">All Applications</NavDropdown.Item>
                                    <NavDropdown.Item href="#action1">
                                        Another action
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="#action2">
                                        Something else here
                                    </NavDropdown.Item>
                                </NavDropdown>

                                <NavDropdown title="Startups" id="navbarScrollingDropdown">
                                    <NavDropdown.Item to="/applications">All Startups</NavDropdown.Item>
                                    <NavDropdown.Item href="#action1">
                                        Another action
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="#action2">
                                        Something else here
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </>
                        )}
                    </Nav>
                    <Nav>
                        {!user ? (
                            <>
                                {/* Show Register button only to non-authenticated users */}
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Nav.Link 
                                    as={Link} 
                                    to="/register" 
                                    className="bg-green-500 px-4 py-2 mx-2 rounded hover:bg-green-700 text-black"
                                >
                                    Register
                                </Nav.Link>
                            </>
                            ) : (
                                <>
                                    <span className="text-white flex items-center mr-4">
                                        <Nav.Link as={Link} to="/profile">Welcome, {user.name} ({user.role})</Nav.Link>
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


export default DashboardNavbar;