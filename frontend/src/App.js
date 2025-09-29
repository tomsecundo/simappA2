import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// layout
import Layout from './components/layout/Layout';

// pages
import Unauthorized from './pages/Unauthorized';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedProfile from './pages/Profile/Profile';

// Application feature
import ApplicationsList from './pages/Application/ApplicationsList';
import ApplicationDetail from './pages/Application/ApplicationDetail';
import ApplicationForm from './pages/Application/ApplicationForm';

// Program feature
import ProgramList from './pages/Program/ProgramList';
import ProgramForm from './pages/Program/ProgramForm';

// Guards
import RequireRole from './components/RequireRole';

// constants
import { UserRole } from './constants/UserRole';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Programs */}
                    <Route path="/programs" element={<ProgramList />} />
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

                    {/* Applications */}
                    <Route 
                        path="/applications" 
                        element={ <ApplicationsList /> } 
                    />
                    {/* Applications */}
                    <Route 
                        path="/applications/new" 
                        element={ <ApplicationForm /> } 
                    />
                    <Route 
                        path="/applications/:id" 
                        element={
                        <RequireRole allowedRoles={[UserRole.ADMIN, UserRole.MENTOR, UserRole.STARTUP]}>
                            <ApplicationDetail />
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

                    {/* Profile */}
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
