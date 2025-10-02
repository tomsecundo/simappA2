import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ activeItem, setActiveItem, isOpen, closeSidebar }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
        closeSidebar();
    };

    if (!user) return null;

    // Hardcoded frontend menu paths (mapped to backend APIs internally by pages)
    const menus = [
        { label: 'Dashboard', path: '/dashboard' },
        {
            label: 'Applications',
            children: [
                { label: 'All Applications', path: '/applications' },
                // { label: 'Pending Applications', path: '/applications/pending' },
                // { label: 'Accepted Applications', path: '/applications/accepted' },
            ],
        },
        {
            label: 'Programs',
            children: [
                { label: 'All Programs', path: '/programs' },
                { label: 'Create Program', path: '/programs/new' },
            ],
        },
        { label: 'Mentors', path: '/mentor' },
        {
            label: 'Availability',
            children: [
                { label: 'Availability', path: '/availabilitylist' },
                { label: 'New Availability', path: '/availabilitylist/new' },
            ],
        },
        {
            label: 'Sessions',
            children: [
                { label: 'All Sessions', path: '/sessions' },
                { label: 'New Session', path: '/sessions/new' },
            ],
        },
        {
            label: 'Progress',
            children: [
                { label: 'All Progress', path: '/progress' },
                { label: 'New Progress', path: '/progress/new' },
            ],
        },
        {
            label: 'Reports',
            children: [
                { label: 'All Reports', path: '/reports' },
                { label: 'New Report', path: '/reports/new' },
            ],
        },
        {
            label: 'Assignments',
            children: [
                { label: 'All Assignments', path: '/assignment' },
                { label: 'New Assignment', path: '/assignment/new' },
            ],
        },
        {
            label: 'Sessions',
            children: [
                { label: 'Session List', path: '/sessions' },
                { label: 'Avaialbility', path: '/availability' },
            ],
        },
        {
            label: 'Events',
            children: [
                { label: 'Events List', path: '/events' },
            ],
        },
    ];

    const toggleMenu = (label) => {
        setOpenMenu(openMenu === label ? null : label);
    };

    const sidebarContent = (
        <div className="sidebar-content">
            <ul className="nav flex-column">
                {menus.map((menu, idx) => (
                    <li key={idx} className="nav-item">
                        {menu.children && menu.children.length > 0 ? (
                            <>
                                <button
                                    className="nav-link w-100 text-start"
                                    onClick={() => toggleMenu(menu.label)}
                                >
                                    {menu.label}
                                </button>
                                {openMenu === menu.label && (
                                    <ul className="nav flex-column ms-3">
                                        {menu.children.map((child, i) => (
                                            <li key={i} className="nav-item">
                                                <Link
                                                    to={child.path}
                                                    className={`nav-link ${
                                                        activeItem === child.label ? 'active' : ''
                                                    }`}
                                                    onClick={() => {
                                                        setActiveItem(child.label);
                                                        closeSidebar();
                                                    }}
                                                >
                                                    {child.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </>
                        ) : (
                            <Link
                                to={menu.path}
                                className={`nav-link ${activeItem === menu.label ? 'active' : ''}`}
                                onClick={() => {
                                    setActiveItem(menu.label);
                                    closeSidebar();
                                }}
                            >
                                {menu.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ul>

            {/* Mobile-only user links */}
            <div className="mt-4 px-3 border-top pt-3 d-md-none">
                <p className="text-sm text-gray-600 mb-2">
                    Welcome, <strong>{user.name}</strong> ({user.role})
                </p>
                <Link
                    to="/profile"
                    className="block px-3 py-2 rounded hover:bg-gray-100 text-gray-700"
                    onClick={closeSidebar}
                >
                    Profile
                </Link>
                <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 mt-2 rounded bg-red-500 hover:bg-red-600 text-white"
                >
                    Logout
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="offcanvas-backdrop fade show d-md-none"
                    onClick={closeSidebar}
                />
            )}

            {/* Desktop sidebar */}
            <nav
                id="sidebarMenu"
                className="col-md-3 col-lg-2 d-none d-md-block bg-light sidebar"
            >
                <div className="position-sticky pt-3">{sidebarContent}</div>
            </nav>

            {/* Offcanvas for mobile */}
            <div
                className={`offcanvas offcanvas-start d-md-none ${isOpen ? 'show' : ''}`}
                tabIndex="-1"
                id="offcanvasSidebar"
            >
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title">Menu</h5>
                    <button
                        type="button"
                        className="btn-close text-reset"
                        onClick={closeSidebar}
                        aria-label="Close"
                    ></button>
                </div>
                <div className="offcanvas-body p-0">{sidebarContent}</div>
            </div>
        </>
    );
};

export default Sidebar;
