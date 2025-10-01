import React from 'react';
import { Navbar, Container, NavDropdown } from 'react-bootstrap';
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
        <Navbar bg="dark" variant="dark" className="sticky-top shadow px-3">
            <Container fluid className="d-flex justify-content-between align-items-center">
                {/* Brand */}
                <Navbar.Brand as={Link} to="/" className="me-0">
                    Startup Incubation
                </Navbar.Brand>

                {user ? (
                    <div className="d-flex align-items-center ms-auto">
                        {/* Custom toggle button (mobile only) */}
                        <button
                            type="button"
                            className="d-md-none bg-transparent border-0 text-white me-2"
                            onClick={toggleSidebar}
                            aria-label="Open menu"
                        >
                            {/* Standard hamburger icon */}
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        {/* Desktop dropdown (only visible on md and up) */}
                        <div className="d-none d-md-block">
                            <NavDropdown
                                id="user-dropdown"
                                align="end"
                                menuVariant="light"
                                title={
                                    <span className="text-white">
                                        Welcome, <strong>{user.name}</strong> ({user.role})
                                    </span>
                                }
                            >
                                <NavDropdown.Item as={Link} to="/profile">
                                    Profile
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout}>
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>

                        </div>
                    </div>
                ) : (
                    <div className="ms-auto d-flex">
                        <Link to="/login" className="nav-link text-white">
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="bg-green-500 px-4 py-2 mx-2 rounded hover:bg-green-700 text-white text-decoration-none"
                        >
                            Register
                        </Link>
                    </div>
                )}
            </Container>
        </Navbar>
    );
};

export default DashboardNavbar;
