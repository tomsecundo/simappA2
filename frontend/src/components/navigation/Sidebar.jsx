import React from 'react';
import SidebarMenu from 'react-bootstrap-sidebar-menu';
import { Link } from 'react-router-dom';
import { BsHouse, BsGear, BsPerson } from "react-icons/bs";

const Sidebar = ({ collapsed, setCollapsed }) => (
  <SidebarMenu collapsed={collapsed} className="bg-dark text-white vh-100">
    <SidebarMenu.Header>
      <SidebarMenu.Brand>MyApp</SidebarMenu.Brand>
      <SidebarMenu.Toggle
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Toggle sidebar"
      />
    </SidebarMenu.Header>
    <SidebarMenu.Body>
      <SidebarMenu.Nav>
        <SidebarMenu.Nav.Link as={Link} to="/">
          <SidebarMenu.Nav.Icon>
            <BsHouse />
          </SidebarMenu.Nav.Icon>
          <SidebarMenu.Nav.Title>Dashboard</SidebarMenu.Nav.Title>
        </SidebarMenu.Nav.Link>
        <SidebarMenu.Sub>
          <SidebarMenu.Sub.Toggle>
            <SidebarMenu.Nav.Icon>
              <BsGear />
            </SidebarMenu.Nav.Icon>
            <SidebarMenu.Nav.Title>Settings</SidebarMenu.Nav.Title>
          </SidebarMenu.Sub.Toggle>
          <SidebarMenu.Sub.Collapse>
            <SidebarMenu.Nav>
              <SidebarMenu.Nav.Link as={Link} to="/profile-settings">
                <SidebarMenu.Nav.Title>Profile Settings</SidebarMenu.Nav.Title>
              </SidebarMenu.Nav.Link>
              <SidebarMenu.Nav.Link as={Link} to="/account">
                <SidebarMenu.Nav.Title>Account</SidebarMenu.Nav.Title>
              </SidebarMenu.Nav.Link>
            </SidebarMenu.Nav>
          </SidebarMenu.Sub.Collapse>
        </SidebarMenu.Sub>
        <SidebarMenu.Nav.Link as={Link} to="/profile">
          <SidebarMenu.Nav.Icon>
            <BsPerson />
          </SidebarMenu.Nav.Icon>
          <SidebarMenu.Nav.Title>Profile</SidebarMenu.Nav.Title>
        </SidebarMenu.Nav.Link>
      </SidebarMenu.Nav>
    </SidebarMenu.Body>
  </SidebarMenu>
);

export default Sidebar;
