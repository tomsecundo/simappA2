import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import DashboardNavbar from '../navigation/DashboardNavbar';
import Sidebar from '../navigation/Sidebar';
import { useAuth } from '../../context/AuthContext';

import '../../styles/layout.css';

// Layout Component
const Layout = ({ children }) => {
    const { user } = useAuth();

    const [activeItem, setActiveItem] = useState('Dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <>
            <div style={{ minHeight: '100vh' }}>
                <DashboardNavbar toggleSidebar={toggleSidebar} />
                <Container fluid>
                    <div className='row'>
                        <>
                            {user && (
                                <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} isOpen={sidebarOpen} closeSidebar={closeSidebar} />
                            )}
                        </>
                        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                            { children }
                        </main>
                    </div>
                </Container>
            </div>
        </>
    );
};

export default Layout;