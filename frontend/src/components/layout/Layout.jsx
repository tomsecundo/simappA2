import React, { useState } from 'react';
import '../../styles/layout.css';

// Navbar Component
const DashboardNavbar = ({ toggleSidebar }) => {
  return (
    <nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
      <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#home">
        Company name
      </a>
      <button
        className="navbar-toggler position-absolute d-md-none"
        type="button"
        onClick={toggleSidebar}
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <input
        className="form-control form-control-dark w-100"
        type="text"
        placeholder="Search"
        aria-label="Search"
      />
      <div className="navbar-nav">
        <div className="nav-item text-nowrap">
          <a className="nav-link px-3" href="#signout">
            Sign out
          </a>
        </div>
      </div>
    </nav>
  );
};

// Sidebar Component
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
    <div className="sidebar-content">
      <ul className="nav flex-column">
        {menuItems.map((item, index) => (
          <li className="nav-item" key={index}>
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
      <div className={`offcanvas offcanvas-start d-md-none ${isOpen ? 'show' : ''}`} tabIndex="-1" id="offcanvasSidebar">
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

// Layout Component
const DashboardLayout = ({ children }) => {
  return (
    <div className="container-fluid">
      <div className="row">
        {children}
      </div>
    </div>
  );
};

// Main App Component
export default function App() {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <DashboardNavbar toggleSidebar={toggleSidebar} />
      <DashboardLayout>
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} isOpen={sidebarOpen} closeSidebar={closeSidebar} />
      </DashboardLayout>
    </div>
  );
}