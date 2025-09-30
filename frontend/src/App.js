import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedProfile from './pages/Profile/Profile';
import ProtectedApplications from './pages/Applications/Applications';
import ApplicationForm from './components/ApplicationForm';
import ProtectedApplicationDetail from './components/ApplicationDetail';
import ProtectedMentors from './pages/Mentorship/Mentor';
import ProtectedUpdateMentor from './pages/Mentorship/UpdateMentor';
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
            path="/mentor" 
            element={
              <RequireRole allowedRoles={[UserRole.ADMIN]}>
                <ProtectedMentors />
              </RequireRole>
            } 
          />
          <Route 
            path="/mentor/update/:id" 
            element={
              <RequireRole allowedRoles={[UserRole.ADMIN, UserRole.MENTOR]}>
                <ProtectedUpdateMentor />
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
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;