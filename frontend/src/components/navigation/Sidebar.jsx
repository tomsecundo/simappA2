import React from 'react';
import SidebarMenu from 'react-bootstrap-sidebar-menu';
import { Link } from 'react-router-dom';
import { BsHouse, BsGear, BsPerson } from "react-icons/bs";

const Sidebar = ({ activeItem, setActiveItem, isOpen, closeSidebar }) => {
    const menuItems = [
        { icon: '🏠', label: 'Dashboard', active: true },
        { icon: '📄', label: 'Orders' },
        { icon: '🛍️', label: 'Products' },
        { icon: '👥', label: 'Customers' },
        { icon: '📊', label: 'Reports' },
        { icon: '🔗', label: 'Integrations' },
    ];

    const reportsSubmenu = [
        { label: 'Current month' },
        { label: 'Last quarter' },
        { label: 'Social engagement' },
        { label: 'Year-end sale' },
    ];

    const sidebarContent = (
        <div className='sidebar-content'>
            <ul className='nav flex-column'>
                {menuItems.map((item, index) => (
                    <li className='nav-item' key={index}>
                        <a
                            className={`nav-link ${item.active ? 'active' : ''}`}
                            aria-current={item.active ? 'page' : undefined}
                            href={`#${item.label.toLowerCase()}`}
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveItem(item.label);
                                closeSidebar();
                            }}
                        >
                            <span style={{ marginRight: '8px' }}>{item.icon}</span>
                            {item.label}
                        </a>
                    </li>
                ))}
            </ul>

            <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                <span>Saved reports</span>
                <a className="link-secondary" href="#add" aria-label="Add a new report">
                <span style={{ fontSize: '20px' }}>+</span>
                </a>
            </h6>
            <ul className="nav flex-column mb-2">
                {reportsSubmenu.map((item, index) => (
                <li className="nav-item" key={index}>
                    <a 
                    className="nav-link" 
                    href={`#${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={closeSidebar}
                    >
                    <span style={{ marginRight: '8px' }}>📑</span>
                    {item.label}
                    </a>
                </li>
                ))}
            </ul>
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
            
            {/* Sidebar - Desktop version */}
            <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-none d-md-block bg-light sidebar">
                <div className="position-sticky pt-3">
                {sidebarContent}
                </div>
            </nav>

            {/* Offcanvas - Mobile version */}
            <div 
                className={`offcanvas offcanvas-start d-md-none ${isOpen ? 'show' : ''}`} tabIndex="-1" id="offcanvasSidebar">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title">Menu</h5>
                    <button type="button" className="btn-close text-reset" onClick={closeSidebar} aria-label="Close"></button>
                </div>
                <div className="offcanvas-body p-0">
                    {sidebarContent}
                </div>
            </div>
        </>
    );
};

export default Sidebar;
