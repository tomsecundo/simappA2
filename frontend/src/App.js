import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Reports from './pages/Reports/Reports';
import ProtectedProfile from './pages/Profile/Profile';
import ProtectedApplications from './pages/Applications/Applications';
import ApplicationForm from './components/ApplicationForm';
import ProtectedApplicationDetail from './components/ApplicationDetail';
import Unauthorized from './pages/Unauthorized';
import RequireRole from './components/RequireRole';
import { UserRole } from './constants/UserRole';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/applications" 
            element={
              <RequireRole allowedRoles={[UserRole.ADMIN, UserRole.MENTOR]}>
                <ProtectedApplications />
              </RequireRole>
            } 
          />
          <Route 
            path="/applications/:id" 
            element={
              <RequireRole allowedRoles={[UserRole.ADMIN, UserRole.MENTOR, UserRole.STARTUP]}>
                <ProtectedApplicationDetail />
              </RequireRole>
            } 
          />
          <Route 
            path="/applications/apply" 
            element={
              <RequireRole allowedRoles={[UserRole.STARTUP]}>
                <ApplicationForm />
              </RequireRole>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <RequireRole allowedRoles={[UserRole.ADMIN, UserRole.MENTOR, UserRole.STARTUP]}>
                <ProtectedProfile />
              </RequireRole>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <RequireRole allowedRoles={[UserRole.ADMIN, UserRole.MENTOR, UserRole.STARTUP]}>
                <Reports />
              </RequireRole>
            } 
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
