import React from 'react';
import { Container } from 'react-bootstrap';
import Navbar from '../navigation/Navbar';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <Container fluid className="py-4">
        {children}
      </Container>
    </>
  );
};

export default Layout;