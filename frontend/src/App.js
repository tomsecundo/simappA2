import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// components
import Layout from './components/layout/Layout';
import ApplicationForm from './components/ApplicationForm';
import ProtectedApplicationDetail from './components/ApplicationDetail';
import RequireRole from './components/RequireRole';

// pages
import Unauthorized from './pages/Unauthorized';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedProfile from './pages/Profile/Profile';
import ProtectedApplications from './pages/Applications/Applications';
import ProgramList from './pages/Program/ProgramList';
import ProgramForm from './pages/Program/ProgramForm';

// constants
import { UserRole } from './constants/UserRole';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route 
                        path="/programs" 
                        element={
                            <RequireRole allowedRoles={[UserRole.ADMIN]}>
                                <ProgramList />
                            </RequireRole>
                        }
                    />
                    <Route 
                        path="/programs/new" 
                        element={
                            <RequireRole allowedRoles={[UserRole.ADMIN]}>
                            <ProgramForm />
                            </RequireRole>
                        }
                    />
                    <Route 
                        path="/programs/:id/edit" 
                        element={
                            <RequireRole allowedRoles={[UserRole.ADMIN]}>
                            <ProgramForm />
                            </RequireRole>
                        }
                    />
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
                    <Route path="/unauthorized" element={<Unauthorized />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
